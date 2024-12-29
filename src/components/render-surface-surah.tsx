import { FC } from "react";
import { SuratData } from "../types/surat";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";

type RenderSurfaceSurahProps = {
  surat: SuratData;
};

const RenderSurfaceSurah: FC<RenderSurfaceSurahProps> = ({ surat }) => {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: 40,
        marginBottom: 20,
      }}
    >
      <Surface
        elevation={4}
        style={{
          height: 250,
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
            fontFamily: "Poppins_Bold",
            fontSize: 28,
          }}
        >
          {surat.namaLatin}
        </Text>
        <Text
          style={{
            color: "gray",
            fontFamily: "Poppins_Regular",
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
  );
};

export default RenderSurfaceSurah;
