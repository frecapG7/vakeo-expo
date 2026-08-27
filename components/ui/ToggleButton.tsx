import { Pressable, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { IconSymbol } from "./IconSymbol";
import { useEffect } from "react";

interface ToggleButtonProps {
  active: boolean;
  onPress: () => void;
  label: string;
  icon?: string;
  className?: string;
}

export const ToggleButton = ({
  active,
  onPress,
  label,
  icon = "checkmark",
  className = "",
}: ToggleButtonProps) => {
  const opacity = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0);
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Pressable
      className={`flex-row rounded-full justify-center items-center gap-1 p-2 shadow ${className} ${
        active
          ? "bg-orange-200 dark:bg-orange-600 border border-orange-300"
          : "bg-white dark:bg-gray-900 dark:border dark:border-gray-600"
      }`}
      onPress={onPress}
    >
      <Animated.View
        style={[animatedStyle]}
        className="rounded-full bg-orange-400 p-1"
        pointerEvents={active ? "auto" : "none"}
      >
        <IconSymbol name={icon} color="white" size={14} />
      </Animated.View>
      <Text className={`${active ? "font-bold" : ""} text-sm dark:text-white`}>
        {label}
      </Text>
    </Pressable>
  );
};
