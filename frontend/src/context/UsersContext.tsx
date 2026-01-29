"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { TUser } from "@/api/types";

type UsersContextType = {
  users: TUser[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({
  children,
  initialUsers = [],
}: {
  children: ReactNode;
  initialUsers?: TUser[];
}) {
  const [users, setUsers] = useState<TUser[]>(initialUsers);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data: TUser[] = await res.json();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UsersContext.Provider value={{ users, loading, refresh }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) {
    return { users: [] };
  }
  return ctx;
}
