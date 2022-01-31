/**
 * Client that sends vanilla requests to the server endpoints.
 */
const createServerRestClient = () => {
  const baseUrl = 'http://localhost:3000/';

  const fetchEndpoint = async <T = any>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> => {
    const cleanEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
    const res = await fetch(`${baseUrl}${cleanEndpoint}`, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return await res.json();
  };

  const get = <T = any>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchEndpoint(endpoint, { ...options, method: 'GET' });

  const post = <T = any>(endpoint: string, options?: RequestInit): Promise<T> =>
    fetchEndpoint(endpoint, { ...options, method: 'POST' });

  return {
    fetch: fetchEndpoint,
    get,
    post,
  };
};

export const serverRestClient = createServerRestClient();
