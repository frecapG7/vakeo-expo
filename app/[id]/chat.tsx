import { Avatar } from "@/components/ui/Avatar";
import { TripContext } from "@/context/TripContext";
import { useGetMessages, usePostMessage } from "@/hooks/api/useMessages";
import { useGetTrip } from "@/hooks/api/useTrips";
import dayjs from "@/lib/dayjs-config";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


export default function TripMessages() {


    const { id } = useLocalSearchParams<{ id: string }>();

    const { me } = useContext(TripContext);

    const { data: trip } = useGetTrip(id);
    const { data, fetchNextPage, hasNextPage } = useGetMessages(id);
    const postMessage = usePostMessage(id);

    const messages = useMemo(() => data?.pages.flatMap((page) => page.messages), [data]);

    const onSend = useCallback(async (values: IMessage[]) => {
        await postMessage.mutateAsync(values[0]);
    }, [postMessage]);

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={me}
                renderInputToolbar={(props) => me?._id ? <InputToolbar {...props} /> : null}
                infiniteScroll
                renderUsernameOnMessage
                showUserAvatar
                renderAvatarOnTop={false}
                renderAvatar={({ currentMessage }) =>
                    <Avatar
                        src={currentMessage.user.avatar}
                        alt={currentMessage.user.name?.charAt(0)}
                        size2="sm"
                    />
                }
                renderUsername={({ _id, name }) => {
                    if (_id === me?._id) return null;
                    return (
                        <Text className="text-xs font-medium text-gray-500 px-2 py-0.5 ">
                            {name}
                        </Text>
                    );
                }
                }
                placeholder="Aa"
                maxInputLength={250}
                loadEarlier={hasNextPage}
                onLoadEarlier={fetchNextPage}
                renderTime={({ currentMessage, position }) =>
                    <View className="items-center justify-end mx-2">
                        <Text className={`text-[10px] ${position === "right" ? "text-gray-200" : "text-gray-400"}`}>
                            {dayjs(currentMessage?.createdAt).format('LT')}
                        </Text>
                    </View>
                }
                renderDay={({ currentMessage, previousMessage }) => {
                    // Only show day header if there's no previous message or day has changed
                    if (!previousMessage ||
                        !dayjs(currentMessage?.createdAt).isSame(dayjs(previousMessage?.createdAt), 'day')) {
                        return (
                            <Text className="text-center text-[12px] font-semibold text-white bg-blue-400 dark:bg-blue-200 rounded-full px-4 py-1 mx-auto my-2">
                                {dayjs(currentMessage?.createdAt).format("ddd D MMM")}
                            </Text>
                        );
                    }
                    return null;
                }}
                renderLoadEarlier={() => hasNextPage && (
                    <Pressable className="bg-blue-50 rounded-lg p-3 mx-auto mb-4"
                        onPress={() => fetchNextPage()}>
                        <Text className="text-center text-blue-600 text-sm font-medium">
                            Charger les messages précédents
                        </Text>
                    </Pressable>

                )}
                renderSend={(props) => {
                    return (
                        <Send {...props}
                            containerStyle={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginRight: 15,
                            }}>
                            <Text className="text-center text-blue-400 font-bold">
                                Envoyer
                            </Text>
                        </Send>
                    )
                }}
                keyboardShouldPersistTaps="never"
            />
        </SafeAreaView>
    )



}