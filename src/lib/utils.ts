import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { SharedValue, withSpring } from "react-native-reanimated";

export function removeHtmlTags(htmlString: string) {
  return htmlString.replace(/<[^>]*>/g, "");
}

export const handleOnScrollYFAB = (
  e: NativeSyntheticEvent<NativeScrollEvent>,
  translateYFAB: SharedValue<number>
) => {
  const damping = 10;
  const stiffness = 80;
  const mass = 1;
  if (e.nativeEvent.contentOffset.y > 0) {
    translateYFAB.value = withSpring(0, {
      damping,
      stiffness,
      mass,
    });
  } else {
    translateYFAB.value = withSpring(300, {
      damping,
      stiffness,
      mass,
    });
  }
};
