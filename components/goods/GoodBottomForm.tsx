import useColors from "@/hooks/styles/useColors";
import { Good } from "@/types/models";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Control, useController, useWatch } from "react-hook-form";
import { View } from "react-native";
import { Button } from "../ui/Button";

export const GoodBottomForm = ({ control, onSubmit, onDelete, onCancel, isSubmitting,  autoFocus }: {
    control: Control<Good>,
    onSubmit: () => Promise<void>,
    onDelete?: () => Promise<void>,
    onCancel ?: () => void,
    isSubmitting?: boolean,
    autoFocus?: boolean
}) => {

    const _id = useWatch({
        control,
        name: "_id"
    });


    const { field: { value, onChange: setName }, fieldState: { error, isDirty } } = useController({
        control,
        name: "name",
        rules: {
            required: true
        }
    });

    const { inputPlaceHolder } = useColors();

    return (
        <View className="gap-4 items-center">
            <View className={`flex flex-row items-center bg-gray-100 dark:bg-gray-600  border focus:border focus:border-blue-500 rounded-xl h-12 ${error && "border border-red-400"}`} >
                <BottomSheetTextInput
                    value={value}
                    onChangeText={(v) => {
                        setName(v);
                    }}
                    className={`w-[90%] text-dark dark:text-white h-full items-start normal-case`}
                    placeholderTextColor={inputPlaceHolder}
                    placeholder="Ajoute un élément"
                    style={{
                        flexGrow: 1
                    }}
                // ref={valueTextInputRef}
                />
            </View>
            <View className="flex-row gap-4 items-center justify-center">
                <Button variant="outlined"
                    title="Annuler"
                    onPress={onCancel}
                    />
                <Button variant="contained"
                    title={_id ? "Modifier" : "Ajouter"}
                    disabled={!isDirty}
                    onPress={onSubmit}
                    isLoading={isSubmitting}
                />

            </View>
        </View>
    )
}