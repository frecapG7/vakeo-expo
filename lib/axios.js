import axios from "axios";
import { Toast } from "toastify-react-native";


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

client.interceptors.request.use(config => config, (error) => handleError(error));
client.interceptors.response.use(response => response, (error) => handleError(error));



const handleError = (error) => {
  if (error?.response) {
    switch (error.response.status) {
      case "404":
        Toast.error("La resource demandée n'existe plus :(")
        break;
      default:
        Toast.error("Une erreur s'est produite");
        console.error("Http response error");
        throw new Error("Http response error");
    }
  } else if (error?.request) {
    console.error(error?.request);
    Toast.error("Une erreur s'est produite");
    throw new Error("Http request error");
  }
  else {
    console.error(error?.message);
    Toast.error("Une erreur s'est produite");
    throw new Error(error?.message);
  }
}


export default client;