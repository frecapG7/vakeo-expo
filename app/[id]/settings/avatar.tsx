import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { TripContext } from "@/context/TripContext";
import { useGetTripUser, useUpdateTripUser } from "@/hooks/api/useTrips";
import useColors from "@/hooks/styles/useColors";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const avatars = [
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/femme_neige.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/fille.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/garcon.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/homme_rando.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/papie.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/famille.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/fille_piscine.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/homme_noir_surf.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/chef_poule.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/chat.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/chien.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/dauphin.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/licorne.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/marmotte.png" },
    { uri: "https://storage.googleapis.com/vakeo_dev/avatar/morse.png" },
];


export default function AvatarSetting() {

    const router = useRouter();
    const { me , trip} = useContext(TripContext);
    const { data: user } = useGetTripUser(trip._id, me?._id);
    const updateUser = useUpdateTripUser(trip._id, user?._id);
    const colors = useColors();
    const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(user?.avatar || null);


    const disabledAvatars = trip?.users.filter(u => u._id !== user?._id)?.map(u => u.avatar);

    const handleSelect = (uri: string) => {
        setSelectedAvatar(uri);
    };

    const handleSave = async () => {
        if (selectedAvatar)
            await updateUser.mutateAsync({
                ...user,
                avatar: selectedAvatar
            });
        router.back();

    };

    const getUserNameForAvatar = (uri: string): string => {
        const disabledUser = trip?.users.filter(u => u._id !== user?._id)
            ?.find(u => u.avatar === uri);
        if (disabledUser) {
            return disabledUser.name;
        }
        if (user?.avatar === uri) {
            return "Moi";
        }
        if (selectedAvatar === uri) {
            return "Moi";
        }
        return "";
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <Animated.ScrollView
                contentContainerStyle={{
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                }}
            >
                {/* Header */}
                <Animated.View entering={FadeIn} className="mb-6">
                    <Text
                        className="text-3xl font-bold dark:text-white"
                        style={{ color: colors.text }}
                    >
                        Choisissez votre avatar
                    </Text>
                    <Text className="text-lg text-gray-500 dark:text-gray-400 mt-1">
                        Trouvez le look parfait pour votre profil
                    </Text>
                </Animated.View>

                {/* Avatar Grid - 4 per row */}
                <View className="flex-row flex-wrap justify-between mb-8 gap-3">
                    {avatars.map((item, index) => {
                        const isSelected = selectedAvatar === item.uri;
                        const userName = getUserNameForAvatar(item.uri);
                        const isDisabled = disabledAvatars?.includes(item.uri);

                        return (
                            <Animated.View
                                key={item.uri}
                                entering={FadeIn.delay(index * 50)}
                                exiting={FadeOut}
                                className="w-[23%] mb-4 items-center"
                            >
                                <Pressable
                                    disabled={isDisabled}
                                    onPress={() => handleSelect(item.uri)}
                                    className={`${isSelected ? "opacity-100" : "opacity-90"} ${isDisabled && "opacity-40"}`}
                                >
                                    <View className="relative">
                                        <View
                                            className={`rounded-full p-1 ${isSelected ? "bg-blue-500" : "bg-transparent"}`}
                                        >
                                            <Avatar src={item.uri} size2="lg" />
                                        </View>
                                        {isDisabled && (
                                            <View className="absolute top-0 right-0 bg-black bg-opacity-60 rounded-full p-1">
                                                <IconSymbol name="lock.fill" color="white" size={16} />
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                                <Text
                                    className="text-xs text-center mt-2 dark:text-white">
                                    {userName}
                                </Text>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Selection Preview */}
                {selectedAvatar && (
                    <Animated.View entering={FadeIn} className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                        <Text className="text-lg font-semibold dark:text-white mb-3">
                            Avatar sélectionné
                        </Text>
                        <View className="flex-row items-center gap-4">
                            <Avatar src={selectedAvatar} size2="xl" />
                            <View>
                                <Text className="text-xl font-bold dark:text-white">
                                    {user?.name || "Votre avatar"}
                                </Text>
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    Prêt à enregistrer
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* Save Button */}
                <Animated.View entering={FadeIn.delay(200)}>
                    <Button
                        isLoading={updateUser.isPending}
                        onPress={handleSave}
                        variant="contained"
                        disabled={!selectedAvatar}
                        title="Enregistrer mon avatar"
                    />
                </Animated.View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
