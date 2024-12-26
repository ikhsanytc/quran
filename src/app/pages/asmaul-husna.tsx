import { View, Text } from "react-native";
import React, { useState } from "react";
import { Appbar, useTheme } from "react-native-paper";
import dataAsmaul from "../../data/dataAsmaulHusna.json";

export default function AsmaulHusna() {
  const { colors } = useTheme();
  const [asmaulHusna, setAsmaulHusna] = useState(dataAsmaul);
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.Content
          title="Asmaul Husna"
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
        }}
      ></View>
    </>
  );
}
