"use client"; 

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; 
import * as authService from '@/services/authService';
// api.js'yi de import ettiğinizi varsayıyorum, ancak interceptor için gerekli.
// import api from '@/services/api'; 

// 1. Context'in tutacağı verinin TİPİNİ tanımla
interface DecodedToken {
  userId: number;
  sub: string;
  firstName: string;
  lastName: string;
  roles: string[];
  iat: number;
  exp: number;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 2. Context'i TİP ile ve varsayılan değer olarak null ile oluştur
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Provider Bileşeni
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // State'i tiple
  const [token, setToken] = useState<string | null>(null); // State'i tiple
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        const decodedToken = jwtDecode<DecodedToken>(storedToken); // Tipi belirt
        const isExpired = decodedToken.exp * 1000 < Date.now();
        
        if (isExpired) {
          console.log("Saklanan token'ın süresi dolmuş.");
          localStorage.removeItem('token');
        } else {
          setToken(storedToken);
          setUser({
            id: decodedToken.userId,
            email: decodedToken.sub,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            roles: decodedToken.roles,
          });
        }
      }
    } catch (error) {
      console.error("Token kontrolü sırasında hata:", error);
      localStorage.removeItem('token'); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login fonksiyonunu tiple
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      const { token: newToken } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      const decodedToken = jwtDecode<DecodedToken>(newToken); // Tipi belirt
      setUser({
        id: decodedToken.userId,
        email: decodedToken.sub,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        roles: decodedToken.roles,
      });

      router.push('/dashboard'); 
    } catch (error) {
      console.error("Giriş başarısız:", error);
      throw error; 
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !isLoading && !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Özel Hook (useAuth) - Tipi doğru döndürür
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth hook, bir AuthProvider içinde kullanılmalıdır');
  }
  // Context null değilse, tipi AuthContextType olarak garanti edilir
  return context;
};
