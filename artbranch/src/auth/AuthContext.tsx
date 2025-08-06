import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/services/supabase";

interface AuthContextType {
  user: any;
  name: string | null;
  role: string | null;
  username: string | null;
  email: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("role, full_name, username, email")
          .eq("id", session?.user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          setRole(null);
          setName(null);
          setUsername(null);
          setEmail(null);
        } else {
          setRole(profileData?.role || null);
          setName(profileData?.full_name || null);
          setUsername(profileData?.username || null);
          setEmail(profileData?.email || null);
        }
      }

      setIsLoading(false);
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserData();
        } else {
          setRole(null);
          setName(null);
          setUsername(null);
          setEmail(null);
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setUsername(null);
    setEmail(null);
    // window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ user, role, name, username, email, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
