import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Profile } from "../types/database";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        return;
      }
      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select()
          .eq("id", session?.user.id)
          .maybeSingle();
        if (profileError) {
          console.error(profileError);
          return;
        }
        setProfile(profileData ?? null);
      }
      setSession(session ?? null);
      setUser(session?.user ?? null);
    };
    fetchData();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user: user, session: session, profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
