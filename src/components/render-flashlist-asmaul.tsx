import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { ActivityIndicator, List, Text, useTheme } from "react-native-paper";
import { AsmaulHusnaType } from "../types/asmaul-husna";
import { SharedValue } from "react-native-reanimated";
import { FC, RefObject } from "react";

type RenderFlashlistAsmaulProps = {
  asmaulHusna: AsmaulHusnaType[];
  FlashListRef: RefObject<FlashList<AsmaulHusnaType>>;
  translateYFAB: SharedValue<number>;
  handleOnScrollYFAB: (e: any, translateYFAB: SharedValue<number>) => void;
};

const RenderFlashlistAsmaul: FC<RenderFlashlistAsmaulProps> = ({
  asmaulHusna,
  FlashListRef,
  translateYFAB,
  handleOnScrollYFAB,
}) => {
  const { colors } = useTheme();
  return (
    <FlashList
      data={asmaulHusna}
      estimatedItemSize={100}
      ListEmptyComponent={() => <ActivityIndicator />}
      keyExtractor={(item) => item.urutan.toString()}
      removeClippedSubviews={true}
      ref={FlashListRef}
      onScroll={(e) => handleOnScrollYFAB(e, translateYFAB)}
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
                  fontFamily: "Poppins_Bold",
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
                  fontFamily: "Poppins_Regular",
                  marginBottom: 5,
                }}
              >
                {item.latin}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: "gray",
                  fontFamily: "Poppins_Regular",
                }}
              >
                {item.arti}
              </Text>
            </View>
          }
        />
      )}
    />
  );
};
export default RenderFlashlistAsmaul;
