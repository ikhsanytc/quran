import React, { memo, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { Appbar, FAB, useTheme } from "react-native-paper";
import { data } from "@/src/data/dataQuran.json";
import { FlashList } from "@shopify/flash-list";
import { isiQuranType } from "../../types/quran";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import RenderDropdownMenu from "../../components/render-dropdown-home";
import RenderListHome from "@/src/components/render-list-home";
import { handleOnScrollYFAB } from "@/src/lib/utils";

const Home = () => {
  const { colors } = useTheme();
  const [quran] = useState(data);
  const FlashListRef = useRef<FlashList<isiQuranType>>(null);
  const translateYFAB = useSharedValue(300);
  const AnimatedFAB = Animated.createAnimatedComponent(FAB);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYFAB.value }],
    };
  });
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.Content
          title="Quran"
          titleStyle={{
            fontFamily: "Poppins_Bold",
            fontSize: 28,
          }}
        />
        <RenderDropdownMenu />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: 10,
        }}
      >
        <RenderListHome
          quran={quran}
          FlashListRef={FlashListRef}
          handleOnScroll={(e) => handleOnScrollYFAB(e, translateYFAB)}
        />
        <AnimatedFAB
          icon="arrow-up"
          style={[
            {
              position: "absolute",
              right: 20,
              bottom: 20,
            },
            animatedStyle,
          ]}
          onPress={() => {
            FlashListRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }}
        />
      </View>
    </>
  );
};

export default Home;
