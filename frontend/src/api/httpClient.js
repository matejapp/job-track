const API_URL = import.meta.env.VITE_BASE_API;

export const AUTH_UNAUTHORIZED_EVENT = "jobtrack:auth-unauthorized";

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    Object.assign(this, details);
  }
}

const parseJson = async (response) => {
  if (response.status === 204) return null;
  return response.json().catch(() => ({}));
};

const createError = (response, data) => {
  if (data?.error?.message) {
    return new ApiError(data.error.message, {
      code: data.error.code,
      traceId: data.traceId,
      status: response.status,
    });
  }

  if (Array.isArray(data?.errors)) {
    return new ApiError(data.errors.map((error) => error.message).join(", "), {
      code: "VALIDATION_FAILED",
      fieldErrors: data.errors,
      status: response.status,
    });
  }

  return new ApiError(`Request failed ${response.status}`, {
    status: response.status,
  });
};

const handleUnauthorized = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

export async function apiRequest(
  path,
  {
    method = "GET",
    body,
    headers = {},
    auth = true,
    redirectOnUnauthorized = auth,
  } = {},
) {
  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const error = createError(response, data);

    if (response.status === 401 && redirectOnUnauthorized) {
      handleUnauthorized();
    }

    throw error;
  }

  return data;
}
