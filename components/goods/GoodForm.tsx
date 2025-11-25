



// Is name weird ? 

import { useGetNames } from "@/hooks/api/useGoods";
import { Trip } from "@/types/models";
import { useController, useWatch } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { FormAutocomplete } from "../form/FormAutocomplete";



export const GoodForm = ({ control, trip }: { control: any, trip: Trip }) => {

    const name = useWatch({
        control,
        name: "name"
    });

    const { field: { value: quantity, onChange: setQuantity } } = useController({
        control,
        name: "quantity",
        rules: {
            required: true,
            maxLength: 155
        }
    });



    const { data: names } = useGetNames(trip._id, name);

    return (
        <View className="flex-row flex-1 bg-gray-200 flex-grow rounded-lg focus:border-2 focus:border-blue-400">
            <View className="flex-1 border-r border-black px-2">
                <FormAutocomplete control={control}
                    name="name"
                    rules={{
                        required: true
                    }}
                    options={names?.map((n, index) => ({
                        key: String(index),
                        value: n
                    })
                    )}
                />
            </View>

            <View className="flex-row items-center w-1/6 px-2">
                <Text>x</Text>
                <TextInput

                    onChangeText={setQuantity}
                    value={quantity}
                    className="text-md flex-1 text-dark bg-gray-200 text-right"
                />

                {/* <Button variant="contained" className="justify-center" onPress={onSubmit}> 
                    <IconSymbol name="plus" color="white" />
                </Button> */}

            </View>
        </View>
    )
}