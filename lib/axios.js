import axios from "axios";

export default axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
  },
});
