import axios from "axios";


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
  
  console.error(`Http request error : ${error}` );
});
client.interceptors.response.use(response => response, (error) => {
  console.error(JSON.stringify(error));
  console.error("Ici"  + process.env.EXPO_PUBLIC_API_URL)
  console.error(`Http request error : ${error}` );
});

export default client;