import axios from "axios";
import Toast from "react-native-toast-message";


const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
  },
});

client.interceptors.request.use(config => config, (error) => {
  console.error(`Http request error : ${error}`);
  Toast.show({
    type: "error",
    text1: "Une erreur s'est produite"
  });
});
client.interceptors.response.use(response => response, (error) => {
  console.error(JSON.stringify(error));
  console.error(`Http response error : ${error}`);
  if (error?.status !== 404)
    Toast.show({
      type: "error",
      text1: "Une erreur s'est produite"
    })
});

export default client;