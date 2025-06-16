import { apiRequest } from '../src/api/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return parsed JSON directly, not a Response object', async () => {
    // Mock data
    const mockData = { id: 1, name: 'Test' };
    
    // Setup fetch mock to return our data
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(mockData)
    });

    // Call apiRequest
    const result = await apiRequest('/test-endpoint');
    
    // Verify the result is the parsed JSON object, not a Response
    expect(result).toEqual(mockData);
    
    // Verify that json() was called exactly once (inside apiRequest)
    expect((global.fetch as jest.Mock).mock.results[0].value.json).toHaveBeenCalledTimes(1);
  });

  it('should throw an error for non-ok responses', async () => {
    // Setup fetch mock to return an error response
    const errorMessage = 'Not found';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValueOnce(errorMessage)
    });

    // Expect apiRequest to throw an error
    await expect(apiRequest('/test-endpoint')).rejects.toThrow(errorMessage);
  });

  it('should handle 204 No Content responses', async () => {
    // Setup fetch mock to return 204 No Content
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
      // No json method for 204 responses
    });

    // Call apiRequest
    const result = await apiRequest('/test-endpoint');
    
    // Verify the result is an empty object
    expect(result).toEqual({});
  });
});
