import { usePostLinkPreview } from "@/hooks/api/useLinkPreview";
import { Pressable, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

import * as Clipboard from 'expo-clipboard';
import { Image, ImageBackground } from "expo-image";
import * as Linking from 'expo-linking';
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import Animated, { BounceIn, BounceOut, FadeIn, FadeOut, SlideOutDown } from "react-native-reanimated";
import { Skeleton } from "../ui/Skeleton";

const isValidUrl = (url: string) => {
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
    return urlRegex.test(url);
}


export const HousingOptionsForm = ({ control }: { control: any }) => {


    const [input, setInput] = useState("");
    const postLinkPreview = usePostLinkPreview();

    const { fields: options, append, remove } = useFieldArray({
        control,
        name: "options",
    })

    const handleLinkClick = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <View>

            <View className="flex-row bg-white rounded-xl items-center justify-between border border-gray-200 focus:border-blue-500 px-1 py-2">
                <View className="flex-row items-center">
                    <IconSymbol name="link" color="gray" />
                    <TextInput placeholder="Colle un lien Airbnb, Abritel, Booking..."
                        value={input}
                        onChangeText={(v) => setInput(v)}
                        maxLength={38}
                        scrollEnabled />
                </View>
                {isValidUrl(input) ?
                    <Animated.View
                        entering={BounceIn}
                        exiting={BounceOut}
                        className="flex-1">
                        <Pressable
                            className="w-15 bg-blue-400 p-2 rounded-lg items-center justify-center"
                            disabled={postLinkPreview.isPending}
                            onPress={async () => {
                                const response = await postLinkPreview.mutateAsync(input);
                                if (response.success)
                                    append(response.data);
                                setInput("");
                            }}>
                            <IconSymbol name="paperplane.fill" color="white" />
                        </Pressable>
                    </Animated.View> :
                    <Animated.View entering={BounceIn} exiting={BounceOut}>
                        <Pressable className="bg-gray-200 rounded-lg p-2"
                            disabled={postLinkPreview.isPending}
                            onPress={async () => {
                                const text = await Clipboard.getStringAsync();
                                console.log(text);
                                // if (!urlRegex.test(text))
                                //     return;

                                const response = await postLinkPreview.mutateAsync(text);

                                if (response.success)
                                    append(response.data);

                            }}
                        >
                            <IconSymbol name="doc.on.doc" size={24} color="gray" />
                        </Pressable>
                    </Animated.View>
                }
            </View>


            <View className="gap-2 my-2">
                {postLinkPreview.isPending &&
                    <Animated.View entering={BounceIn} exiting={FadeOut}>
                        <Skeleton height={40} />
                    </Animated.View>}
                {options.map((option, index) => (
                    <Animated.View entering={FadeIn}
                        exiting={SlideOutDown}
                        key={option.id}
                        className="bg-white dark:bg-gray-900 rounded-b-lg rounded-t-xl gap-1 pb-2 overflow-hidden">
                        <ImageBackground
                            source={option?.image}
                            // source="https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6ODYwNjYzOTQzOTMxOTQ5NDc0/original/4f625642-5682-40fd-84fa-a5d7d2cf8deb.jpeg?im_w=720&width=720&quality=70&auto=webp"
                            style={{
                                height: 200,
                                width: "100%",
                                flex: 1,
                                alignItems: "flex-end",
                                borderRadius: "inherit"
                            }}
                            className="rounded-t-full"
                            contentFit="cover"
                        >
                            <View className="flex-1 items-end p-2">
                                <View className="flex-1 justify-between">
                                    <Pressable
                                        onPress={() => remove(index)}
                                        className="p-1 bg-gray-400 flex-0 w-10 rounded-full items-center">
                                        <IconSymbol name="trash" />
                                    </Pressable>
                                    <View>
                                        <Image source={option.icon}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10
                                            }}
                                        />
                                    </View>
                                </View>

                            </View>
                        </ImageBackground>
                        {/* <Image source={option.image}
                            style={{
                                height: "100%",
                                width: "100%",
                            }}
                            contentFit="cover" /> */}
                        <View className="mx-1">
                            <Text className="font-bold text-lg dark:text-white">{option.title}</Text>
                            <Pressable className="py-2" onPress={() => handleLinkClick(option.url)}>
                                <Text className="text-red-400 italic underline text-md">
                                    Voir le détails
                                </Text>

                            </Pressable>

                        </View>
                    </Animated.View>
                ))}
            </View>






        </View>
    )
}