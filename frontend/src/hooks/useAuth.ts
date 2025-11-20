import { useState, useEffect } from 'react';

interface User {
  id_user: number;
  name: string;
  email: string;
  id_role: number;
  status: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isAdmin = user?.id_role === 1;
  const isUser = user?.id_role === 2;
  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  return { 
    user, 
    isAdmin, 
    isUser, 
    isAuthenticated,
    isLoading 
  };
};