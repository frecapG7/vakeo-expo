import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

export default function Messages() {
    const { id } = useLocalSearchParams<{ id: string }>();


    const router = useRouter();

    useFocusEffect(() => {
        router.replace({
            pathname: "/[id]/chat",
            params : {
                id
            }
        });
    });

    return (
        <></>
    );
}