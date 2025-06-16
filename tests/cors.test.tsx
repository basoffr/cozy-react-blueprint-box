import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSequenceData } from '../src/hooks/useSequenceData';
import * as apiModule from '../src/api/api';

// Store original apiRequest function to restore later
const originalApiRequest = apiModule.apiRequest;

// Create wrapper with QueryClient for testing hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('API URL handling', () => {
  // Mock apiRequest instead of fetch directly
  const mockApiRequest = jest.fn();
  
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Mock apiRequest to return empty object
    mockApiRequest.mockResolvedValue({});
    
    // Replace the real apiRequest with our mock
    Object.defineProperty(apiModule, 'apiRequest', {
      value: mockApiRequest,
      writable: true,
    });
  });
  
  afterAll(() => {
    // Restore original apiRequest
    Object.defineProperty(apiModule, 'apiRequest', {
      value: originalApiRequest,
      writable: true,
    });
  });
  
  test('useSequenceData uses correct API paths', async () => {
    // Track paths passed to apiRequest
    const calledPaths: string[] = [];
    mockApiRequest.mockImplementation((path: string) => {
      calledPaths.push(path);
      return Promise.resolve({});
    });
    
    // Render the hook
    renderHook(() => useSequenceData('template-123'), {
      wrapper: createWrapper(),
    });
    
    // Wait for API calls to complete
    await waitFor(() => {
      expect(calledPaths.length).toBeGreaterThanOrEqual(3);
    });
    
    // Check that all API calls use correct paths
    expect(calledPaths).toContain('/templates/template-123');
    expect(calledPaths).toContain('/templates?type=email');
    expect(calledPaths).toContain('/templates/template-123/sequence');
    
    // Verify no hardcoded API URLs
    calledPaths.forEach(path => {
      expect(path).not.toContain('https://api.mydomain.com');
    });
  });
  
  test('apiRequest is called with proper parameters', async () => {
    // Render the hook
    renderHook(() => useSequenceData('template-123'), {
      wrapper: createWrapper(),
    });
    
    // Wait for API calls to complete
    await waitFor(() => {
      expect(mockApiRequest.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
    
    // Verify apiRequest was called with the correct paths
    expect(mockApiRequest).toHaveBeenCalledWith('/templates/template-123');
    expect(mockApiRequest).toHaveBeenCalledWith('/templates?type=email');
    expect(mockApiRequest).toHaveBeenCalledWith('/templates/template-123/sequence');
  });
});

