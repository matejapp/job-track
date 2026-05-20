import { createContext, useContext, useEffect, useState } from "react";
import { AUTH_UNAUTHORIZED_EVENT } from "../src/api/httpClient";

const AuthContext = createContext(null);

const parseStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const normalizeUser = (newUser) => {
  if (!newUser) return null;
  if (typeof newUser === "string") return { name: newUser };
  return newUser;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(parseStoredUser);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const saveUser = (newUser) => {
    const normalizedUser = normalizeUser(newUser);

    if (!normalizedUser) {
      localStorage.removeItem("user");
      setUser(null);
      return;
    }

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, logout, user, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
