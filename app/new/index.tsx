import { useRouter } from "expo-router";
import { useEffect } from "react";





export default function NewTripIndex(){

    const router = useRouter();

    useEffect(() => {
        router.replace({
            pathname: "/new/setup-general"
        });
    })

    return (
        <>
        </>
    )
}