import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Platform, StyleSheet, useColorScheme, View, type ViewProps, type ViewStyle } from "react-native";

const supportsLiquidGlass = Platform.OS === "ios" && isLiquidGlassAvailable();
const supportsBlur =
    Platform.OS === "ios" ||
    (Platform.OS === "android" && Number.parseInt(String(Platform.Version), 10) >= 31);

type GlassSurfaceProps = ViewProps & {
    /** Style de verre : 'regular' (surfaces) ou 'clear' (chips, contrôles compacts). */
    glassEffectStyle?: "clear" | "regular";
    /** Teinte du verre (ex. ambre de la charte All In). */
    tintColor?: string;
    /** Verre interactif (réagit au toucher). @default false */
    isInteractive?: boolean;
    /** Intensité du BlurView (fallbacks). @default 40 */
    intensity?: number;
};

/**
 * Surface translucide 3-tier :
 * iOS 26+ → Liquid Glass natif ; sinon BlurView (iOS < 26, Android 12+) ; sinon fond brume translucide.
 * Ne jamais appliquer d'opacité < 1 sur ce composant ou son parent : le rendu du verre disparaît.
 * Pour animer, utiliser glassEffectStyle en config { style, animate } plutôt que l'opacité.
 */
export const GlassSurface = ({ children, style, glassEffectStyle = "regular", tintColor, isInteractive, intensity = 40, ...props }: GlassSurfaceProps) => {

    if (supportsLiquidGlass) {
        return (
            <GlassView
                style={style}
                glassEffectStyle={glassEffectStyle}
                tintColor={tintColor}
                isInteractive={isInteractive}
                {...props}>
                {children}
            </GlassView>
        );
    }

    if (supportsBlur) {
        return (
            <BlurView
                style={style}
                intensity={intensity}
                tint="default"
                blurMethod={Platform.OS === "android" ? "dimezisBlurViewSdk31Plus" : undefined}
                {...props}>
                {!!tintColor && (
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            backgroundColor: tintColor,
                            opacity: 0.9,
                        }} />
                )}
                {children}
            </BlurView>
        );
    }

    return (
        <View style={[style, { backgroundColor: tintColor ? `${tintColor}E6` : "#F6F8FDE0" }]} {...props}>
            {children}
        </View>
    );
};

/**
 * Fond de BottomSheet (@gorhom/bottom-sheet) en verre.
 * Retire le backgroundColor fourni par défaut (une couleur pleine masquerait le verre),
 * et pose un fond thématique (brume / encre nuit) pour la lisibilité des fallbacks :
 * sans lui, le BlurView laisse le contenu de la page transparaître sous le sheet.
 */
export const GlassSheetBackground = ({ style, ...props }: ViewProps) => {

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const background = { ...(StyleSheet.flatten(style) as ViewStyle | null ?? {}) };
    delete background.backgroundColor;

    return (
        <GlassSurface
            {...props}
            style={[background, { borderRadius: 24, overflow: "hidden" }]}
            intensity={70}
            tintColor={isDark ? "#101736" : "#F6F8FD"}
        />
    );
};
