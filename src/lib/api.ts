import { executeFallbackApi } from './apiFallback.js';

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const urlStr = input;

  try {
    const rawFetch = window.fetch ? window.fetch.bind(window) : undefined;
    if (rawFetch) {
      const response = await rawFetch(input, init);
      const contentType = response.headers.get('content-type') || '';
      
      // If we got a valid JSON or non-HTML non-404 response from the server, return it!
      if (response.status < 400 && !contentType.includes('text/html')) {
        return response;
      }
      
      // If server returned 401/403/400 and it IS valid json, return it
      if (contentType.includes('application/json') && response.status !== 404 && response.status !== 502) {
        return response;
      }
    }
  } catch (err) {
    // Network failed or offline
  }

  // Fallback to client-side database
  return executeFallbackApi(urlStr, init);
}
