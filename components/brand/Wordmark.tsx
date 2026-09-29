import { Text, useColorScheme } from "react-native";

/**
 * Wordmark All In : « all » bleu nuit (blanc en dark), « in » ambre.
 * Outfit ExtraBold (poids 800 du référentiel de marque, cf. assets/brand/proposals/v5-splash-wordmark.svg).
 * Requiert que la police "Outfit-ExtraBold" soit chargée via useFonts dans app/_layout.tsx.
 * Couleurs en style brut (pas de className sur le texte imbriqué) : rendu fiable
 * dans le header natif, où le styling NativeWind du <Text> imbriqué ne s'applique pas.
 */
export const Wordmark = ({ size = 24 }: { size?: number }) => {
    const isDark = useColorScheme() === "dark";

    return (
        <Text
            style={{
                fontFamily: "Outfit-ExtraBold",
                fontSize: size,
                letterSpacing: 0.5,
                color: isDark ? "#FFFFFF" : "#16265C",
            }}>
            all{" "}
            <Text style={{ color: isDark ? "#F7B74A" : "#EE8B33" }}>in</Text>
        </Text>
    );
};
