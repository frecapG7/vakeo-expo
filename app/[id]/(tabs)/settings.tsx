import { PickAvatarModal } from "@/components/modals/PickAvatarModal";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Switch } from "@/components/ui/Switch";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import { useLocalSearchParams } from "expo-router";
import { useContext, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";



export default function TripSettings() {


    const { id } = useLocalSearchParams();
    const { me } = useContext(TripContext);

    const [openAvatarModal, setOpenAvatarModal] = useState(false);

    const { data: user } = useGetTripUser(String(id), String(me?._id), {
        enabled: (!!id && !!me?._id),
    })
    const updateTripUser = useUpdateTripUser(String(id), String(me?._id));

    const restrictions = useMemo(() => user?.restrictions || [], [user]);

    const onSwitch = async (value: boolean, name: string) => {
        let newRestrictions = user?.restrictions || [];
        if (value)
            newRestrictions = [...newRestrictions, name]
        else
            newRestrictions = newRestrictions.filter(v => v !== name);

        await updateTripUser.mutateAsync({
            ...user,
            restrictions: newRestrictions
        });

    }

    if (!user)
        return (
            <Animated.View style={styles.container}>
                <View className="flex gap-2 items-start border-b border-blue-700  pb-2 mx-5">
                    <Skeleton variant="circular" height={40} />
                    <View className="flex-row gap-5 items-center">
                        <View className="w-20">
                            <Skeleton height={5} />
                        </View>
                        <View className="w-10">
                            <Skeleton height={5} />
                        </View>
                    </View>
                </View>

                <View className="my-5 gap-4 ml-5 ">
                    <Skeleton height={40} />
                </View>
            </Animated.View>)

    return (
        <Animated.View style={styles.container}>
            <View className="flex gap-2 items-start border-b border-blue-700  pb-2 mx-5">
                <Avatar src={user?.avatar} size2="xl" alt={user?.name.charAt(0)} />
                <View className="flex-row gap-5 items-center">
                    <Text className="dark:text-white text-xl font-bold">{user?.name}</Text>
                    <Pressable className="rounded-full border-blue-400"
                        onPress={() => setOpenAvatarModal(true)} >
                        <Text className="text-sm dark:text-white">Modifier</Text>
                    </Pressable>
                </View>
            </View>

            <View className="my-5 gap-4 ml-5">
                <View>
                    <Text className="text-xl dark:text-white ml-5">
                        Restrictions
                    </Text>
                    <Text className="text-xs dark:text-white">
                        Renseigne tes restrictions alimentaires afin de faciliter l'organisation des repas</Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-gray-800 pb-2 px-10">
                    <Text className="dark:text-white text-lg">Halal</Text>
                    <Switch value={restrictions.includes("hasHalal")}
                        onSwitch={(v) => onSwitch(v, "hasHalal")}
                        disabled={updateTripUser?.isPending} />
                </View>


                <View className="flex-row justify-between items-center border-b border-gray-800 pb-2 px-10">
                    <Text className="dark:text-white text-lg">Kasher</Text>
                    <Switch value={restrictions.includes("hasKasher")}
                        onSwitch={(v) => onSwitch(v, "hasKasher")}
                        disabled={updateTripUser?.isPending}
                    />
                </View>

                <View className="flex-row justify-between items-center border-b border-gray-800 pb-2 px-10">
                    <Text className="dark:text-white text-lg">Pas de porc</Text>
                    <Switch value={restrictions.includes("hasNoPork")}
                        onSwitch={(v) => onSwitch(v, "hasNoPork")}
                        disabled={updateTripUser?.isPending}
                    />
                </View>

                <View className="flex-row justify-between items-center border-b border-gray-800 pb-2 px-10">
                    <Text className="dark:text-white text-lg">Pas d'alcool</Text>
                    <Switch value={restrictions.includes("hasNoAlcohol")}
                        onSwitch={(v) => onSwitch(v, "hasNoAlcohol")}
                        disabled={updateTripUser?.isPending} />
                </View>

                <View className="flex-row justify-between items-center border-b border-gray-800 pb-2 px-10">
                    <Text className="dark:text-white text-lg">Végétarien</Text>
                    <Switch value={restrictions.includes("hasVegan")}
                        onSwitch={(v) => onSwitch(v, "hasVegan")}
                        disabled={updateTripUser?.isPending} />
                </View>
            </View>



            <PickAvatarModal open={openAvatarModal}
                onClose={() => setOpenAvatarModal(false)}
                onClick={async (avatar) => {
                    await updateTripUser.mutateAsync({
                        ...me,
                        avatar
                    });
                    setOpenAvatarModal(false);
                }} />
        </Animated.View>
    )
}