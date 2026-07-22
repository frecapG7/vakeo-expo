import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text, View } from "react-native";

type TripActionCardProps = {
  icon: {
    name: string;
    color?: string; // Optional custom color
  };
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  disabled?: boolean;
  capitalizeTitle?: boolean;
  badge?: {
    color: string;
    text?: string;
    icon?: string;
  };
};

export const TripActionCard = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  disabled = false,
  capitalizeTitle = false,
  badge
}: TripActionCardProps) => {
  return (
    <Button
      className={`flex-row items-center p-1 py-2 rounded-xl dark:bg-gray-800 shadow-sm will-change-variable relative ${disabled ? "opacity-60" : "active:bg-gray-50 dark:active:bg-gray-700"}`}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="bg-orange-100 dark:bg-orange-200/20 p-3 rounded-lg mr-3">
        <IconSymbol name={icon.name} size={24} color={icon.color || "#F97316"} />
      </View>
      <View className="flex-1 ">
        <Text className={`font-medium text-lg dark:text-white ${capitalizeTitle && "capitalize"}`} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <View className="flex-row items-center relative">
        {showChevron && (
          <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
        )}
      </View>
        {badge && (
          <View className="rounded-full p-1 absolute -top-3 right-0" style={{ backgroundColor: badge.color }}>
            {badge.icon ? (
              <IconSymbol name={badge.icon} size={14} color="white" />
            ) : (
              <Text className="text-white text-xs font-bold px-1">{badge.text || ""}</Text>
            )}
          </View>
        )}
    </Button>
  );
};