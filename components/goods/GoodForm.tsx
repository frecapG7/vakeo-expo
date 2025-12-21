// Is name weird ? 
import { useGetNames } from "@/hooks/api/useGoods";
import { Trip } from "@/types/models";
import { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";

export const GoodForm = ({ control, trip }: { control: any, trip: Trip }) => {

    const { field: { value: quantity, onChange: setQuantity } } = useController({
        control,
        name: "quantity",
        rules: {
            required: true,
            maxLength: 155
        }
    });


    const { field: { value, onChange } , fieldState: { isDirty }} = useController({
        control,
        name: "name",
        rules: {
            required: true,
            minLength: 1,
            maxLength: 100
        },
        defaultValue: ""
    });
    const { data: names } = useGetNames(trip?._id, value);

    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (isDirty)
            setShowDropdown(true);
    }, [isDirty, setShowDropdown])

    return (

        <View className="flex-1">
            <View className="flex-row flex-1 bg-gray-200 flex-grow rounded-lg focus:border-2 focus:border-blue-400">
                <View className="flex-1 border-r border-black px-2">
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
                </View>

                <View className="flex-row items-center w-1/3 px-2">
                    <Text>x</Text>
                    <TextInput
                        onChangeText={setQuantity}
                        value={quantity}
                        className="text-md flex-1 text-dark bg-gray-200 text-right min-h-5"
                        placeholderTextColor="#0000"
                    />
                </View>
            </View>

            {showDropdown &&
                <Animated.View entering={FadeInDown}
                    exiting={FadeOutDown}
                    className="flex px-4 gap-2">
                    {names?.map((name: string, index: number) =>
                        <View key={index} className="border-b dark:border-white bg-orange-200 dark:bg-gray-200 rounded-b-lg">
                            <Button
                                onPress={() => {
                                    onChange(name);
                                    setShowDropdown(false);
                                }}
                                className="flex-1 ml-2 flex-row items-center gap-1">
                                <IconSymbol name="cart" size={12} color="black" />
                                <Text className="capitalize text-lg">{name}</Text>
                            </Button>

                        </View>
                    )}
                </Animated.View>
            }
        </View>
    )
}