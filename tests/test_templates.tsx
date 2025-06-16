import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewCampaignContent } from '../src/components/NewCampaignContent';
import { BrowserRouter } from 'react-router-dom';
import { NewCampaignProvider } from '../src/contexts/NewCampaignContext';
import * as api from '../src/services/api';

// Mock the API services
jest.mock('../src/services/api', () => ({
  templatesApi: {
    getAll: jest.fn(),
    preview: jest.fn(),
  }
}));

jest.mock('../src/hooks/useNavigateBack', () => ({
  useNavigateBack: () => jest.fn()
}));

describe('NewCampaignContent Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Reset mocks
    jest.clearAllMocks();
  });

  test('should handle undefined data without crashing', async () => {
    // Mock API response as undefined
    (api.templatesApi.getAll as jest.Mock).mockResolvedValue(undefined);

    // Render the component
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <NewCampaignProvider>
            <NewCampaignContent />
          </NewCampaignProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );

    // Should show loading state
    expect(screen.getByText('Loading templates...')).toBeTruthy();
  });

  test('should handle empty items array without crashing', async () => {
    // Mock API response with empty items array
    (api.templatesApi.getAll as jest.Mock).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      size: 10
    });

    // Render the component
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <NewCampaignProvider>
            <NewCampaignContent />
          </NewCampaignProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );

    // Wait for the component to update and show empty state
    await waitFor(() => {
      expect(screen.getByText('No templates available')).toBeTruthy();
    });
  });
});
