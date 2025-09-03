import { MMKV, Mode } from "react-native-mmkv";




export const storage = new MMKV({
    id: "vakeo-storage",
    encryptionKey: "demo-setup",
    mode: Mode.SINGLE_PROCESS,
    readOnly: false
});



