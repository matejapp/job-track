import { apiRequest } from "./httpClient";

const authRequest = (path, body) =>
  apiRequest(path, {
    method: "POST",
    body,
    auth: false,
    redirectOnUnauthorized: false,
  });

export const login = ({ email, password }) =>
  authRequest("/auth/login", { email, password });

export const register = ({ name, email, password }) =>
  authRequest("/auth/register", { name, email, password });
