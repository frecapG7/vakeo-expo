import { WordmarkHomeButton } from "@/components/brand/WordmarkHomeButton";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GlassHeaderBarProps = {
    /** Offset de scroll (shared value) — pilote l'apparition du verre et du titre. */
    scrollY: SharedValue<number>;
    /** Titre (nom du trip) — visible seulement une fois le verre apparu. */
    title?: string;
    /** Contrôles à droite (avatar, menu d'actions). */
    right?: ReactNode;
};

const BAR_HEIGHT = 44;

/**
 * Header flottant du dashboard (tabs) : wordmark à gauche (retour home),
 * titre du trip + contrôles à droite.
 * Au repos : transparent, posé sur la photo héro (wordmark variante média).
 * Au scroll : une surface de verre glisse depuis le haut (translation — jamais
 * d'opacité < 1 sur le verre, cf. GlassSurface), le titre apparaît et le
 * wordmark passe à la variante du scheme.
 */
export const GlassHeaderBar = ({ scrollY, title, right }: GlassHeaderBarProps) => {
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === "dark";
    const barHeight = insets.top + BAR_HEIGHT;
    const text = isDark ? "#F6F8FD" : "#16265C";

    // Le verre ne s'anime qu'en translation (règle GlassSurface : jamais d'opacité < 1).
    const surfaceStyle = useAnimatedStyle(() => {
        const p = interpolate(scrollY.value, [0, 120], [-100, 0], Extrapolation.CLAMP);
        return { transform: [{ translateY: `${p}%` }] };
    });

    // Crossfade du wordmark : variante média (blanc + ombre) sur la photo,
    // variante du scheme une fois le verre en place.
    const mediaWordmarkStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [40, 120], [1, 0], Extrapolation.CLAMP),
    }));
    const glassWordmarkStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [40, 120], [0, 1], Extrapolation.CLAMP),
    }));

    const titleStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [80, 160], [0, 1], Extrapolation.CLAMP),
    }));

    return (
        <View pointerEvents="box-none" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
            <Animated.View
                pointerEvents="none"
                style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }, surfaceStyle]}>
                <GlassSurface
                    intensity={70}
                    tintColor={isDark ? "#101736" : "#F6F8FD"}
                    style={{ flex: 1 }} />
            </Animated.View>
            {/* Le verre couvre insets.top + BAR_HEIGHT (comme un header natif),
                mais les contrôles vivent sous la barre de statut : paddingTop = insets.top. */}
            <View style={{ height: barHeight, paddingTop: insets.top, paddingHorizontal: 12 }} className="flex-row items-center justify-between">
                <View style={{ position: "relative" }}>
                    <Animated.View style={mediaWordmarkStyle}>
                        <WordmarkHomeButton size={18} onMedia />
                    </Animated.View>
                    <Animated.View style={[{ position: "absolute", top: 0, left: 0 }, glassWordmarkStyle]} pointerEvents="none">
                        <WordmarkHomeButton size={18} />
                    </Animated.View>
                </View>
                <Animated.Text
                    numberOfLines={1}
                    style={[
                        { color: text, flex: 1, textAlign: "center", marginLeft: 16, marginRight: 8, fontSize: 16, fontWeight: "600" },
                        titleStyle,
                    ]}>
                    {title ?? ""}
                </Animated.Text>
                <View className="flex-row items-center gap-3">
                    {right}
                </View>
            </View>
        </View>
    );
};
