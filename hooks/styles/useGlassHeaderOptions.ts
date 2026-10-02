import { Platform, useColorScheme } from "react-native";

export const isIOS26OrLater = () =>
    Platform.OS === "ios" && Number.parseInt(String(Platform.Version), 10) >= 26;

/**
 * Options de header natif « chrome » pour tous les stacks de l'app (trip + sections).
 * - iOS 26+ : pas de blur explicite → la nav bar prend son Liquid Glass natif
 *   (transparente au repos sur un scroll view, matériau quand le contenu passe dessous).
 * - iOS < 26 : headerBlurEffect 'regular' (même comportement, blur matériau).
 * - Android : pas de blur natif sur les headers → tint plat brume/encre nuit.
 * Le texte suit le scheme (tokens de la palette, plus de useColors).
 */
export const useGlassHeaderOptions = () => {
    const isDark = useColorScheme() === "dark";
    const text = isDark ? "#F6F8FD" : "#16265C";

    const options = {
        headerTintColor: text,
        headerTitleStyle: { color: text },
        headerLargeTitleStyle: { color: text },
        headerLargeTitleShadowVisible: false,
        headerBlurEffect: isIOS26OrLater() ? undefined : 'regular' as const,
    };

    if (Platform.OS === "android") {
        return {
            ...options,
            headerStyle: { backgroundColor: isDark ? "#101736" : "#F6F8FD" },
        };
    }

    return options;
};
