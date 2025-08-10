import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiError } from '../services/apiClient';

export interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | Error | null;
  execute: (...args: any[]) => Promise<T | void>;
  reset: () => void;
}

export interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError | Error) => void;
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiCallOptions = {}
): ApiCallState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const isMounted = useRef(true);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | void> => {
      if (abortController.current) {
        abortController.current.abort();
      }
      
      abortController.current = new AbortController();
      
      setLoading(true);
      setError(null);
      
      let retries = options.retryCount || 0;
      
      while (retries >= 0) {
        try {
          const result = await apiFunction(...args);
          
          if (isMounted.current) {
            setData(result);
            setLoading(false);
            options.onSuccess?.(result);
            return result;
          }
        } catch (err) {
          if (retries > 0) {
            retries--;
            await new Promise(resolve => 
              setTimeout(resolve, options.retryDelay || 1000)
            );
            continue;
          }
          
          if (isMounted.current) {
            const error = err as ApiError | Error;
            setError(error);
            setLoading(false);
            options.onError?.(error);
            
            if (error instanceof ApiError) {
              console.error(`API Error ${error.status}: ${error.statusText}`, error.data);
            } else {
              console.error('Request failed:', error);
            }
          }
          break;
        }
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, []);

  return { data, loading, error, execute, reset };
}

export function useApiPolling<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  interval: number,
  options: UseApiCallOptions = {}
): ApiCallState<T> & { stop: () => void; start: () => void } {
  const apiCall = useApiCall(apiFunction, options);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const start = useCallback(() => {
    if (!isPolling) {
      setIsPolling(true);
      apiCall.execute();
      intervalRef.current = setInterval(() => {
        apiCall.execute();
      }, interval);
    }
  }, [apiCall, interval, isPolling]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { ...apiCall, stop, start };
}