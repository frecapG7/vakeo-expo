import { Text, View } from "react-native";

type HeaderTitleProps = {
  title: string;
  subtitle?: string;
};

export const HeaderTitle = ({ title, subtitle }: HeaderTitleProps) => {
  return (
    <View className="flex-1 items-center">
      <Text className="font-bold text-lg dark:text-white" numberOfLines={1}>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm italic text-gray-500 dark:text-gray-200" numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};