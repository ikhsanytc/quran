import { Alert, View } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";
import { useAuth } from "../providers/AuthProviders";
import * as QueryParams from "expo-auth-session/build/QueryParams";

export async function createSessionFromUrl(url: string) {
  try {
    const { errorCode, params } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
    if (!refresh_token) return;
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
}

export default function Verify() {
  const { colors } = useTheme();
  const { user } = useAuth();
  if (user) {
    router.replace("/");
  }
  const url = Linking.useURL();
  useEffect(() => {
    if (url)
      createSessionFromUrl(url).then((data) => {
        if (data) {
          router.replace("/");
        }
      });
  }, [url]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Surface
        elevation={4}
        style={{ borderRadius: 16, width: "80%", height: "auto" }}
      >
        <View
          style={{
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "auto",
          }}
        >
          <ActivityIndicator size={50} />
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            Verifying...
          </Text>
        </View>
      </Surface>
    </SafeAreaView>
  );
}
