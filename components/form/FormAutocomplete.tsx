import { useState } from "react";
import { useController } from "react-hook-form";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";

interface Option {
    key: string,
    value: string
};

export const FormAutocomplete = ({ control, name, rules, options = [] }: { control: any, name: string, rules?: any, options?: Option[] }) => {


    const { field: { value, onChange } } = useController({
        control,
        name,
        rules
    });
    const [showDropdown, setShowDropdown] = useState(false);




    return (
        <View className="relative z-10">

            <View className="flex flex-row gap-2 bg-gray-200 justify-between items-center ">
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    className="flex-grow"
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
                    className="absolute top-full left-0 right-0 z-50 border border-blue-300 rounded-lg bg-white dark:bg-gray-200">
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item?.key}
                        renderItem={({ item, index }) =>
                            <Pressable onPress={() => {
                                console.log("Toto");
                                onChange(item.value);
                                setShowDropdown(false);
                            }}>
                                <Text className="capitalize text-lg">{item?.value}</Text>
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