import { TripInfoForm } from "@/components/trips/TripInfoForm";
import { Button } from "@/components/ui/Button";
import styles from "@/constants/Styles";
import useColors from "@/hooks/styles/useColors";
import { Trip } from "@/types/models";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const data = [
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



export default function NewTripGeneral() {

    const colors = useColors();
    const { control, trigger } = useFormContext<Trip>();

    const router = useRouter();





    const navigation = useNavigation();

    useEffect(() => {

        navigation.setOptions({
            headerRight: () =>
                <Button variant="contained"
                    size="small"
                    title="Suivant"
                    onPress={async () => {
                        const valid = await trigger();
                        if (valid)
                            router.push({
                                pathname: "/new/setup-users"
                            })
                    }}>

                </Button>
        })
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView>

                <View className="gap-2">
                    <Text className="text-2xl font-bold dark:text-white">
                        Donne un nom à ton projet
                    </Text>
                    <Text className="text-md dark:text-gray-200">
                        Indique un nom de projet qui définit le type de voyage que tu as en tête.
                        Tu peux également ajouter une description  et personnaliser le thème

                    </Text>


                </View>
                <View className="m-5">
                    <TripInfoForm control={control} />
                </View>
            </Animated.ScrollView>


        </SafeAreaView>
    )
}