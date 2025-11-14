import { useQuery } from '@apollo/client/react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MeDocument, User } from '../schemaTypes/graphql';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {refetch} = useQuery(MeDocument, {skip: true});

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchMe()
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const fetchMe = async () => {
    const me = await refetch()

    if (me.data?.me) {
      setUser(me.data?.me)
    }
  }

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
    isLoading,
    fetchMe,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

