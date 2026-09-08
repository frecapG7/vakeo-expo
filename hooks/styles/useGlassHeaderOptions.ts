import useColors from "@/hooks/styles/useColors";
import { Platform } from "react-native";

export const isIOS26OrLater = () =>
    Platform.OS === "ios" && typeof Platform.Version === "number" && Platform.Version >= 26;

export const useGlassHeaderOptions = () => {
    const { text } = useColors();
    return {
        headerTintColor: text,
        headerTitleStyle: { color: text },
        headerLargeTitleStyle: { color: text },
        headerLargeTitleShadowVisible: false,
        headerBlurEffect: isIOS26OrLater() ? undefined : 'regular' as const,
    };
};
