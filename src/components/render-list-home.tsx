import { FlashList } from "@shopify/flash-list";
import { isiQuranType } from "../types/quran";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React, { FC } from "react";
import { Divider, List, Searchbar, Text, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { removeHtmlTags } from "../lib/utils";
import { View } from "react-native";

type RenderListHomeProps = {
  quran: isiQuranType[];
  FlashListRef: React.RefObject<FlashList<isiQuranType>>;
  handleOnScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const RenderListHome: FC<RenderListHomeProps> = ({
  quran,
  FlashListRef,
  handleOnScroll,
}) => {
  const { colors } = useTheme();
  return (
    <FlashList
      data={quran}
      ref={FlashListRef}
      keyExtractor={(item) => item.nomor.toString()}
      estimatedItemSize={78}
      onScroll={handleOnScroll}
      renderItem={({ item }) => {
        if (item.nomor === 1) {
          return (
            <>
              {/* searchbar */}
              <Searchbar
                onPress={() => router.push("/search")}
                value=""
                style={{
                  marginBottom: 5,
                }}
                placeholder="Search surat..."
              />
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
            </>
          );
        }
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
  );
};
export default RenderListHome;
