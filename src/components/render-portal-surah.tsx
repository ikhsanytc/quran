import { router } from "expo-router";
import { FC, useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Portal,
  Text,
} from "react-native-paper";

type RenderPortalSurahProps = {
  isLoading: boolean;
  isDialogBackShown: boolean;
  setIsDialogBackShown: (value: boolean) => void;
  handleSaveConditionScroll: () => void;
};

const RenderPortalSurah: FC<RenderPortalSurahProps> = ({
  isLoading,
  handleSaveConditionScroll,
  isDialogBackShown,
  setIsDialogBackShown,
}) => {
  return (
    <Portal>
      <Modal visible={isLoading}>
        <View>
          <ActivityIndicator size={50} />
          <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              fontFamily: "Poppins_Bold",
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
        <Dialog.Title
          style={{
            fontFamily: "Poppins_Bold",
          }}
        >
          Ingin simpan?
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={{
              fontFamily: "Poppins_Regular",
            }}
          >
            Kamu ingin simpan kondisi sekarang?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setIsDialogBackShown(false);
              router.back();
            }}
            labelStyle={{
              fontFamily: "Poppins_Regular",
            }}
          >
            No
          </Button>
          <Button
            onPress={handleSaveConditionScroll}
            labelStyle={{
              fontFamily: "Poppins_Regular",
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default RenderPortalSurah;
