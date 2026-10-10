import { Text, View } from "react-native";

type HeaderTitleProps = {
  title: string;
  subtitle?: string;
};

export const HeaderTitle = ({ title, subtitle }: HeaderTitleProps) => {
  return (
    <View pointerEvents="box-none" className="items-center">
      <Text className="font-bold text-lg text-night dark:text-white" numberOfLines={1}>
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm italic text-night/50 dark:text-white/50" numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};
