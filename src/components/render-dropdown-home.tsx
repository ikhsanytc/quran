import React from "react";
import { useState } from "react";
import {
  Appbar,
  Button,
  Dialog,
  Menu,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

export default function RenderDropdownMenu() {
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
