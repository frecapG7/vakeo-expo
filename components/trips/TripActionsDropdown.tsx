import { IconSymbol } from "@/components/ui/IconSymbol";
import { ActivityIndicator, Alert, Text, View, useColorScheme } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface TripActionsDropdownProps {
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function TripActionsDropdown({
  onShare,
  onEdit,
  onDelete,
  isDeleting = false,
}: TripActionsDropdownProps) {
  const colorScheme = useColorScheme();
  const menuBackground = colorScheme === "dark" ? "#101736" : "#F6F8FD";
  const iconColor = colorScheme === "dark" ? "#F7B74A" : "#16265C";

  const handleDeletePress = () => {
    if(isDeleting) return;
    Alert.alert("Supprimer cette escapade ?", "", [
      { text: "Annuler" },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            await onDelete();
          } catch (error) {
            console.error("Delete failed:", error);
          }
        },
        style: "destructive"
      }
    ]);
  };

  return (
    <Menu>
      <MenuTrigger>
        <View className="bg-ink rounded-full p-2">
          <IconSymbol name="ellipsis" color="white" />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 12,
            padding: 8,
            marginTop: 8,
            width: 220,
            backgroundColor: menuBackground,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          },
          optionWrapper: {
            margin: 4,
            borderRadius: 8,
          },
        }}
      >
        <MenuOption
          onSelect={onShare}
          customStyles={{ optionWrapper: { backgroundColor: menuBackground } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-amber-deep dark:bg-amber/20 rounded-full p-1.5">
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <IconSymbol name="doc.on.doc" size={24} color={iconColor} />
              </Animated.View>
            </View>
            <Text className="text-base text-night dark:text-white">Partager le voyage</Text>
          </View>
        </MenuOption>

        <View className="h-px bg-gray-200 dark:bg-white/10 my-1" />

        <MenuOption
          onSelect={onEdit}
          customStyles={{ optionWrapper: { backgroundColor: menuBackground } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-amber-deep dark:bg-amber/20 rounded-full p-1.5">
              <IconSymbol name="pencil" size={24} color={iconColor} />
            </View>
            <Text className="text-base text-night dark:text-white">Modifier le voyage</Text>
          </View>
        </MenuOption>

        <View className="h-px bg-gray-200 dark:bg-white/10 my-1" />

        <MenuOption
          onSelect={handleDeletePress}
          customStyles={{ optionWrapper: { backgroundColor: menuBackground } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-red-400 dark:bg-red-600 rounded-full p-1.5">
              {isDeleting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <IconSymbol name="trash" size={24} color="white" />
              )}
            </View>
            <Text className="text-base text-red-500 dark:text-red-400">
              Supprimer le voyage
            </Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
}
