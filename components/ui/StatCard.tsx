import { Pressable, PressableProps, Text, View, useColorScheme } from "react-native";
import { IconSymbol, IconSymbolName } from "./IconSymbol";

type StatCardColor = "amber" | "amber-deep" | "night" | "danger";

interface StatCardProps extends PressableProps {
  icon: IconSymbolName;
  count: number | string;
  label: string;
  color?: StatCardColor;
  warning?: number | string
}

export function StatCard({ icon, count, label, color = "amber", warning, ...props }: StatCardProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#F7B74A" : "#16265C";

  const bgColorClasses = {
    amber: "bg-amber/30 dark:bg-amber/25",
    "amber-deep": "bg-amber-deep/25 dark:bg-amber-deep/30",
    night: "bg-night/10 dark:bg-white/15",
    danger: "bg-danger/15 dark:bg-danger/25",
  };

  return (
    <Pressable
      className="flex-1 bg-white dark:bg-night rounded-2xl p-4 shadow-sm border border-mist dark:border-white/10"
      {...props}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`rounded-full p-1.5 ${bgColorClasses[color]}`}>
            <IconSymbol name={icon} size={24} color={iconColor} />
          </View>
          <Text className="text-xl font-bold text-night dark:text-white">{count}</Text>
        </View>
        {Number(warning) > 0 && (
          <View className="flex-row bg-amber/40 dark:bg-amber/25 rounded-full px-2 py-0.5 items-center">
            <Text className="text-night dark:text-amber text-base font-medium">
              {warning}
            </Text>
            <IconSymbol name="exclamationmark" color="#EE8B33" size={14}/>
          </View>
        )}
      </View>

      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </Text>
    </Pressable>
  );
}
