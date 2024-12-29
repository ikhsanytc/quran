import { FlashList } from "@shopify/flash-list";
import { isiQuranType } from "../types/quran";
import { NativeSyntheticEvent, View } from "react-native";
import { NativeScrollEvent } from "react-native";
import { FC } from "react";
import { Divider, List, Text, useTheme } from "react-native-paper";
import { removeHtmlTags } from "../lib/utils";
import { router } from "expo-router";

type RenderListSearchProps = {
  quran: isiQuranType[];
  FlashListRef: React.RefObject<FlashList<isiQuranType>>;
  handleOnScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const RenderListSearch: FC<RenderListSearchProps> = ({
  FlashListRef,
  handleOnScroll,
  quran,
}) => {
  const { colors } = useTheme();
  return (
    <FlashList
      data={quran}
      ref={FlashListRef}
      estimatedItemSize={200}
      keyExtractor={(item) => item.nomor.toString()}
      onScroll={handleOnScroll}
      removeClippedSubviews={true}
      automaticallyAdjustKeyboardInsets
      renderItem={({ item }) => {
        return (
          <List.Item
            title={item.namaLatin}
            description={removeHtmlTags(item.deskripsi)}
            onPress={() => router.replace(`/surat/${item.nomor}`)}
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

export default RenderListSearch;
