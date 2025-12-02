// Is name weird ? 
import { useGetNames } from "@/hooks/api/useGoods";
import { Trip } from "@/types/models";
import { useState } from "react";
import { useController } from "react-hook-form";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";



const NameInput = ({ trip, control }: { trip: Trip, control: any }) => {



    const { field: { value, onChange } } = useController({
        control,
        name: "name",
        rules: {
            required: true,
            minLength: 1,
            maxLength: 100
        }
    });
    const { data: names } = useGetNames(trip?._id, value);

    const [showDropdown, setShowDropdown] = useState(false);



    return (
        <View className="">

            <View className="flex relative  flex-row gap-2 bg-gray-200 justify-between items-center ">
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    className="flex-grow placeholder-black"
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setShowDropdown(false)}

                />
                {value !== "" &&
                    <Animated.View entering={FadeIn} >
                        <Button onPress={() => onChange("")}>
                            <IconSymbol name="xmark.circle" color="black" />
                        </Button>
                    </Animated.View>
                }



            </View>
            {showDropdown &&
                <Animated.View entering={SlideInDown}
                    // exiting={SlideInUp}
                    pointerEvents="auto"
                    className="absolute top-full left-0 right-0 z-50 border border-blue-300 rounded-lg bg-white dark:bg-gray-200">
                    
                    <FlatList
                        data={names}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) =>
                            <Pressable onPress={() => {
                                console.log("toto")
                                onChange(item);
                                setShowDropdown(false);
                            }}
                            className="z-51">
                                <Text className="capitalize text-lg">{item}</Text>
                            </Pressable>
                        }
                        ItemSeparatorComponent={() =>
                            <View className="items-center my-1">
                                <View className="w-80 h-0.5 bg-blue-700 content-center" />
                            </View>
                        }
                    />
                </Animated.View>

            }
        </View>
    )
}


export const GoodForm = ({ control, trip }: { control: any, trip: Trip }) => {


    const { field: { value: name, onChange: setName } } = useController({
        control,
        name: "name",
        rules: {
            required: true,
            minLength: 1,
            maxLength: 100
        }
    });
    const { field: { value: quantity, onChange: setQuantity } } = useController({
        control,
        name: "quantity",
        rules: {
            required: true,
            maxLength: 155
        }
    });

    return (
        <View className="flex-row flex-1 bg-gray-200 flex-grow rounded-lg focus:border-2 focus:border-blue-400">
            <View className="flex-1 border-r border-black px-2">
                <NameInput trip={trip} control={control} />
            </View>

            <View className="flex-row items-center w-1/6 px-2">
                <Text>x</Text>
                <TextInput

                    onChangeText={setQuantity}
                    value={quantity}
                    className="text-md flex-1 text-dark bg-gray-200 text-right"
                    placeholderTextColor="#0000"
                />

            </View>
        </View>
    )
}