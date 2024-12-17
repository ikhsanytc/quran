import { Stack } from "expo-router";
import merge from "deepmerge";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  ThemeProvider,
} from "react-native-paper";
import { Colors } from "../constants/Color";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { StatusBar } from "expo-status-bar";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationDefaultTheme,
});

const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);
const CombinedLightTheme = merge(LightTheme, customLightTheme);

export default function RootLayout() {
  const { colorScheme } = useTheme();
  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;
  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider theme={paperTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </PaperProvider>
  );
}
