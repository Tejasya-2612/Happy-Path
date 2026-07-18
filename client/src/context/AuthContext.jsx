import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api.js';
import { logCrudInteraction } from '../utils/analytics.js';

const AuthContext = createContext(null);
const storageKey = 'happy-path-auth';

function readStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || { token: '', user: null };
  } catch {
    return { token: '', user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    setAuthToken(auth.token);
    localStorage.setItem(storageKey, JSON.stringify(auth));
  }, [auth]);

  async function login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    setAuth(data);
    logCrudInteraction();
  }

  async function register(values) {
    const { data } = await api.post('/auth/register', values);
    setAuth(data);
  }

  function logout() {
    setAuth({ token: '', user: null });
    logCrudInteraction();
  }

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      login,
      register,
      logout
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
