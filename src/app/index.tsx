import React, { memo, useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import {
  Appbar,
  Divider,
  FAB,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { data } from "../data/dataQuran.json";
import { removeHtmlTags } from "../lib/utils";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { isiQuranType } from "../types/quran";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import RenderDropdownMenu from "../components/render-dropdown-home";

const Index = memo(() => {
  const { colors } = useTheme();
  const [quran, setQuran] = useState(data);
  const [keywordSearch, setKeywordSearch] = useState("");
  const FlashListRef = useRef<FlashList<isiQuranType>>(null);
  const translateYFAB = useSharedValue(300);
  const AnimatedFAB = Animated.createAnimatedComponent(FAB);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYFAB.value }],
    };
  });

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.namaLatin.toLowerCase().includes(keywordSearch.toLowerCase())
    );
    setQuran(filteredData);
  }, [keywordSearch]);

  async function handleOnScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const damping = 10;
    const stiffness = 80;
    const mass = 1;
    if (e.nativeEvent.contentOffset.y > 0) {
      // translateYFAB.value = withTiming(0, {
      //   duration: 500,
      // });
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
  }
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
            fontWeight: "700",
            fontSize: 28,
          }}
        />
        <RenderDropdownMenu />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            padding: 10,
          }}
        >
          {/* searchbar */}
          <Searchbar
            value={keywordSearch}
            onChangeText={(text) => setKeywordSearch(text)}
            placeholder="Search surat..."
          />
        </View>
        <FlashList
          data={quran}
          ref={FlashListRef}
          removeClippedSubviews={true}
          keyExtractor={(item) => item.nomor.toString()}
          estimatedItemSize={78}
          onScroll={handleOnScroll}
          renderItem={({ item }) => {
            return (
              <List.Item
                title={item.namaLatin}
                description={removeHtmlTags(item.deskripsi)}
                onPress={() => router.push(`/surat/${item.nomor}`)}
                left={() => (
                  <View
                    style={{
                      marginVertical: "auto",
                      marginLeft: 10,
                      width: 40,
                      height: 40,
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
                      {item.nomor}
                    </Text>
                  </View>
                )}
                right={() => (
                  <Text
                    style={{
                      color: colors.primary,
                    }}
                  >
                    {item.nama}
                  </Text>
                )}
              />
            );
          }}
          ItemSeparatorComponent={() => <Divider />}
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
});

export default Index;
