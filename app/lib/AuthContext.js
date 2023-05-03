"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getUser, getSession } from "./auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (session) {
        const currentUser = await getUser();
        setUser(currentUser);
      }
    };
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
