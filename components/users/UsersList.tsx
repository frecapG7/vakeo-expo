import { Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";



export const UsersList = ({ users = [], size = 24 }: { users: any[], size?: number }) => {


    const me = 1; // Replace with actual user ID from context or state

    return (
        <View className="flex flex-col divide-y divide-secondary">
            {users.map((user) => (
                <View key={user.id} className="flex flex-row items-center justify-between gap-2 py-2">
                    <View className="flex flex-row items-center gap-2">
                        <Avatar alt={user.name?.charAt(0)} size={size} />
                        <Text className="text-lg text-secondary">{user.name}</Text>
                    </View>
                    {user.id === me &&
                        <View className="flex bg-blue-400 rounded-lg p-1">
                            <Text className="text-sm text-secondary text-right">Moi</Text>
                        </View>
                    }
                </View>
            ))}
        </View>
    )






}