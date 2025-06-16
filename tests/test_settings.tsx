import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SettingsContent } from '../src/components/SettingsContent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../src/services/api';

// Mock the API services
jest.mock('../src/services/api', () => ({
  sendersApi: {
    getAll: jest.fn(),
  },
  settingsApi: {
    get: jest.fn(),
    update: jest.fn(),
  },
}));

describe('SettingsContent Component', () => {
  let queryClient: QueryClient;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock API responses
    (api.sendersApi.getAll as jest.Mock).mockResolvedValue([]);
    (api.settingsApi.get as jest.Mock).mockResolvedValue({
      emailSignature: 'Test Signature',
      defaultFromName: 'Test Company',
      replyToEmail: 'test@example.com',
      trackOpens: true,
      trackClicks: false,
    });

    // Spy on console.error to catch React warnings
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Clean up
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  test('should not have controlled to uncontrolled input warnings', async () => {
    // Mock a delay in the API response to test the transition from loading to loaded state
    let resolveSettingsPromise: (value: any) => void;
    const settingsPromise = new Promise((resolve) => {
      resolveSettingsPromise = resolve;
    });
    
    (api.settingsApi.get as jest.Mock).mockImplementation(() => settingsPromise);

    // Render the component with the QueryClientProvider
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsContent />
      </QueryClientProvider>
    );

    // Verify inputs are controlled with empty/default values before data loads
    const defaultFromNameInput = screen.getByLabelText(/Default From Name/i) as HTMLInputElement;
    const replyToEmailInput = screen.getByLabelText(/Reply-To Email/i) as HTMLInputElement;
    
    expect(defaultFromNameInput.value).toBe('');
    expect(replyToEmailInput.value).toBe('');

    // Resolve the settings data after a short delay
    setTimeout(() => {
      resolveSettingsPromise!({
        emailSignature: 'Test Signature',
        defaultFromName: 'Test Company',
        replyToEmail: 'test@example.com',
        trackOpens: true,
        trackClicks: false,
      });
    }, 100);

    // Wait for the settings data to be loaded
    await waitFor(() => {
      expect(defaultFromNameInput.value).toBe('Test Company');
    });

    // Check that no controlled to uncontrolled warnings were logged
    const controlledWarning = 'Warning: A component is changing a controlled input to be uncontrolled';
    const uncontrolledWarning = 'Warning: A component is changing an uncontrolled input to be controlled';
    
    const errorCalls = consoleErrorSpy.mock.calls;
    const hasControlledWarning = errorCalls.some(call => 
      call.some(arg => typeof arg === 'string' && 
        (arg.includes(controlledWarning) || arg.includes(uncontrolledWarning)))
    );
    
    expect(hasControlledWarning).toBe(false);
  });

  test('should render form fields with initial empty values before data loads', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsContent />
      </QueryClientProvider>
    );

    // Check that form fields have empty values initially
    const defaultFromNameInput = screen.getByLabelText(/Default From Name/i) as HTMLInputElement;
    expect(defaultFromNameInput.value).toBe('');
  });

  test('should update form fields when settings data is loaded', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SettingsContent />
      </QueryClientProvider>
    );

    // Wait for the settings data to be loaded and check that form fields are updated
    await waitFor(() => {
      expect((screen.getByLabelText(/Default From Name/i) as HTMLInputElement).value).toBe('Test Company');
      expect((screen.getByLabelText(/Reply-To Email/i) as HTMLInputElement).value).toBe('test@example.com');
      expect((screen.getByLabelText(/Email Signature/i) as HTMLTextAreaElement).value).toBe('Test Signature');
    });
  });
});
