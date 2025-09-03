import { useStyles } from "@/hooks/styles/useStyles";
import { Slot, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";


export default function TripActivitiesLayout() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { header } = useStyles();

    return (
        <Slot screenOptions={{
            headerShown: false
        }}/>
    );
}
