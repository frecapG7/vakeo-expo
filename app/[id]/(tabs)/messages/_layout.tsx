import { BackgroundHeader } from "@/components/header/BackgroundHeader";
import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Pressable, Text, View } from "react-native";

export default function MessagesLayout() {

    const { id } = useGlobalSearchParams();
    const router = useRouter();
    const { data: trip } = useGetTrip(id);
    const { me } = useContext(TripContext);

    return (
        <Stack screenOptions={{
            headerShown: true,
            title: "Messages",
            headerTintColor: "white",
            headerTitleStyle: styles.headerTitle,
            headerBackground: () => trip && <BackgroundHeader trip={trip} />,
            headerRight: () =>
                <View className="flex flex-row gap-2 justify-end items-center mx-10">
                    <Pressable className="flex-row gap-1 items-center"
                        onPressOut={() => router.navigate({
                            pathname: "/[id]/settings",
                            params: {
                                id: String(id)
                            }
                        })}>
                        <Text className="text-white font-bold text-sm">
                            {me?.name}
                        </Text>
                        <Avatar src={me?.avatar} alt={me?.name?.charAt(0)} size2="sm" />
                    </Pressable>
                </View>,
        }}>
            <Stack.Screen name="index" />
        </Stack>
    )
}