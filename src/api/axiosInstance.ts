import axios from "axios";


export const serverApiInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});