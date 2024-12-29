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
import { Ayat, SuratData } from "@/src/types/surat";
import { useFonts } from "expo-font";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import { FlashList } from "@shopify/flash-list";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderDropdownMenuSurat from "@/src/components/render-dropdown-surat";
import RenderItemSurat from "@/src/components/render-item-surat-id";
import { Audio } from "expo-av";
import { RenderLoading } from "@/src/components/render-loading-global";
import RenderSurfaceSurah from "@/src/components/render-surface-surah";
import RenderPortalSurah from "@/src/components/render-portal-surah";

export const soundSurat = Audio.Sound;

const SuratDetail = () => {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const FlashListRef = useRef<FlashList<Ayat>>(null);
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
        if (res && FlashListRef.current) {
          FlashListRef.current.scrollToOffset({
            offset: res,
            animated: true,
          });
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
      <RenderPortalSurah
        isLoading={isLoading}
        handleSaveConditionScroll={handleSaveConditionScroll}
        isDialogBackShown={isDialogBackShown}
        setIsDialogBackShown={setIsDialogBackShown}
      />
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.BackAction onPress={() => setIsDialogBackShown(true)} />
        <Appbar.Content
          title={`Surat ${surat.namaLatin}`}
          titleStyle={{
            fontFamily: "Poppins_Bold",
            fontSize: 28,
          }}
        />
        <RenderDropdownMenuSurat id={Number(id)} />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            marginTop: 10,
            flex: 1,
          }}
        >
          <FlashList
            data={surat.ayat}
            ListEmptyComponent={() => <Text>Wait..</Text>}
            keyExtractor={(item) => item.nomorAyat.toString()}
            // removeClippedSubviews={true}
            estimatedItemSize={150}
            ref={FlashListRef}
            onLoad={() => setIsLoading(false)}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            onScroll={(e) =>
              setScrollY(Math.floor(e.nativeEvent.contentOffset.y))
            }
            scrollEnabled={true}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginBottom: 30,
                }}
              ></View>
            )}
            renderItem={({ item }) => {
              if (item.nomorAyat === 1) {
                return (
                  <>
                    <RenderSurfaceSurah surat={surat} />
                    <RenderItemSurat item={item} />
                  </>
                );
              }
              return <RenderItemSurat item={item} />;
            }}
          />
        </View>
      </View>
    </>
  );
};

export default SuratDetail;
