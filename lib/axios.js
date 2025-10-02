import axios from "axios";
import Toast from "react-native-toast-message";


const apiKey = process.env.API_KEY || process.env.EXPO_PUBLIC_API_KEY;

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
  },
});

client.interceptors.request.use(config => config, (error) => {
  console.error(`Http request error : ${error}`);
  if (error?.status !== 500)
    throw error;
  Toast.show({
    type: "error",
    text1: "Une erreur s'est produite"
  });
  throw error;
});
client.interceptors.response.use(response => response, (error) => {
  console.error(`Http response error`, error);
  if (error?.status !== 500)
    throw error;
  Toast.show({
    type: "error",
    text1: "Une erreur s'est produite"
  });
  throw error;
});

export default client;