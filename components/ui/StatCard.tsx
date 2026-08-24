import useColors from "@/hooks/styles/useColors";
import { Pressable, PressableProps, Text, View } from "react-native";
import { IconSymbol, IconSymbolName } from "./IconSymbol";

type StatCardColor = "orange" | "orange-dark" | "blue" | "blue-dark" | "green" | "green-dark" | "red" | "red-dark";

interface StatCardProps extends PressableProps {
  icon: IconSymbolName;
  count: number | string;
  label: string;
  color?: StatCardColor;
  warning?: number | string
}

export function StatCard({ icon, count, label, color = "orange", warning, ...props }: StatCardProps) {
  const colors = useColors();

  const bgColorClasses = {
    orange: "bg-orange-100 dark:bg-orange-500/50",
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
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`rounded-full p-1.5 ${bgColorClasses[color]}`}>
            <IconSymbol name={icon} size={24} color={colors.primary} />
          </View>
          <Text className="text-xl font-bold dark:text-white">{count}</Text>
        </View>
        {warning && (
          <View className="flex-row bg-amber-100 dark:bg-amber-500/20 rounded-full px-2 py-0.5">
            <Text className="text-amber-700 dark:text-amber-300 text-xs font-medium">
              {warning}
            </Text>
            <IconSymbol name="exclamationmark" color="orange" size={12}/>
          </View>
        )}
      </View>

      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </Text>
    </Pressable>
  );
}
