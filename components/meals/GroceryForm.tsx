import { useWatch } from "react-hook-form"
import { Text, View } from "react-native"
import { FormSelect } from "../form/FormSelect"
import { FormText } from "../form/FormText"




export const GroceryForm = ({ control }: { control: any }) => {


    const toto = useWatch({
        control
    });


    return (
        <View className="flex flex-col gap-4">

            <View className="flex flex-row gap-2 items-center">
                <FormText name="name" control={control} label="Nom" placeholder="Ex: Pâtes, Riz, etc." />
                <FormSelect name="unit" control={control} label="Unité" options={[
                    { label: "kg", value: "kg" },
                    { label: "g", value: "g" },
                    { label: "L", value: "L" },
                    { label: "mL", value: "mL" },
                    { label: "pièce", value: "piece" },
                    { label: "boîte", value: "box" },
                    { label: "sachet", value: "bag" },
                    { label: "autre", value: "other" },
                ]} />
            </View>
            <Text>{JSON.stringify(toto, null, 2)}</Text>

        </View>
    )
}