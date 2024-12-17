import React, { useState } from "react";
import { FlatList, View } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  List,
  Menu,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { data } from "../data/dataQuran.json";
import { removeHtmlTags } from "../lib/utils";
import { router } from "expo-router";

export default function Index() {
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
        <RenderDropdownMenu />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
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
                    {++index}
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
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
        <Divider />
      </View>
    </>
  );
}

function RenderDropdownMenu() {
  const [visible, setVisible] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
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
      </Portal>
    </>
  );
}
