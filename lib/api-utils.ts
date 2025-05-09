import { cookies } from 'next/headers';

/**
 * Utility to make authenticated API requests from server components
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  // Get cookies for authentication
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  // Build headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    'Cookie': cookieHeader,
    ...(options.headers || {}),
  };

  // Determine the base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Build the full URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Make the request
  return fetch(url, {
    ...options,
    headers,
    cache: options.cache || 'no-store', // Default to no-store for fresh data
  });
}

/**
 * Get data from an API endpoint with authentication
 */
export async function getFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Post data to an API endpoint with authentication
 */
export async function postToApi<T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Put data to an API endpoint with authentication
 */
export async function putToApi<T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Delete data from an API endpoint with authentication
 */
export async function deleteFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetchWithAuth(endpoint, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Check if the current user has the required role
 * Returns true if authorized, false if not
 */
export async function checkRole(requiredRole?: string): Promise<boolean> {
  try {
    const endpoint = requiredRole 
      ? `/api/auth/check-role?role=${requiredRole}`
      : '/api/auth/check-role';
    
    const response = await fetchWithAuth(endpoint);
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.success && data.authorized;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
} 