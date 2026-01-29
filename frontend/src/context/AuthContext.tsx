"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TUser } from "@/api/types";
import { loginUser as apiLoginUser, logout as userLogout, fetchMe } from "@/api";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: TUser | null;
  isAuthenticated: boolean;
  loginUser: (fullName: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: TUser | null;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [loading, setLoading] = useState(false);

  const loginUser = async (fullName: string, password: string) => {
    setLoading(true);
    try {
      const success = await apiLoginUser({ fullName, password });
      if (success) {
        const me = await fetchMe();
        if (me) {
          setUser(me);
          setIsAuthenticated(true);
        }
      }
      return success;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const res = await userLogout();
      if (res) {
        setUser(null);
        setIsAuthenticated(false);
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, isAuthenticated: false };
  }
  return context;
};
