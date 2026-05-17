import { Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

type InfoCardProps = {
  icon: string;
  label: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info';
  };
};

export const InfoCard = ({ icon, label, subtitle, badge }: InfoCardProps) => {
  const getBadgeColors = () => {
    switch (badge?.variant) {
      case 'success':
        return { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' };
      case 'warning':
        return { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200' };
      case 'info':
      default:
        return { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' };
    }
  };

  const badgeColors = getBadgeColors();

  return (
    <View className="mb-4 bg-white dark:bg-gray-900 rounded-xl p-4 items-center border-l-1 border-r-1 border-b-2 border-orange-200 dark:border-gray-600">
      <IconSymbol name={icon} color="orange" size={24} />
      <View className="flex-row items-center gap-2 mt-2">
        <Text className="text-lg font-bold dark:text-white capitalize" numberOfLines={1}>{label}</Text>
        {badge && (
          <View className={`rounded-full px-2 py-1 ${badgeColors.bg}`}>
            <Text className={`text-xs ${badgeColors.text}`}>
              {badge.text}
            </Text>
          </View>
        )}
      </View>
      {subtitle &&
        <Text className="text-sm dark:text-white capitalize" numberOfLines={1}>{subtitle}</Text>
      }
    </View>
  );
};