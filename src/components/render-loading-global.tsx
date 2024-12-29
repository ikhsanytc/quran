import React, { FC } from "react";
import { View } from "react-native";
import { ActivityIndicator, Appbar, useTheme } from "react-native-paper";

type RenderLoadingType = {
  title?: string;
};

export const RenderLoading: FC<RenderLoadingType> = ({ title = "Quran" }) => {
  const { colors } = useTheme();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.Content
          title={title}
          titleStyle={{
            fontWeight: "700",
            fontSize: 28,
          }}
        />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator animating size={60} />
      </View>
    </>
  );
};
