import { FlatList, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Appbar,
  Divider,
  List,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SuratData } from "@/src/types/surat";
import { useFonts } from "expo-font";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import * as Clipboard from "expo-clipboard";

export default function SuratDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [surat, setSurat] = useState<SuratData>();
  const [fontsLoaded] = useFonts({
    Amiri_Regular: Amiri_400Regular,
    Amiri_Bold: Amiri_700Bold,
  });
  async function init() {
    const res = await fetch(`https://equran.id/api/v2/surat/${id}`);
    const { data }: { data: SuratData } = await res.json();
    setSurat(data);
  }
  useEffect(() => {
    init();
  }, []);
  if (!surat) {
    return <RenderLoading />;
  }
  if (!fontsLoaded) {
    return <RenderLoading />;
  }
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={`Surat ${surat.namaLatin}`}
          titleStyle={{
            fontWeight: "700",
            fontSize: 28,
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: 40,
          }}
        >
          <Surface
            elevation={4}
            style={{
              height: 200,
              padding: 10,
              width: "100%",
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "800",
                fontSize: 28,
              }}
            >
              {surat.namaLatin}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: 26,
                color: colors.primary,
                fontFamily: "Amiri_Regular",
              }}
            >
              {surat.nama}
            </Text>
            <View
              style={{
                height: 3,
                width: 50,
                backgroundColor: "white",
                marginTop: 8,
                marginBottom: 8,
              }}
            ></View>
            <Text
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: 26,
                color: colors.tertiary,
                fontFamily: "Amiri_Regular",
              }}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </Text>
          </Surface>
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <FlatList
            data={surat.ayat}
            style={{
              marginBottom: 10,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginBottom: 30,
                }}
              ></View>
            )}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
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
                    {item.teksArab}
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
                      {++index}
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
                      {item.teksLatin}
                    </Text>
                    <Text
                      style={{
                        fontSize: 17,
                        color: "gray",
                        fontWeight: "600",
                      }}
                    >
                      {item.teksIndonesia}
                    </Text>
                  </View>
                }
              />
            )}
          />
        </View>
      </ScrollView>
    </>
  );
}

function RenderLoading() {
  const { colors } = useTheme();
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
}
