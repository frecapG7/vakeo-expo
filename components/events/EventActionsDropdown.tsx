import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text, View, useColorScheme } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

/**
 * Menu d'actions de la fiche activite (header).
 *
 * « Modifier » reste ouvert a tout membre : `PUT /trips/:id/events/:eventId`
 * n'exige que l'appartenance au trip. « Signaler » est reserve aux
 * non-organisateurs, l'API refusant l'auto-signalement (403).
 */
export function EventActionsDropdown({
  isOwner,
  onEdit,
  onReport,
}: {
  isOwner: boolean;
  onEdit: () => void;
  onReport: () => void;
}) {

  const colorScheme = useColorScheme();
  const menuBackground = colorScheme === "dark" ? "#101736" : "#F6F8FD";
  const iconColor = colorScheme === "dark" ? "#F7B74A" : "#16265C";

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
          onSelect={onEdit}
          customStyles={{ optionWrapper: { backgroundColor: menuBackground } }}
        >
          <View className="flex-row gap-3 items-center p-2">
            <View className="bg-amber-deep dark:bg-amber/20 rounded-full p-1.5">
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <IconSymbol name="pencil" size={24} color={iconColor} />
              </Animated.View>
            </View>
            <Text className="text-base text-night dark:text-white">{"Modifier l'activité"}</Text>
          </View>
        </MenuOption>

        {!isOwner && (
          <>
            <View className="h-px bg-night/10 dark:bg-white/10 my-1" />
            <MenuOption
              onSelect={onReport}
              customStyles={{ optionWrapper: { backgroundColor: menuBackground } }}
            >
              <View className="flex-row gap-3 items-center p-2">
                <View className="bg-danger/15 rounded-full p-1.5">
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <IconSymbol name="flag.fill" size={24} color="#E5484D" />
                  </Animated.View>
                </View>
                <Text className="text-base text-danger">{"Signaler l'activité"}</Text>
              </View>
            </MenuOption>
          </>
        )}
      </MenuOptions>
    </Menu>
  );
}
