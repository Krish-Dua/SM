import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// export const API = axios.create({
//   baseURL:import.meta.env.VITE_BACKEND_BASE_URL,
//   withCredentials: true, 
// });

