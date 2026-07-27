import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authApi } from '../api/authApi';
import { getStoredRefreshToken, setAccessToken, setStoredRefreshToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 'loading' = đang kiểm tra phiên cũ lúc mới mở app; tránh nháy màn hình
  // Login trước khi biết chắc người dùng đã đăng nhập hay chưa.
  const [loading, setLoading] = useState(true);
  const didRestoreRef = useRef(false);

  useEffect(() => {
    if (didRestoreRef.current) return;
    didRestoreRef.current = true;
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function restoreSession() {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      setLoading(false);
      return;
    }
    try {
      const data = await authApi.refresh(refreshToken);
      setAccessToken(data.accessToken);
      setStoredRefreshToken(data.refreshToken);
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      setAccessToken(null);
      setStoredRefreshToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await authApi.login({ email, password });
    setAccessToken(data.accessToken);
    setStoredRefreshToken(data.refreshToken);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    return authApi.register(payload);
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // Dù API logout lỗi (mất mạng...) vẫn xoá phiên cục bộ để người dùng thoát được
    }
    setAccessToken(null);
    setStoredRefreshToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
