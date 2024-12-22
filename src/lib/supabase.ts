import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { makeRedirectUri } from "expo-auth-session";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export async function signIn(email: string, password: string) {
  const { error: AuthError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (AuthError) {
    return {
      error: true,
      message: AuthError.message,
    };
  }
  return {
    error: false,
    message: "Success",
  };
}

export async function signUp(
  email: string,
  username: string,
  password: string
) {
  const redirectUrl = makeRedirectUri();
  const { error: AuthError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        username,
        avatar_url: "",
      },
    },
  });
  if (AuthError) {
    return {
      error: true,
      message: AuthError.message,
    };
  }
  return {
    error: false,
    message: "Success",
  };
}

export async function exhangeForCode(code: string) {
  const { error: AuthError } = await supabase.auth.exchangeCodeForSession(code);
  if (AuthError) {
    return {
      error: true,
      message: AuthError.message,
    };
  }
  return {
    error: false,
    message: "Success",
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}
