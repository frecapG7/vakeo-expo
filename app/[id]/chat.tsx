import { Avatar } from "@/components/ui/Avatar";
import { useTrip } from "@/context/TripContext";
import { useGetMessages, useMarkAllAsRead, usePostMessage } from "@/hooks/api/useMessages";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Text, useColorScheme } from "react-native";
import { Bubble, Chat, IMessage, InputToolbar, Send } from "@kesha-antonov/react-native-chat";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TripMessages() {

    const { me, trip } = useTrip();
    const isDark = useColorScheme() === "dark";
    const { eventId, title } = useLocalSearchParams<{ eventId?: string, title?: string }>();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMessages(trip?._id, eventId);
    const postMessage = usePostMessage(trip?._id, me?._id, eventId);
    const { mutate: markAllAsRead } = useMarkAllAsRead(trip?._id, me?._id, eventId, true);

    const messages = useMemo(() => data?.pages.flatMap((page) => page.messages) ?? [], [data]);

    const onSend = useCallback(async (values: IMessage[]) => {
        await postMessage.mutateAsync(values[0]);
    }, [postMessage]);


    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: title ?? "General"
        })
    }, [navigation, title])

    useFocusEffect(
        useCallback(() => {
            if (!trip?._id || !me?._id) return
            markAllAsRead();
        }, [markAllAsRead, trip?._id, me?._id])
    );

    return (
        <SafeAreaView edges={["bottom"]} style={{ flex: 1 }} className={isDark ? "bg-ink" : "bg-mist"}>
            <Chat
                messages={messages}
                onSend={onSend}
                user={me}
                // La racine de l'app monte deja son GestureHandlerRootView.
                enableGestureHandlerRootView={false}
                renderBubble={(props) => (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            right: { backgroundColor: "#F7B74A" },
                            left: { backgroundColor: isDark ? "#16265C" : "#FFFFFF" }
                        }}
                        textStyle={{
                            right: { color: "#16265C" },
                            left: { color: isDark ? "#F6F8FD" : "#101736" }
                        }}
                    />
                )}
                renderInputToolbar={(props) => me?._id ? (
                    <InputToolbar
                        {...props}
                        containerStyle={{ backgroundColor: isDark ? "#101736" : "#FFFFFF" }}
                    />
                ) : null}
                isUsernameVisible
                isUserAvatarVisible
                isAvatarOnTop={false}
                renderAvatar={({ currentMessage }) =>
                    <Avatar
                        src={typeof currentMessage.user.avatar === "string" ? currentMessage.user.avatar : undefined}
                        alt={String(currentMessage.user.name ?? "").charAt(0)}
                        size2="sm"
                    />
                }
                renderUsername={(user) => {
                    if (user._id === me?._id) return null;
                    return (
                        <Text className="text-xs font-medium text-night/60 dark:text-white/60 px-2 py-0.5 ">
                            {user.name}
                        </Text>
                    );
                }
                }
                textInputProps={{
                    placeholder: "Aa",
                    maxLength: 250,
                    style: { color: isDark ? "#F6F8FD" : "#101736" }
                }}
                // Time integre : couleur par cote (droite = bulle ambre).
                timeTextStyle={{
                    right: { color: "rgba(22,38,92,0.6)" },
                    left: { color: isDark ? "rgba(246,248,253,0.5)" : "rgba(22,38,92,0.5)" }
                }}
                // Jour integre : pill et header flottant styles via le theme du fork.
                dateFormat="ddd D MMM"
                theme={{
                    colors: {
                        dayPillBackground: "#FFFFFF",
                        dayPillText: "#101736"
                    }
                }}
                darkTheme={{
                    colors: {
                        dayPillBackground: "rgba(255,255,255,0.10)",
                        dayPillText: "#F6F8FD"
                    }
                }}
                loadEarlierMessagesProps={{
                    isAvailable: hasNextPage,
                    isLoading: isFetchingNextPage,
                    isInfiniteScrollEnabled: true,
                    onPress: fetchNextPage,
                    label: "Charger les messages précédents",
                    containerStyle: { backgroundColor: "rgba(247,183,74,0.15)" },
                    textStyle: { color: isDark ? "#F7B74A" : "#EE8B33" }
                }}
                renderSend={(props) => {
                    return (
                        <Send {...props}
                            containerStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginRight: 15,
                            }}>
                            <Text className="text-center text-amber-deep dark:text-amber font-bold">
                                Envoyer
                            </Text>
                        </Send>
                    )
                }}
                listProps={{ keyboardShouldPersistTaps: "never" }}
            />
        </SafeAreaView>
    )



}
