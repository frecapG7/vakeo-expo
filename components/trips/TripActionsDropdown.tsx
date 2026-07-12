import { IconSymbol } from "@/components/ui/IconSymbol";
import useColors from "@/hooks/styles/useColors";
import { ActivityIndicator, Alert, Text, View } from "react-native";
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
  const colors = useColors();

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
        <View className="bg-gray-800 rounded-full p-2">
          <IconSymbol name="ellipsis.circle" color="white" />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 12,
            padding: 8,
            marginTop: 8,
            width: 220,
            backgroundColor: colors.background,
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
          customStyles={{ optionWrapper: { backgroundColor: colors.background } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-1.5">
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <IconSymbol name="doc.on.doc" size={24} />
              </Animated.View>
            </View>
            <Text className="text-base dark:text-white">Partager le voyage</Text>
          </View>
        </MenuOption>

        <View className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

        <MenuOption
          onSelect={onEdit}
          customStyles={{ optionWrapper: { backgroundColor: colors.background } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-orange-400 dark:bg-gray-200 rounded-full p-1.5">
              <IconSymbol name="pencil" size={24} />
            </View>
            <Text className="text-base dark:text-white">Modifier le voyage</Text>
          </View>
        </MenuOption>

        <View className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

        <MenuOption
          onSelect={handleDeletePress}
          customStyles={{ optionWrapper: { backgroundColor: colors.background } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-red-400 dark:bg-red-600 rounded-full p-1.5">
              {isDeleting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <IconSymbol name="trash" size={24} />
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
