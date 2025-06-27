import { FormNumber } from "@/components/form/FormNumber";
import { FormSelect } from "@/components/form/FormSelect";
import { FormText } from "@/components/form/FormText";
import { Button } from "@/components/ui/Button";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { useStyles } from "@/hooks/styles/useStyles";
import { useForm } from "react-hook-form";
import { Modal, Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";



const AddGrocery = ({ open, onClose }: { open: boolean, onClose: (refresh?: boolean) => void }) => {


    const { container } = useStyles();

    const { control, handleSubmit } = useForm();


    const onSubmit = async (data: any) => {
        // Handle the form submission logic here
        console.log("Submitted data:", data);
        onClose(true);
    }

    return (
        <Modal visible={open} animationType="slide" onRequestClose={() => onClose(false)}>
            <ThemeProvider>
                <Animated.ScrollView style={container}>
                    <View className="flex flex-row justify-between items-center p-5">
                        <Pressable onPress={() => onClose()}>
                            <Text className="text-secondary">Annuler</Text>
                        </Pressable>
                    </View>


                    <View className="flex flex-row gap-1 justify-center items-center p-5">
                        <FormText name="name" control={control} rules={{ required: true }} label="Nom" />
                        {/* <FormNumber name="quantity" control={control} rules={{ required: true }} label="Quantité" />
                        <FormSelect name="unit" control={control} rules={{ required: true }} label="Unité" options={[
                            { label: 'kg', value: 'kg' },
                            { label: 'g', value: 'g' },
                            { label: 'L', value: 'L' },
                            { label: 'mL', value: 'mL' },
                            { label: 'pcs', value: 'pcs' },
                        ]} /> */}
                    </View>


                    <Button title="Ajouter" onPress={handleSubmit(onSubmit)} className="m-5 bg-blue-400" />

                </Animated.ScrollView>
            </ThemeProvider>
        </Modal>
    )
}


export default AddGrocery;