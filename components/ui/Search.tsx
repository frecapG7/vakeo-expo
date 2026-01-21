import styles from "@/constants/Styles"
import { Pressable, TextInput, View } from "react-native"
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
import { IconSymbol } from "./IconSymbol"




export const Search = ({ value, onChange }: { value: string, onChange: (text: string) => void }) => {


    return (
        <View className="flex-row bg-gray-200 dark:bg-gray-400 focus:border focus:border-blue-400 shadow items-center px-2 rounded-lg">

            <IconSymbol name="magnifyingglass" color="blue"/>
            <TextInput
                onChangeText={onChange}
                value={value}
                className="text-md flex-1 text-dark"
                placeholderTextColor="#000000"
                // ref={ref}
                // placeholder={placeholder}
                style={styles.textInput}
            />
            {!!value &&
                <Animated.View entering={ZoomIn} exiting={ZoomOut}>
                    <Pressable onPress={() => onChange("")}>
                        <IconSymbol name="xmark.circle" color="black"/>
                    </Pressable>
                </Animated.View>
            }
        </View>
    )
}