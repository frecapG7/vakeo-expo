import { Button } from "@/components/ui/Button";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Skeleton } from "@/components/ui/Skeleton";
import { Text, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

type ConversationsEmptyStateProps = {
    isLoading: boolean;
    onNewConversation: () => void;
};

/**
 * État vide de l'onglet Conversations : skeletons en chargement,
 * sinon carte de verre avec un héros « mini-conversation » — bulle de typing
 * + ma bulle ambre + pill de réaction — plutôt qu'une grande icône message
 * qui rendait mal à cette taille.
 */
export const ConversationsEmptyState = ({ isLoading, onNewConversation }: ConversationsEmptyStateProps) => {

    if (isLoading)
        return (
            <View className="gap-4">
                <View className="flex-row gap-2">
                    <Skeleton variant="circular" height={40} />
                    <View className="flex-1 px-5 gap-2">
                        <Skeleton height={12} />
                        <Skeleton height={12} width="66%" />
                    </View>
                </View>
                <View className="flex-row gap-2">
                    <Skeleton variant="circular" height={40} />
                    <View className="flex-1 px-5 gap-2">
                        <Skeleton height={12} />
                        <Skeleton height={12} width="66%" />
                    </View>
                </View>
            </View>
        );

    return (
        <View className="flex-1 justify-center items-center p-8">
            <GlassSurface style={{ borderRadius: 24 }}>
                <View className="items-center gap-3 p-6">
                    {/* Héros : une conversation qui démarre. La bulle de gauche
                        "tape", la mienne répond, la réaction confirme le clin d'œil. */}
                    <View className="flex-row items-end justify-center gap-1.5 py-3">
                        <Animated.View
                            entering={FadeIn.duration(300).delay(150)}
                            className="bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl rounded-bl-md px-3 py-2.5 flex-row items-center gap-1"
                        >
                            <View className="w-2 h-2 rounded-full bg-gray-400 dark:bg-white/50" />
                            <View className="w-2 h-2 rounded-full bg-gray-400 dark:bg-white/50" />
                            <View className="w-2 h-2 rounded-full bg-gray-400 dark:bg-white/50" />
                        </Animated.View>
                        <Animated.View entering={ZoomIn.duration(300).delay(350)}>
                            <View className="relative">
                                <View className="bg-amber rounded-2xl rounded-br-md px-3 py-2">
                                    <Text className="text-night font-semibold">On part quand ? ✈️</Text>
                                </View>
                                <View className="absolute -bottom-2 -right-1 flex-row items-center bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full px-1.5 py-0.5">
                                    <Text className="text-xs">❤️</Text>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                    <Text className="text-h1 text-center text-night dark:text-white">C'est calme par ici…</Text>
                    <Text className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Lance la discussion avec ton groupe de voyage.
                    </Text>
                    <Button
                        className="bg-amber p-4 rounded-2xl flex-row items-center justify-center gap-3 w-full mt-2"
                        onPress={onNewConversation}>
                        <IconSymbol name="plus.circle" size={28} color="#16265C" />
                        <Text className="text-base font-bold text-night">Nouvelle discussion</Text>
                    </Button>
                </View>
            </GlassSurface>
        </View>
    );
};
