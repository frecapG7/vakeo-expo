import { IconSymbol } from "@/components/ui/IconSymbol";
import { Pressable, View, useColorScheme } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

export type ViewToggleMode = "list" | "calendar";

/** Largeur fixe par segment — c'est ce qui rend l'animation triviale en RN (aucune mesure). */
const SEGMENT_WIDTH = 64;

type ViewToggleProps = {
    mode: ViewToggleMode;
    onChange: (mode: ViewToggleMode) => void;
};

/**
 * Segmented control « liste | calendrier » du header planning.
 * Le mode reste dérivé de la navigation (le composant est sans état) : le pouce
 * ambre-deep glisse en spring vers le segment actif. L'animation vit dans
 * `useAnimatedStyle` (pattern Skeleton — pas d'affectation de shared value en
 * effect, règle React Compiler).
 */
export const ViewToggle = ({ mode, onChange }: ViewToggleProps) => {
    const isDark = useColorScheme() === "dark";
    const inactiveColor = isDark ? "#F6F8FD" : "#16265C";

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: withSpring(mode === "calendar" ? SEGMENT_WIDTH : 0, { damping: 18, stiffness: 220 }) }],
    }), [mode]);

    return (
        <View className="flex-row rounded-full bg-white dark:bg-night border border-gray-200 dark:border-white/15 p-1">
            <Animated.View
                pointerEvents="none"
                style={[{ position: "absolute", top: 4, bottom: 4, left: 4, width: SEGMENT_WIDTH }, thumbStyle]}
                className="rounded-full bg-amber-deep"
            />
            <Pressable
                style={{ width: SEGMENT_WIDTH }}
                className="py-1.5 items-center justify-center"
                onPress={() => onChange("list")}
            >
                <IconSymbol name="list.dash" size={18} color={mode === "list" ? "#FFFFFF" : inactiveColor} />
            </Pressable>
            <Pressable
                style={{ width: SEGMENT_WIDTH }}
                className="py-1.5 items-center justify-center"
                onPress={() => onChange("calendar")}
            >
                <IconSymbol name="calendar" size={18} color={mode === "calendar" ? "#FFFFFF" : inactiveColor} />
            </Pressable>
        </View>
    );
};
