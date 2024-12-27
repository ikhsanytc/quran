import { BackHandler, ScrollView, View } from "react-native";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  Divider,
  List,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SuratData } from "@/src/types/surat";
import { useFonts } from "expo-font";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderDropdownMenuSurat from "@/src/components/render-dropdown-surat";

const SuratDetail = memo(() => {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [surat, setSurat] = useState<SuratData>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogBackShown, setIsDialogBackShown] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [fontsLoaded] = useFonts({
    Amiri_Regular: Amiri_400Regular,
    Amiri_Bold: Amiri_700Bold,
  });
  async function handleGetConditionScroll() {
    try {
      const data = await AsyncStorage.getItem(`scroll-${id}`);
      if (!data) return 0;
      return Number(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unexpected error occured",
      });
      return 0;
    }
  }

  async function init() {
    const res = await fetch(`https://equran.id/api/v2/surat/${id}`);
    const { data }: { data: SuratData } = await res.json();
    setSurat(data);
  }
  useEffect(() => {
    init();
    const backAction = () => {
      setIsDialogBackShown(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    if (!isLoading) {
      handleGetConditionScroll().then((res) => {
        if (res && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: res, animated: true });
          Toast.show({
            type: "info",
            text1: "Info",
            text2: "Scroll position restored",
          });
        }
      });
    }
  }, [isLoading]);

  async function handleSaveConditionScroll() {
    try {
      await AsyncStorage.setItem(`scroll-${id}`, scrollY.toString());
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Successfully saved",
      });
      setIsDialogBackShown(false);
      router.back();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unexpected error occured",
      });
    }
    setIsDialogBackShown(false);
  }

  if (!surat) {
    return <RenderLoading />;
  }
  if (!fontsLoaded) {
    return <RenderLoading />;
  }
  return (
    <>
      <Portal>
        <Modal visible={isLoading}>
          <View>
            <ActivityIndicator size={50} />
            <Text
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Please wait...
            </Text>
          </View>
        </Modal>
        <Dialog
          visible={isDialogBackShown}
          onDismiss={() => setIsDialogBackShown(false)}
        >
          <Dialog.Title>Ingin simpan?</Dialog.Title>
          <Dialog.Content>
            <Text>Kamu ingin simpan kondisi sekarang?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setIsDialogBackShown(false);
                router.back();
              }}
            >
              No
            </Button>
            <Button onPress={handleSaveConditionScroll}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.BackAction onPress={() => setIsDialogBackShown(true)} />
        <Appbar.Content
          title={`Surat ${surat.namaLatin}`}
          titleStyle={{
            fontWeight: "700",
            fontSize: 28,
          }}
        />
        <RenderDropdownMenuSurat id={Number(id)} />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        onScroll={(e) => {
          setScrollY(Math.floor(e.nativeEvent.contentOffset.y));
        }}
        ref={scrollViewRef}
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
                color: "gray",
              }}
            >
              {surat.jumlahAyat} Ayat
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: 26,
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
          <FlashList
            data={surat.ayat}
            estimatedItemSize={100}
            ListEmptyComponent={() => <Text>Wait..</Text>}
            keyExtractor={(item) => item.nomorAyat.toString()}
            removeClippedSubviews={true}
            onLoad={() => setIsLoading(false)}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            scrollEnabled={false}
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
                      {item.nomorAyat}
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
});

type RenderLoadingType = {
  title?: string;
};

export const RenderLoading: FC<RenderLoadingType> = ({ title = "Quran" }) => {
  const { colors } = useTheme();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.Content
          title={title}
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
};
export default SuratDetail;
