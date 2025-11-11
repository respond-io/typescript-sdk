/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { RespondIOError } from './errors/index.js';
import { APIError, RateLimitInfo } from './types/common.js';

/**
 * Configuration options for the RespondIO SDK
 */
export interface RespondIOConfig {
  /** API access token for authentication */
  apiToken: string;
  /** Base URL for API requests (default: https://api.respond.io/v2) */
  baseUrl?: string;
  /** Maximum number of retry attempts for failed requests */
  maxRetries?: number;
  /** Timeout for API requests in milliseconds */
  timeout?: number;
}

/**
 * Base HTTP client for the respond.io API
 */
export class HTTPClient {
  private readonly axios: AxiosInstance;
  private readonly maxRetries: number;

  constructor(config: RespondIOConfig) {
    this.axios = axios.create({
      baseURL: config.baseUrl || 'https://api.respond.io/v2',
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: config.timeout || 30000,
    });
    this.maxRetries = config.maxRetries || 3;
  }

  /**
   * Extract rate limit information from response headers
   */
  private extractRateLimitInfo(response: AxiosResponse): RateLimitInfo | undefined {
    const limit = response.headers['x-ratelimit-limit'];
    const remaining = response.headers['x-ratelimit-remaining'];
    const retryAfter = response.headers['retry-after'];

    if (limit && remaining) {
      return {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
      };
    }

    return undefined;
  }

  /**
   * Handle API error responses
   */
  private handleErrorResponse(error: AxiosError<APIError>): never {
    if (error.response) {
      const rateLimitInfo = this.extractRateLimitInfo(error.response);
      const { status, data } = error.response;
      throw new RespondIOError(status, data.code, data.message, rateLimitInfo);
    }

    throw new RespondIOError(0, 0, error.message);
  }

  /**
   * Execute an HTTP request with retry logic
   */
  private async executeRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    params?: Record<string, any>,
    body?: any,
    attempt = 1
  ): Promise<T> {
    try {
      const response = await this.axios.request<T>({
        method,
        url: path,
        params,
        data: body,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          (error.response &&
            (error.response.status === 429 || error.response.status >= 500) &&
            attempt < this.maxRetries) ||
          (!error.response && attempt < this.maxRetries)
        ) {
          const rateLimitInfo = error.response
            ? this.extractRateLimitInfo(error.response)
            : undefined;
          const delay = rateLimitInfo?.retryAfter
            ? rateLimitInfo.retryAfter * 1000
            : Math.min(1000 * Math.pow(2, attempt), 10000);

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.executeRequest<T>(method, path, params, body, attempt + 1);
        }

        this.handleErrorResponse(error);
      }

      if (error instanceof Error) {
        throw new RespondIOError(0, 0, error.message);
      }

      throw new RespondIOError(0, 0, 'Unknown error occurred');
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.executeRequest<T>('get', path, params);
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, body?: any, params?: Record<string, any>): Promise<T> {
    return this.executeRequest<T>('post', path, params, body);
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, body?: any): Promise<T> {
    return this.executeRequest<T>('put', path, undefined, body);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string, body?: any): Promise<T> {
    return this.executeRequest<T>('delete', path, undefined, body);
  }
}
