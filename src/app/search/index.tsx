import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  Appbar,
  Divider,
  List,
  Searchbar,
  useTheme,
  Text,
  FAB,
} from "react-native-paper";
import { router } from "expo-router";
import { handleOnScrollYFAB, removeHtmlTags } from "@/src/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { data } from "@/src/data/dataQuran.json";
import { isiQuranType } from "@/src/types/quran";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import RenderListSearch from "@/src/components/render-list-search";

export default function Search() {
  const { colors } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [quran, setQuran] = useState(data);
  const translateYFAB = useSharedValue(300);
  const AnimatedFAB = Animated.createAnimatedComponent(FAB);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYFAB.value }],
    };
  });
  const FlashListRef = useRef<FlashList<isiQuranType>>(null);

  useEffect(() => {
    const filteredData = data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
        item.namaLatin.toLowerCase().includes(keyword.toLowerCase())
      );
    });
    setQuran(filteredData);
  }, [keyword]);
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          style={{
            marginRight: 10,
          }}
          title={
            <Searchbar
              placeholder="Search surat..."
              autoFocus
              style={{
                backgroundColor: colors.elevation.level1,
              }}
              value={keyword}
              onChangeText={(text) => setKeyword(text)}
            />
          }
        />
      </Appbar.Header>
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
        }}
      >
        <RenderListSearch
          FlashListRef={FlashListRef}
          handleOnScroll={(e) => handleOnScrollYFAB(e, translateYFAB)}
          quran={quran}
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
            FlashListRef.current?.scrollToIndex({
              index: 0,
              animated: true,
            });
          }}
        />
      </View>
    </>
  );
}
