import axios, { AxiosError } from 'axios';
import { HTTPClient } from '../src/client';
import { RespondIOError } from '../src/errors';

jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('HTTPClient', () => {
  let client: HTTPClient;

  beforeEach(() => {
    mockAxios.create.mockReturnThis();
    mockAxios.request.mockClear();
    client = new HTTPClient({
      apiToken: 'test-token',
      baseUrl: 'https://api.test.com',
      maxRetries: 2,
      timeout: 5000,
    });
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 123, name: 'Test' };
      mockAxios.request.mockResolvedValueOnce({ data: mockData });

      const result = await client.get('/test');

      expect(result).toEqual(mockData);
      expect(mockAxios.request).toHaveBeenCalledWith({
        method: 'get',
        url: '/test',
        params: undefined,
        data: undefined,
      });
    });

    it('should append query parameters', async () => {
      mockAxios.request.mockResolvedValueOnce({ data: {} });

      await client.get('/test', { limit: 10, cursor: 'abc' });

      expect(mockAxios.request).toHaveBeenCalledWith({
        method: 'get',
        url: '/test',
        params: { limit: 10, cursor: 'abc' },
        data: undefined,
      });
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { success: true };
      const requestBody = { name: 'Test' };
      mockAxios.request.mockResolvedValueOnce({ data: mockData });

      const result = await client.post('/test', requestBody);

      expect(result).toEqual(mockData);
      expect(mockAxios.request).toHaveBeenCalledWith({
        method: 'post',
        url: '/test',
        params: undefined,
        data: requestBody,
      });
    });
  });

  describe('Error handling', () => {
    it('should throw RespondIOError on API error', async () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { code: 123, message: 'Invalid request' },
          headers: {},
        },
      } as AxiosError;
      mockAxios.request.mockRejectedValueOnce(error);

      await expect(client.get('/test')).rejects.toThrow(RespondIOError);
    });

    it('should retry on network error', async () => {
      const networkError = new AxiosError('Network error');
      networkError.request = {}; // Simulate a network error
      networkError.response = undefined;

      mockAxios.request.mockRejectedValueOnce(networkError);
      mockAxios.request.mockResolvedValueOnce({ data: { success: true } });

      await expect(client.get('/test')).resolves.toEqual({ success: true });
      expect(mockAxios.request).toHaveBeenCalledTimes(2);
    });
  });
});
