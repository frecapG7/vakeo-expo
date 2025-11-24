import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function GoodDetailsPage() {



    const { id, name } = useLocalSearchParams();


    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: name
        });
    }, [name, navigation]);

    return (
        <SafeAreaView>
            <Text>Details</Text>
        </SafeAreaView>
    )
}