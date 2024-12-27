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
import { RenderLoading } from "../surat/[id]";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AsmaulHusnaType } from "@/src/types/asmaul-husna";

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
  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const damping = 10;
    const stiffness = 80;
    const mass = 1;
    if (e.nativeEvent.contentOffset.y > 0) {
      translateYFAB.value = withSpring(0, {
        damping,
        stiffness,
        mass,
      });
    } else {
      translateYFAB.value = withSpring(300, {
        damping,
        stiffness,
        mass,
      });
    }
  };
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
            fontWeight: "700",
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
        <FlashList
          data={asmaulHusna}
          estimatedItemSize={100}
          ListEmptyComponent={() => <ActivityIndicator />}
          keyExtractor={(item) => item.urutan.toString()}
          removeClippedSubviews={true}
          ref={FlashListRef}
          onScroll={handleOnScroll}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                marginBottom: 30,
              }}
            ></View>
          )}
          renderItem={({ item }) => (
            <List.Item
              descriptionStyle={{
                marginBottom: 40,
              }}
              title={
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 28,
                    fontFamily: "Amiri_Regular",
                    fontWeight: "600",
                    lineHeight: 75,
                  }}
                >
                  {item.arab}
                </Text>
              }
              titleStyle={{
                marginBottom: 10,
              }}
              titleNumberOfLines={0}
              left={() => (
                <View
                  style={{
                    marginLeft: 10,
                    width: 30,
                    height: 30,
                    backgroundColor: colors.primary,
                    borderRadius: 100,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      marginVertical: "auto",
                      fontWeight: "800",
                      fontSize: 18,
                    }}
                  >
                    {item.urutan}
                  </Text>
                </View>
              )}
              description={
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      marginBottom: 5,
                    }}
                  >
                    {item.latin}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      color: "gray",
                      fontWeight: "600",
                    }}
                  >
                    {item.arti}
                  </Text>
                </View>
              }
            />
          )}
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
