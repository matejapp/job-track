const API_URL = import.meta.env.VITE_BASE_API as string;

export const AUTH_UNAUTHORIZED_EVENT = 'jobtrack:auth-unauthorized';

export interface ApiRequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  auth?: boolean
  redirectOnUnauthorized?: boolean
}

export class ApiError extends Error {
  code?: string
  traceId?: string
  status?: number
  fieldErrors?: Array<{ field?: string; message: string }>

  constructor(message: string, details: Partial<Omit<ApiError, keyof Error | 'name'>> = {}) {
    super(message);
    this.name = 'ApiError';
    Object.assign(this, details);
  }
}

const parseJson = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return null;
  return response.json().catch(() => ({}));
};

interface ErrorBody {
  error?: { message?: string; code?: string }
  traceId?: string
  errors?: Array<{ field?: string; message: string }>
}

const createError = (response: Response, data: ErrorBody): ApiError => {
  if (data?.error?.message) {
    return new ApiError(data.error.message, {
      code: data.error.code,
      traceId: data.traceId,
      status: response.status,
    });
  }

  if (Array.isArray(data?.errors)) {
    return new ApiError(data.errors.map((e) => e.message).join(', '), {
      code: 'VALIDATION_FAILED',
      fieldErrors: data.errors,
      status: response.status,
    });
  }

  return new ApiError(`Request failed ${response.status}`, {
    status: response.status,
  });
};

const handleUnauthorized = (): void => {
  localStorage.removeItem('token');
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

export async function apiRequest<T = unknown>(
  path: string,
  {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    redirectOnUnauthorized = auth,
  }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders: Record<string, string> = { ...headers };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const error = createError(response, data as ErrorBody);

    if (response.status === 401 && redirectOnUnauthorized) {
      handleUnauthorized();
    }

    throw error;
  }

  return data as T;
}
