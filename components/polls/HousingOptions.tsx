import { containsUser } from "@/lib/utils"
import { HousingPoll, TripUser } from "@/types/models"
import { Image, ImageBackground } from "expo-image"
import * as Linking from 'expo-linking'
import { Pressable, Text, View } from "react-native"
import { IconSymbol } from "../ui/IconSymbol"
import { PollOption } from "./PollOption"

export const HousingOptions = ({ poll, user, onVote, onUnVote, onSelected }: { poll: HousingPoll, user?: TripUser, onVote: (option: any) => Promise<void>, onUnVote: (option: any) => Promise<void>, onSelected: (option: any) => void }) => {

    const handleLinkClick = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <View className="gap-5">
            {poll.options.map((option) => {
                const includeUser = containsUser(user, option.selectedBy);
                return <View key={option._id}
                    className="rounded-b-lg rounded-t-xl overflow-hidden border-b border-gray-200 pb-5 bg-white dark:bg-gray-900">
                    <ImageBackground source={option.image}
                        style={{
                            width: "100%",
                            height: 150
                        }}
                    >
                        <View className="flex-1 items-end justify-between p-2">
                            <Pressable className="bg-blue-50 p-2 rounded-xl"
                                onPress={async () => await handleLinkClick(option.url)}>
                                <IconSymbol name="arrow.up.right" color="gray" size={20} />
                            </Pressable>

                            <Image
                                source={option.icon}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10
                                }} />
                        </View>
                    </ImageBackground>
                    <View className="mx-1 gap-2">

                        <Text className="text-lg font-bold dark:text-white"
                            numberOfLines={3}>
                            {option.title}
                        </Text>
                        <Pressable className="flex-row justify-between items-center"
                            onPress={async () => includeUser ? await onUnVote(option) : await onVote(option)}
                            onLongPress={async() => await onSelected(option)}
                            >
                            <PollOption
                                // label={option.title}²
                                selectedBy={option.selectedBy}
                                percent={option.percent}
                                isAnonymous={poll.isAnonymous}
                                includeUser={includeUser}
                            />
                        </Pressable>
                    </View>


                </View>

            }
            )}
        </View>
    )
}