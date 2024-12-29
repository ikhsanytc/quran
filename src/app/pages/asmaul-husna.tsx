import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import React, { memo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  Appbar,
  List,
  useTheme,
  FAB,
} from "react-native-paper";
import dataAsmaul from "../../data/dataAsmaulHusna.json";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import { RenderLoading } from "../../components/render-loading-global";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AsmaulHusnaType } from "@/src/types/asmaul-husna";
import { handleOnScrollYFAB } from "@/src/lib/utils";
import RenderFlashlistAsmaul from "@/src/components/render-flashlist-asmaul";

const AsmaulHusna = memo(() => {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    Amiri_Regular: Amiri_400Regular,
    Amiri_Bold: Amiri_700Bold,
  });
  const FlashListRef = useRef<FlashList<AsmaulHusnaType>>(null);
  const [asmaulHusna, setAsmaulHusna] = useState(dataAsmaul);
  const AnimatedFAB = Animated.createAnimatedComponent(FAB);
  const translateYFAB = useSharedValue(300);
  const fabStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYFAB.value }],
    };
  });

  if (!fontsLoaded) {
    return <RenderLoading title="Asmaul Husna" />;
  }
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
            fontFamily: "Poppins_Bold",
            fontSize: 28,
          }}
        />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: 10,
        }}
      >
        <RenderFlashlistAsmaul
          asmaulHusna={asmaulHusna}
          FlashListRef={FlashListRef}
          translateYFAB={translateYFAB}
          handleOnScrollYFAB={handleOnScrollYFAB}
        />
        <AnimatedFAB
          icon="arrow-up"
          style={[
            {
              position: "absolute",
              right: 20,
              bottom: 20,
            },
            fabStyle,
          ]}
          onPress={() => {
            if (FlashListRef.current) {
              FlashListRef.current.scrollToIndex({
                index: 0,
                animated: true,
              });
            }
          }}
        />
      </View>
    </>
  );
});
export default AsmaulHusna;
