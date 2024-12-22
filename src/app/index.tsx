import React, { memo, useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  FAB,
  List,
  Menu,
  Portal,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { data } from "../data/dataQuran.json";
import { removeHtmlTags } from "../lib/utils";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAuth } from "../providers/AuthProviders";
import { signOut } from "../lib/supabase";
import * as Linking from "expo-linking";
import { createSessionFromUrl } from "./verify";
import { isiQuranType } from "../types/quran";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Index = memo(() => {
  const { colors } = useTheme();
  const [quran, setQuran] = useState(data);
  const [keywordSearch, setKeywordSearch] = useState("");
  const { profile } = useAuth();
  const [successVerify, setSuccessVerify] = useState(false);
  const url = Linking.useURL();
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
  useEffect(() => {
    if (url)
      createSessionFromUrl(url).then((data) => {
        if (data) {
          setSuccessVerify(true);
        }
      });
  }, [url]);
  async function handleOnScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (e.nativeEvent.contentOffset.y > 0) {
      translateYFAB.value = withTiming(0, {
        duration: 500,
      });
    } else {
      translateYFAB.value = withTiming(300, {
        duration: 500,
      });
    }
  }
  return (
    <>
      <Portal>
        <Dialog
          visible={successVerify}
          onDismiss={() => setSuccessVerify(false)}
        >
          <Dialog.Title>Success</Dialog.Title>
          <Dialog.Content>
            <Text>
              Success verify your account, welcome {profile?.username ?? "user"}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSuccessVerify(false)}>Oke</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

function RenderDropdownMenu() {
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { user } = useAuth();
  const { colors } = useTheme();
  const [showDialogLogout, setShowDialogLogout] = useState(false);
  return (
    <>
      <Menu
        contentStyle={{
          marginTop: 50,
          marginRight: 10,
        }}
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
      >
        <Menu.Item
          title="About me"
          onPress={() => {
            setVisibleDialog(true);
            setVisible(false);
          }}
        />
        {user ? (
          <Menu.Item
            title="Logout"
            onPress={() => {
              setVisible(false);
              setShowDialogLogout(true);
            }}
          />
        ) : (
          <Menu.Item
            title="Login"
            onPress={() => {
              setVisible(false);
              router.push("/(auth)/login");
            }}
          />
        )}
      </Menu>
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(false)}
        >
          <Dialog.Title>About me</Dialog.Title>
          <Dialog.Content>
            <Text>
              "Saya adalah seorang programmer yg hobi buat aplikasi dan web"
              -ikhsan
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(false)}>Oke</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={showDialogLogout}
          onDismiss={() => setShowDialogLogout(false)}
        >
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialogLogout(false)}>Cancel</Button>
            <Button
              onPress={() => {
                signOut();
                setShowDialogLogout(false);
              }}
              labelStyle={{
                color: colors.error,
              }}
            >
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

export default Index;
