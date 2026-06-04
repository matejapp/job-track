import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { AUTH_UNAUTHORIZED_EVENT } from '@/api/httpClient'
import type { AuthContextValue, User } from '@/types'

const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  saveToken: () => {},
  saveUser: () => {},
  logout: () => {},
})

function parseStoredUser(): User | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try { return JSON.parse(raw) as User }
  catch { localStorage.removeItem('user'); return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token'),
  )
  const [user, setUser] = useState<User | null>(parseStoredUser)

  useEffect(() => {
    const handle = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handle)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handle)
  }, [])

  const saveToken = (t: string) => {
    localStorage.setItem('token', t)
    setToken(t)
  }

  const saveUser = (u: User | null) => {
    if (!u) {
      localStorage.removeItem('user')
      setUser(null)
      return
    }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, saveToken, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
