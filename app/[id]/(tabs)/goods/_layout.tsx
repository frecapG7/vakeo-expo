import useColors from "@/hooks/styles/useColors";
import { Stack } from "expo-router";

export default function GoodsLayout() {

    const colors = useColors();

    return (
        <Stack screenOptions={{
            title: "Courses",
            headerShadowVisible: false
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
            <Stack.Screen name="details" options={{
                presentation: "modal",
            }} />
        </Stack>
    )

}