import { useCallback, useState } from "react";
import { Text, View } from "react-native";
// import { GiftedChat } from 'react-native-gifted-chat';



export default function TripMessages() {


    const [messages, setMessages] = useState([])

    // useEffect(() => {
    //     setMessages([
    //         {
    //             _id: 1,
    //             text: 'Hello developer',
    //             createdAt: new Date(),
    //             user: {
    //                 _id: 2,
    //                 name: 'React Native',
    //                 avatar: 'https://placeimg.com/140/140/any',
    //             },
    //         },
    //     ])
    // }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            previousMessages
            // GiftedChat.append(previousMessages, messages),
        )
    }, []);



    return  (
        <View>
            <Text>Messages</Text>
        </View>
    )
    // return (
    //     <GiftedChat
    //             messages={messages}
    //             onSend={messages => onSend(messages)}
    //             user={{
    //                 _id: 1,
    //             }}
    //         />
    // )



}