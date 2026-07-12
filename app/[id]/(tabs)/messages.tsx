import { useFocusEffect, useGlobalSearchParams, useRouter } from "expo-router";

export default function Messages() {
    const { id } = useGlobalSearchParams<{ id: string }>();

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