import { IconSymbol, IconSymbolName } from "./IconSymbol";
import useColors from "@/hooks/styles/useColors";
import { Pressable, PressableProps, Text, View } from "react-native";

type StatCardColor = "orange" | "orange-dark" | "blue" | "blue-dark" | "green" | "green-dark" | "red" | "red-dark";

interface StatCardProps extends PressableProps {
  icon: IconSymbolName;
  count: number | string;
  label: string;
  color?: StatCardColor;
}

export function StatCard({ icon, count, label, color = "orange", ...props }: StatCardProps) {
  const colors = useColors();

  const bgColorClasses = {
    orange: "bg-orange-100 dark:bg-orange-900/50",
    "orange-dark": "bg-orange-200 dark:bg-orange-800/50",
    blue: "bg-blue-100 dark:bg-blue-900/50",
    "blue-dark": "bg-blue-200 dark:bg-blue-800/50",
    green: "bg-green-100 dark:bg-green-900/50",
    "green-dark": "bg-green-200 dark:bg-green-800/50",
    red: "bg-red-100 dark:bg-red-900/50",
    "red-dark": "bg-red-200 dark:bg-red-800/50",
  };

  return (
    <Pressable
      className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
      {...props}
    >
      <View className="flex-row items-center gap-3">
        <View className={`rounded-full p-1.5 ${bgColorClasses[color]}`}>
          <IconSymbol name={icon} size={24} color={colors.primary} />
        </View>
        <Text className="text-xl font-bold dark:text-white">{count}</Text>
      </View>
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </Text>
    </Pressable>
  );
}
