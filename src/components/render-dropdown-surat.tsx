import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useEffect, useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import Toast from "react-native-toast-message";

type Props = {
  id: number;
};

const RenderDropdownMenuSurat: FC<Props> = ({ id }) => {
  const [menuShown, setMenuShown] = useState(false);
  const [isConditionState, setIsConditionState] = useState(0);
  async function checkConditionState() {
    try {
      const data = await AsyncStorage.getItem(`scroll-${id}`);
      if (!data) return 0;
      return Number(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Gagal mengecek kondisi",
        text2: "Silahkan coba lagi",
      });
      return 0;
    }
  }
  async function handleDeleteConditionState() {
    try {
      await AsyncStorage.removeItem(`scroll-${id}`);
      setIsConditionState(0);
      setMenuShown(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Kondisi berhasil dihapus",
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Gagal menghapus kondisi",
        text2: "Silahkan coba lagi",
      });
    }
  }
  useEffect(() => {
    checkConditionState().then((data) => setIsConditionState(data));
  }, []);
  return (
    <>
      {isConditionState !== 0 && (
        <Menu
          visible={menuShown}
          contentStyle={{
            marginTop: 50,
            marginRight: 10,
          }}
          onDismiss={() => setMenuShown(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setMenuShown(true)}
            />
          }
        >
          <Menu.Item
            titleStyle={{
              fontFamily: "Poppins_Regular",
            }}
            title="Menghapus kondisi sebelumnya"
            onPress={handleDeleteConditionState}
          />
        </Menu>
      )}
    </>
  );
};
export default RenderDropdownMenuSurat;
