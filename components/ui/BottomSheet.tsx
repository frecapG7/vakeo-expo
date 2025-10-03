import useColors from "@/hooks/styles/useColors";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo } from "react";





const CustomBottomSheet = ({ bottomSheetRef, children }: {
    bottomSheetRef: any,
    children: React.ReactNode
}) => {

    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const colors = useColors();


    return (


        <BottomSheet ref={bottomSheetRef}
            index={-1}
            enableDynamicSizing={false}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleStyle={{
                backgroundColor: "primary"
            }}
            backgroundStyle={{
                backgroundColor: colors.background,
                elevation: 2,
                backfaceVisibility: "hidden"
            }}
        >
            {children}
        </BottomSheet>
    )


}

export default CustomBottomSheet;