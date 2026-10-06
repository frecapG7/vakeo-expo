import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { UserRestrictionsForm } from "@/components/users/UserRestrictionsForm";
import { useTrip } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Toast } from "toastify-react-native";



export default function TripSettings() {

    const { me, trip } = useTrip();

    const { data: user } = useGetTripUser(trip._id, me?._id);
    const updateTripUser = useUpdateTripUser(trip._id, user?._id);

    const { control, reset, formState: { isDirty }, handleSubmit } = useForm({
        defaultValues: {
            hasHalal: false,
            hasKasher: false,
            hasNoPork: false,
            hasNoAlcohol: false,
            hasVegan: false
        }
    });


    useEffect(() => {
        if (!user)
            return;

        reset({
            hasHalal: user.restrictions?.includes("hasHalal"),
            hasKasher: user.restrictions?.includes("hasKasher"),
            hasNoPork: user.restrictions?.includes("hasNoPork"),
            hasNoAlcohol: user.restrictions?.includes("hasNoAlcohol"),
            hasVegan: user.restrictions?.includes("hasVegan"),
        });
    }, [user, reset])


    const onSubmit = async (formData: Record<string, boolean>) => {
        const restrictions = Object.keys(formData).filter(key => formData[key]);
        await updateTripUser.mutateAsync({
            ...user,
             restrictions
        });
        Toast.success("Profil modifié")
    };


    if (!user)
        return (
            <View className="flex-1 bg-mist dark:bg-ink px-4 py-4 gap-4">
                <View className="rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 p-4 gap-4 items-start">
                    <Skeleton variant="circular" height={40} />
                    <View className="flex-row gap-5 items-center">
                        <View className="w-32">
                            <Skeleton height={5} />
                        </View>
                        <View className="w-20">
                            <Skeleton height={5} />
                        </View>
                    </View>
                </View>
                <View className="rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 p-4">
                    <Skeleton height={40} />
                </View>
            </View>)

    return (
        <View className="flex-1 bg-mist dark:bg-ink">
            <Animated.ScrollView contentContainerClassName="px-4 py-4 gap-4">

                {/* Carte profil */}
                <View className="rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 p-4 gap-4">
                    <View className="flex-row gap-4 items-center">
                        <Avatar src={user?.avatar} size2="xl" alt={user?.name.charAt(0)} />
                        <Text className="text-3xl font-bold text-night dark:text-white flex-1" numberOfLines={2}>
                            {user?.name}
                        </Text>
                    </View>
                    <View className="flex-row gap-3">
                        <Button
                            size="small"
                            variant="outlined"
                            title="Modifier nom"
                            onPress={() => router.push({ pathname: "/[id]/settings/username", params: { id: trip._id } })}
                        />
                        <Button
                            size="small"
                            variant="outlined"
                            title="Modifier avatar"
                            onPress={() => router.push({ pathname: "/[id]/settings/avatar", params: { id: trip._id } })}
                        />
                    </View>
                </View>

                {/* Restrictions */}
                <View className="rounded-2xl bg-white dark:bg-night border border-mist dark:border-white/10 p-4 gap-4">
                    <View className="gap-1">
                        <Text className="text-xl font-bold text-night dark:text-white">
                            Restrictions
                        </Text>
                        <Text className="text-xs text-night/60 dark:text-white/60">
                            Renseigne tes restrictions alimentaires afin de faciliter l&apos;organisation des repas
                        </Text>
                    </View>

                    <UserRestrictionsForm control={control} />

                    {isDirty && (
                        <Animated.View entering={FadeIn}>
                            <Button
                                variant="contained"
                                title="Modifier"
                                isLoading={updateTripUser.isPending}
                                onPress={handleSubmit(onSubmit)}
                            />
                        </Animated.View>
                    )}
                </View>

            </Animated.ScrollView>
        </View>
    )
}
