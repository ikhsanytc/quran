import React, { useState } from "react";
import { BottomNavigation, useTheme } from "react-native-paper";
import Home from "./pages/home";
import AsmaulHusna from "./pages/asmaul-husna";

export default function Index() {
  const [index, setIndex] = useState(0);
  const { colors } = useTheme();
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "AsmaulHusna",
      title: "Asmaul Husna",
      focusedIcon: "spa",
      unfocusedIcon: "spa-outline",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    AsmaulHusna,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled={true}
      activeIndicatorStyle={{
        backgroundColor: colors.primaryContainer,
      }}
      keyboardHidesNavigationBar={true}
      shifting={true}
    />
  );
}
