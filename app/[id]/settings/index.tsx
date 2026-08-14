import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserRestrictionsForm } from "@/components/users/UserRestrictionsForm";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Toast } from "toastify-react-native";



export default function TripSettings() {


    const { me, trip } = useContext(TripContext);

    const { data: user } = useGetTripUser(trip._id, me?._id);
    const updateTripUser = useUpdateTripUser(trip._id, user?._id);

    const { control, reset, formState: { isDirty }, handleSubmit } = useForm({
        defaultValues: {
            hasHalal: false,
            hasKasher: false,
            hasNoPork: false,
            hasNoAlcohol: false
        }
    });


    useEffect(() => {
        if (!user)
            return;

        const formValues = {
            hasHalal: user.restrictions?.includes("hasHalal"),
            hasKasher: user.restrictions?.includes("hasKasher"),
            hasNoPork: user.restrictions?.includes("hasNoPork"),
            hasNoAlcohol: user.restrictions?.includes("hasNoAlcohol"),
            hasVegan: user.restrictions?.includes("hasVegan"),
        };
        reset(formValues);
    }, [user, reset])


    const onSubmit = async (formData) => {
        const restrictions = Object.keys(formData).filter(key => formData[key]);
        await updateTripUser.mutateAsync({
            ...user,
             restrictions
        });
        Toast.success("Profil modifié")
    };



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
                <View className="flex-row gap-5 items-end">
                    <Text className="dark:text-white text-3xl font-bold">{user?.name}</Text>
                    <View className="flex-1 flex-row items-center gap-2 ">
                        <Pressable
                            onPress={() => router.push({ pathname: "/[id]/settings/avatar", params: { id: trip._id } })}
                        >
                            <Text className="text-neutral-900 dark:text-neutral-100">
                                Modifier avatar
                            </Text>
                        </Pressable>
                        <Text className="text-neutral-900 dark:text-neutral-100">|</Text>
                        <Pressable
                            onPress={() => router.push({ pathname: "/[id]/settings/username", params: { id: trip._id } })}
                        >
                            <Text className="text-neutral-900 dark:text-neutral-100">
                                Modifier nom
                            </Text>
                        </Pressable>
                    </View>
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

                <UserRestrictionsForm control={control} />

                {/* <View className={`flex-row justify-between items-center border-b ${restrictions.includes("hasHalal") ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pr-10 pb-1`}>
                    <View className="flex-row gap-2 items-center">
                        <View className="rounded-full bg-white">
                            <RestrictionIcon value="hasHalal" size="sm" />
                        </View>
                        <Text className="dark:text-white text-lg font-bold">Halal</Text>
                    </View>
                    <Switch value={restrictions.includes("hasHalal")}
                        onSwitch={(v) => onSwitch(v, "hasHalal")}
                        disabled={updateTripUser?.isPending} />
                </View>


                <View className={`flex-row justify-between items-center border-b ${restrictions.includes("hasKasher") ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                    <View className="flex-row gap-2 items-center">
                        <View className="rounded-full bg-white">
                            <RestrictionIcon value="hasKasher" size="sm" />
                        </View>
                        <Text className="dark:text-white text-lg font-bold">Kasher</Text>
                    </View>
                    <Switch value={restrictions.includes("hasKasher")}
                        onSwitch={(v) => onSwitch(v, "hasKasher")}
                        disabled={updateTripUser?.isPending}
                    />
                </View>

                <View className={`flex-row justify-between items-center border-b ${restrictions.includes("hasNoPork") ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                    <View className="flex-row gap-2 items-center">
                        <View className="rounded-full bg-white">
                            <RestrictionIcon value="hasNoPork" size="sm" />
                        </View>
                        <Text className="dark:text-white text-lg font-bold">Pas de porc</Text>
                    </View>
                    <Switch value={restrictions.includes("hasNoPork")}
                        onSwitch={(v) => onSwitch(v, "hasNoPork")}
                        disabled={updateTripUser?.isPending}
                    />
                </View>

                <View className={`flex-row justify-between items-center border-b ${restrictions.includes("hasNoAlcohol") ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                    <View className="flex-row gap-2 items-center">
                        <View className="rounded-full bg-white">
                            <RestrictionIcon value="hasNoAlcohol" size="sm" />
                        </View>
                        <Text className="dark:text-white text-lg font-bold">Pas d'alcool</Text>
                    </View>
                    <Switch value={restrictions.includes("hasNoAlcohol")}
                        onSwitch={(v) => onSwitch(v, "hasNoAlcohol")}
                        disabled={updateTripUser?.isPending} />
                </View>

                <View className={`flex-row justify-between items-center border-b ${restrictions.includes("hasVegan") ? "border-blue-400" : "border-gray-800 dark:border-gray-400"} pb-1 pr-10`}>
                    <View className="flex-row gap-2 items-center">
                        <View className="rounded-full bg-white">
                            <RestrictionIcon value="hasVegan" size="sm" />
                        </View>
                        <Text className="dark:text-white text-lg font-bold">Végétarien</Text>
                    </View>
                    <Switch value={restrictions.includes("hasVegan")}
                        onSwitch={(v) => onSwitch(v, "hasVegan")}
                        disabled={updateTripUser?.isPending} />
                </View> */}

                {isDirty && 
                
                    <Animated.View entering={FadeIn}>
                        <Button
                            variant="contained"
                            title="Modifier"
                            isLoading={updateTripUser.isPending}
                            onPress={handleSubmit(onSubmit)}
                            />
                    </Animated.View>
                }
            </View>




        </Animated.View>
    )
}