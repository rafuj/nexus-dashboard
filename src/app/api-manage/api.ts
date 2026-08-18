// import axios from "axios"

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })


import axios from "axios"

// In dev, route through local proxy (/api). In production, use VITE_API_URL directly.
const baseURL = import.meta.env.DEV 
  ? "/api" 
  : import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})