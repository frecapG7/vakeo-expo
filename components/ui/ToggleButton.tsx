import { Pressable, Text } from "react-native";
import { IconSymbol } from "./IconSymbol";

interface ToggleButtonProps {
  active: boolean;
  onPress: () => void;
  label: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
}

export const ToggleButton = ({
  active,
  onPress,
  label,
  icon = "checkmark",
  className = "",
  disabled = false,
}: ToggleButtonProps) => {
  return (
    <Pressable
      className={`flex-row rounded-full justify-center items-center gap-1 p-2 shadow ${className} ${
        active
          ? "bg-orange-200 dark:bg-orange-600 border border-orange-300"
          : "bg-white dark:bg-gray-900 dark:border dark:border-gray-600"
      } ${disabled ? "opacity-40" : ""}`}
      onPress={onPress}
      disabled={disabled}
    >
      {/* <Animated.View className="rounded-full bg-orange-400 p-1"> */}
        <IconSymbol name={icon} color="white" size={14} />
      {/* </Animated.View> */}
      <Text className={`${active ? "font-bold" : ""} text-sm dark:text-white`}>
        {label}
      </Text>
    </Pressable>
  );
};
