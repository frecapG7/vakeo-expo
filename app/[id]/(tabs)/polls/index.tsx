import { Avatar } from "@/components/ui/Avatar";
import styles from "@/constants/Styles";
import { TripContext } from "@/context/TripContext";
import { useGetTrip } from "@/hooks/api/useTrips";
import { useGetVotes } from "@/hooks/api/useVotes";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { Text, View } from "react-native";



export default function PollsPage() {


    const { id } = useLocalSearchParams();
    const { data: trip } = useGetTrip(id);
    const { data: page } = useGetVotes(id);



    const {me} = useContext(TripContext);

    return (
        <View style={styles.container}>
            <Text>Sondage</Text>


            <Text>{page?.totalResults}</Text>





            <View>
                <View className="flex-row">
                    <Avatar src={me?.avatar} alt={me?.name.charAt(0)}/>
                    <View>
                        <Text className="text-lg font-bold">{me.name}</Text>
                        <Text className="text-lg font-bold">{me.name}</Text>
                    </View>
                </View>
            </View>


            
        </View>
    )
}