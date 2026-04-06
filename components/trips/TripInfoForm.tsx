import { Trip } from "@/types/models";
import { Image } from "expo-image";
import { Control, useController } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { FormText } from "../form/FormText";
import { FormTextArea } from "../form/FormTextArea";

const themes = [
    {
        "name": "Camping",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/camping.png"
    },
    {
        "name": "Bateau",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/bateau.png"
    },
    {
        "name": "Chalet",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/chalet.png"
    },
    {
        "name": "Escalade",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/escalade.png"
    },
    {
        "name": "Cafe",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/cafe.png"
    },

    {
        "name": "Maison",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/maison.png"
    },
    {
        "name": "Plage",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/plage.png"
    },
    {
        "name": "Hiver",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/hiver.png"
    },
    {
        "name": "Soiree",
        "uri": "https://storage.googleapis.com/vakeo_dev/theme/soiree.png"
    },
]


export const TripInfoForm = ({ control }: { control: Control<Trip> }) => {



    const { field: { value: theme, onChange: setTheme } } = useController({
        control,
        name: "image",
        defaultValue: themes[0]?.uri
    })


    return (
        <View className="gap-5">
            <View>
                <Text className="font-bold text-sm ml-3 dark:text-white">Nom*</Text>
                <FormText control={control}
                    name="name"
                    rules={{
                        required: true,
                        maxLength: 50
                    }}
                    placeholder="Voyage a la montagne*"
                />
            </View>
            <View>
                <Text className="font-bold text-sm ml-3 dark:text-white">
                    Description
                </Text>
                <FormTextArea
                    control={control}
                    name="details"
                    placeholder="Petit séjour pour se resourcer à la montagne autour d'une bonne raclette" />

            </View>



            <View className="border-t border-gray-400">
                <Text className="font-bold text-sm ml-2 dark:text-white">
                    Thème
                </Text>
                <View className="flex  flex-row flex-wrap gap-2 items-center justify-evenly">
                    {themes.map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={() => {
                                setTheme(item.uri);
                            }}
                            className={`p-1 rounded-xl ${item.uri === theme ? "bg-blue-400" : ""}`}
                        >
                            <Image
                                style={{
                                    // ...styles.image,
                                    width: 75,
                                    height: 100,
                                    borderRadius: 10
                                }}
                                source={item.uri}
                                contentFit="cover"
                                transition={1000} />
                        </Pressable>
                    ))}
                </View>
            </View>


        </View>
    )

}