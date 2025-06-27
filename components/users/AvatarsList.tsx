import { useStyles } from "@/hooks/styles/useStyles";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Avatar } from "../ui/Avatar";
import { ThemeProvider } from "../ui/ThemeProvider";
import { UsersList } from "./UsersList";



export const AvatarsList = ({ users = [], max = 2, size = 24, title = "" }: {
    users: any[],
    max?: number,
    size?: number,
    title?: string
}) => {



    const { container } = useStyles();

    const [openDetails, setOpenDetails] = useState(false);



    return (
        <View>
            <Pressable className="flex flex-row space-x-0.5 items-center" onPress={(e) => {
                e.preventDefault();
                setOpenDetails(true);
            }}>
                {users.slice(0, max)?.map((user) =>
                    <View key={user.id} className="flex flex-col items-center justify-center">
                        <Avatar alt={user.name?.charAt(0)} size={size} src={user?.avatar} />
                        <Text className={`text-[${size}px] text-secondary truncate`}>{user.name}</Text>
                    </View>
                )}

                {users?.length > max &&
                    <View className="flex flex-col items-center justify-center">
                        <Avatar alt="..." size={size} />
                        <Text className={`text-[${size}px] text-secondary truncate`}>+{users.length - max}</Text>
                    </View>
                }
            </Pressable>
            <Modal
                animationType="slide"
                transparent={false}
                visible={openDetails}
                onRequestClose={() => setOpenDetails(false)}>
                <Animated.ScrollView style={container}>
                    <ThemeProvider>
                        <View className="flex flex-row items-center justify-start gap-5">
                            <Pressable onPress={() => setOpenDetails(false)} className="p-3 rounded-full bg-primary-400">
                                <Text className="font-bold text-sm text-secondary">Fermer</Text>
                            </Pressable>
                            <Text className="font-bold text-lg text-secondary">{title}</Text>
                        </View>
                        <View className="px-5 mt-2">
                            <UsersList users={users} size={40} />
                        </View>

                    </ThemeProvider>
                </Animated.ScrollView>
            </Modal>
        </View>
    )
}