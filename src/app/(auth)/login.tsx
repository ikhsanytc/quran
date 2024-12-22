import { signIn, supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProviders";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { AppState, Image, ScrollView, View } from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [messageError, setMessageError] = useState("");

  const submit: SubmitHandler<LoginForm> = async (data) => {
    const login = await signIn(data.email, data.password);
    if (login.error) {
      showSnackbar(login.message);
      return;
    }
    router.replace("/");
  };
  function showSnackbar(message: string) {
    setMessageError(message);
    setVisibleSnackbar(true);
  }
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <IconButton
        size={30}
        icon="keyboard-backspace"
        style={{
          backgroundColor: colors.elevation.level4,
          margin: 10,
        }}
        onPress={() => router.back()}
      />
      <Image
        source={require("@/src/assets/adaptive-icon.png")}
        style={{
          marginHorizontal: "auto",
          marginBottom: 20,
          marginTop: 20,
        }}
      />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.elevation.level5,
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700", textAlign: "center" }}>
          Welcome to Quran
        </Text>
        <View
          style={{
            marginTop: 20,
            gap: 10,
          }}
        >
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
              minLength: {
                value: 6,
                message: "Email must be at least 6 characters",
              },
              maxLength: {
                value: 320,
                message: "Email must not exceed 320 characters",
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <>
                <TextInput
                  mode="outlined"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  label="Email"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                />
                {errors.email && (
                  <HelperText type="error" visible>
                    {errors.email.message}
                  </HelperText>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/,
                message:
                  "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character",
              },
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                mode="outlined"
                label="Password"
                placeholder="somebody123@@"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
          />
          {errors.password && (
            <HelperText type="error" visible>
              {errors.password.message}
            </HelperText>
          )}
          <Button mode="elevated" onPress={handleSubmit(submit)}>
            Login
          </Button>
          <Text
            style={{
              textAlign: "center",
              fontSize: 23,
              fontWeight: "700",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Or
          </Text>
          <Button
            mode="elevated"
            onPress={() => router.push("/(auth)/register")}
          >
            Create new account
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        action={{
          label: "Close",
          labelStyle: { color: colors.onError },
          onPress: () => setVisibleSnackbar(false),
        }}
        style={{ backgroundColor: colors.error }}
      >
        {messageError}
      </Snackbar>
    </SafeAreaView>
  );
}
