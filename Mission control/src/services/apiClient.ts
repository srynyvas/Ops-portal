import { apiConfig, getApiUrl } from '../config/apiConfig';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  query?: Record<string, any>;
  retries?: number;
}

class ApiClient {
  private abortControllers: Map<string, AbortController> = new Map();

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private buildUrl(endpoint: string, params?: Record<string, string>, query?: Record<string, any>): string {
    let url = getApiUrl(endpoint, params);
    
    if (query) {
      const queryString = new URLSearchParams(
        Object.entries(query)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString();
      
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(response.status, response.statusText, errorData);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as T;
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestOptions,
    retries: number = apiConfig.retryAttempts
  ): Promise<T> {
    const requestId = `${options.method || 'GET'}-${url}`;
    
    const existingController = this.abortControllers.get(requestId);
    if (existingController) {
      existingController.abort();
    }
    
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);

    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, apiConfig.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
        headers: {
          ...apiConfig.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
      
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);

      if (error instanceof ApiError) {
        if (error.status >= 500 && retries > 0) {
          await this.delay(apiConfig.retryDelay);
          return this.fetchWithRetry<T>(url, options, retries - 1);
        }
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        
        if (retries > 0) {
          await this.delay(apiConfig.retryDelay);
          return this.fetchWithRetry<T>(url, options, retries - 1);
        }
      }

      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params, options?.query);
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params, options?.query);
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params, options?.query);
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params, options?.query);
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params, options?.query);
    return this.fetchWithRetry<T>(url, {
      ...options,
      method: 'DELETE',
    });
  }

  cancelRequest(method: string, url: string): void {
    const requestId = `${method}-${url}`;
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }
}

export const apiClient = new ApiClient();