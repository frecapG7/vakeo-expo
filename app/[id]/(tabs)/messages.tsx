import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetMessages, usePostMessage } from "@/hooks/api/useMessages";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useMemo } from "react";
import { Platform, Text, View } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';



export default function TripMessages() {


    const { id } = useLocalSearchParams();

    const { me } = useContext(TripContext);

    const { data, fetchNextPage, hasNextPage } = useGetMessages(id);
    const postMessage = usePostMessage(String(id));
    
    const messages = useMemo(() => data?.pages.flatMap((page) => page.messages), [data]);

    const onSend = useCallback(async (values = []) => {
        const newMessage = await postMessage.mutateAsync(values[0]);
        GiftedChat.append(messages,
            newMessage,
            Platform.OS !== "web"
        );
    }, []);





    return (
            <View className="flex flex-grow" style={styles.container}>
                <GiftedChat
                    messages={messages}
                    onSend={onSend}
                    user={me}
                    infiniteScroll
                    renderUsernameOnMessage
                    showUserAvatar
                    renderAvatarOnTop={false}
                    renderAvatar={({ currentMessage }) =>
                        <Avatar src={String(currentMessage.user.avatar)}
                            alt={currentMessage.user.name?.charAt(0)}
                            size2="sm"
                        />
                    }
                    renderUsername={({ name }) => <Text className="text-md italic text-blue-400 m-1">{name}</Text>}
                    timeTextStyle={{
                        left: { color: 'red' },
                        right: { color: 'yellow' },
                    }}
                    keyboardShouldPersistTaps="never"
                    placeholder="Aa"
                    maxInputLength={250}
                    loadEarlier={hasNextPage}
                    onLoadEarlier={fetchNextPage}
                />
            </View>


    )



}