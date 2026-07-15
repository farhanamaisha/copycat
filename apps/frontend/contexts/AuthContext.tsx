"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentUser } from "@/services/api/user.api";
import type { User } from "@/types";


interface AuthContextType {
  user: User | null;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});


export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadUser() {

      const token =
        localStorage.getItem("accessToken");


      if (!token) {
        setLoading(false);
        return;
      }


      try {

        const data =
          await getCurrentUser();


        setUser(data);


      } catch (error) {

        console.error(error);

        localStorage.removeItem("accessToken");

      }
      finally {

        setLoading(false);

      }

    }


    loadUser();

  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}


export function useAuth() {

  return useContext(AuthContext);

}