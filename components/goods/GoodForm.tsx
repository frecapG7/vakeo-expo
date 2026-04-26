import { Good } from "@/types/models";
import { Control, useWatch } from "react-hook-form";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { FormText } from "../form/FormText";
import { Button } from "../ui/Button";
import { IconSymbol } from "../ui/IconSymbol";

export const GoodForm = ({ control, onSubmit, onDelete, isSubmitting, autoFocus }: {
    control: Control<Good>,
    onSubmit: () => Promise<void>,
    onDelete?: () => Promise<void>,
    isSubmitting?: boolean,
    autoFocus?: boolean
}) => {

    const _id = useWatch({
        control,
        name: "_id"
    });


    return (
        <View className="flex-row gap-2 items-center">
            <Button className=""
                disabled={isSubmitting}
                onPress={onSubmit}>
                {isSubmitting ?
                    <ActivityIndicator size="small" />
                    :
                    <IconSymbol
                        name={_id ? "pencil" : "plus"}
                        color="gray"
                        size={24} />
                }
            </Button>
            <View className="flex-1">
                <FormText
                    control={control}
                    name="name"
                    rules={{
                        required: true,
                        maxLength: 255
                    }}
                    placeholder="Ajoute un élément"
                    autoFocus={autoFocus}
                    endAdornment={!!onDelete && 
                    <Pressable
                        onPress={() => Alert.alert("Retirer de la liste ?",
                            "", [
                            {
                                text: "Annuler",
                            },
                            {
                                text: "Supprimer",
                                onPress: onDelete
                            }
                        ])}
                        className="mx-2 rounded-full p-1 bg-gray-200">
                        <IconSymbol name="trash.fill" color="red" size={16} />
                    </Pressable>}
                />
            </View>
        </View>
    )
}