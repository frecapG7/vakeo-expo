import { FormCheckbox } from "@/components/form/FormCheckbox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGetLinks } from "@/hooks/api/useLinks";
import { useLocalSearchParams } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { Text, View } from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";



export default function TripLinks() {

    const { id } = useLocalSearchParams();
    const { control } = useForm();

    const filters = useWatch({
        control
    });
    const { data: links } = useGetLinks(id as string, {
        types: Object.keys(filters)
            .filter((key) => filters[key])
            .join(",") || undefined,
    });



    return (
        <Animated.ScrollView style={{ flex: 1 }}>

            <View className="flex flex-row justify-around items-center p-5">
                <View className="flex flex-col gap-1">
                    <IconSymbol name="eurosign.circle" size={24} color="#000" />
                    <FormCheckbox control={control} name="budget" />
                </View>

                <View className="flex flex-col gap-1 justify-center items-center">
                    <IconSymbol name="bed.double" size={24} color="#000" />
                    <FormCheckbox control={control} name="housing" />
                </View>

            </View>
            <View className="flex flex-col gap-4 px-5 divide-y ">
                {links?.map((link) => (
                    <Animated.View entering={SlideInUp} exiting={SlideOutDown} key={link.id} >
                        <View className="flex flex-row justify-between items-center">
                            <View>
                                <Text className="text-xl font-bold">{link.title}</Text>
                                <Text className="truncate text-blue-600 italic">{link.url}</Text>
                            </View>
                            <View>
                                {link.type === "budget" ? (
                                    <IconSymbol name="eurosign.circle" size={24} color="#000" />
                                ) : link.type === "housing" ? (
                                    <IconSymbol name="bed.double" size={24} color="#000" />
                                ) : (
                                    <IconSymbol name="link" size={24} color="#000" />
                                )}
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </View>

        </Animated.ScrollView>
    )
}