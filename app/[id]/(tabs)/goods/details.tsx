import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { useGetGoods } from "@/hooks/api/useGoods";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";


export default function GoodDetailsPage() {



    const { id, name } = useLocalSearchParams();

    const { data } = useGetGoods(id, {
        search: name
    });

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: name
        });
    }, [name, navigation]);

    const goods = useMemo(() => data?.pages.flatMap((page) => page?.goods), [data]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                data={goods}
                keyExtractor={(item) => item._id}
                // className="p-2"
                contentContainerClassName="gap-2"
                renderItem={({ item }) =>
                    <View className="bg-gray-200 shadow-md rounded-md">
                        <Text className="text-2xl font-bold capitalize">{item.quantity}</Text>
                        <View className="items-center">
                            <Avatar src={item?.createdBy.avatar} alt={item?.createdBy.name.charAt(0)} />
                            <Text className="">{item.createdBy?.name}</Text>
                        </View>

                        <Text>
                            {item?.event?.name}
                        </Text>

                    </View>
                } />
        </SafeAreaView>
    )
}