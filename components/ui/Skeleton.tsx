import { DimensionValue } from "react-native";
import Animated, { Easing, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";

type SkeletonVariant = "rectangular" | "circular";

interface SkeletonProps {
    variant?: SkeletonVariant;
    height?: number;
    /** Largeur optionnelle (nombre ou pourcentage) — défaut : w-full. */
    width?: DimensionValue;
    /** Classes statiques additionnelles (littérales à l'appel — NativeWind ne compile pas les classes dynamiques). */
    className?: string;
}

/**
 * Bloc de chargement animé (pulsation d'opacité).
 * NB : les tailles passent par le prop `style`, jamais par des classes —
 * NativeWind ne compile pas les classes construites dynamiquement (`h-${height}`).
 */
export const Skeleton = ({ variant = "rectangular", height = 10, width, className }: SkeletonProps) => {

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1, // Infinite loop, alternée
            true
        )
    }));


    if (variant === "circular")
        return <Animated.View
            className={`flex rounded-full bg-gray-200 dark:bg-gray-800 ${className ?? ""}`}
            style={[animatedStyle, { width: height, height }]}
        />


    return (
        <Animated.View
            className={`flex rounded-lg bg-gray-200 dark:bg-gray-800 w-full ${className ?? ""}`}
            style={[animatedStyle, { height }, width !== undefined && { width }]}
        />
    )
}
