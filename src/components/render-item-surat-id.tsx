import { Icon, List, Text, useTheme } from "react-native-paper";
import { Ayat } from "../types/surat";
import React, { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { Audio } from "expo-av";
import { soundSurat } from "../app/surat/[id]";

type RenderItemSuratProps = {
  item: Ayat;
  onSoundFinished?: () => void;
  onSoundPlaying?: () => void;
  onPress?: () => void;
};

const RenderItemSurat: FC<RenderItemSuratProps> = ({
  item,
  onSoundFinished = () => {},
  onSoundPlaying = () => {},
  onPress = () => {},
}) => {
  const { colors } = useTheme();
  const [soundState, setSoundState] = useState<Audio.Sound | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  async function playSound() {
    if (soundState) {
      await soundState.playAsync();
      setIsPaused(false);
    } else {
      const { sound } = await soundSurat.createAsync(
        {
          uri: item.audio["02"],
        },
        {},
        (status) => {
          if (status.isLoaded && status.didJustFinish) {
            setSoundState(null);
            onSoundFinished();
            sound.unloadAsync();
          }
          if (status.isLoaded && status.isPlaying) {
            onSoundPlaying();
          }
        }
      );

      setSoundState(sound);
      await sound.playAsync();
      setIsPaused(false);
    }
  }
  async function pauseSound() {
    if (soundState) {
      await soundState.pauseAsync();
      setIsPaused(true);
    }
  }
  useEffect(() => {
    return () => {
      if (soundState) {
        (async () => {
          await soundState.stopAsync();
          await soundState.unloadAsync();
        })();
        setSoundState(null);
        setIsPaused(false);
      }
    };
  }, [soundState]);

  return (
    <>
      <List.Item
        descriptionStyle={{
          marginBottom: 40,
        }}
        onPress={() => {
          onPress();
          if (soundState && !isPaused) {
            pauseSound();
          } else {
            playSound();
          }
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
            {soundState ? (
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: "auto",
                  fontFamily: "Poppins_Bold",
                  fontSize: 18,
                  color: "white",
                }}
              >
                {isPaused ? (
                  <Icon source="play" size={24} />
                ) : (
                  <Icon source="pause" size={24} />
                )}
              </Text>
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: "auto",
                  fontFamily: "Poppins_Bold",
                  fontSize: 18,
                }}
              >
                {item.nomorAyat}
              </Text>
            )}
          </View>
        )}
        description={
          <View>
            <Text
              style={{
                fontSize: 20,

                marginBottom: 5,
                fontFamily: "Poppins_Regular",
              }}
            >
              {item.teksLatin}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: "gray",
                fontFamily: "Poppins_Regular",
              }}
            >
              {item.teksIndonesia}
            </Text>
          </View>
        }
      />
    </>
  );
};
export default RenderItemSurat;
