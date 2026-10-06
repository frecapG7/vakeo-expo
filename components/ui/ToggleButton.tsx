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
          ? "bg-amber border border-amber-deep"
          : "bg-white dark:bg-night border border-mist dark:border-white/10"
      } ${disabled ? "opacity-40" : ""}`}
      onPress={onPress}
      disabled={disabled}
    >
      <IconSymbol name={icon} color={active ? "#16265C" : "#EE8B33"} size={14} />
      <Text className={`text-sm ${active ? "font-bold text-night" : "text-night dark:text-white"}`}>
        {label}
      </Text>
    </Pressable>
  );
};
