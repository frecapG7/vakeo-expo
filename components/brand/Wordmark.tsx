import { Text, useColorScheme } from "react-native";

/**
 * Wordmark All In : « all » bleu nuit (blanc en dark), « in » ambre.
 * Outfit ExtraBold (poids 800 du référentiel de marque, cf. assets/brand/proposals/v5-splash-wordmark.svg).
 * Requiert que la police "Outfit-ExtraBold" soit chargée via useFonts dans app/_layout.tsx.
 * Couleurs en style brut (pas de className sur le texte imbriqué) : rendu fiable
 * dans le header natif, où le styling NativeWind du <Text> imbriqué ne s'applique pas.
 */
export const Wordmark = ({ size = 24, onMedia = false }: { size?: number, onMedia?: boolean }) => {
    const isDark = useColorScheme() === "dark";
    // Sur un média (photo héro) : variante claire quel que soit le scheme + ombre portée.
    const light = onMedia || isDark;

    return (
        <Text
            style={{
                fontFamily: "Outfit-ExtraBold",
                fontSize: size,
                letterSpacing: 0.5,
                color: light ? "#FFFFFF" : "#16265C",
                ...(onMedia && { textShadowColor: "rgba(0,0,0,0.55)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }),
            }}>
            all{" "}
            <Text style={{ color: light ? "#F7B74A" : "#EE8B33" }}>in</Text>
        </Text>
    );
};
