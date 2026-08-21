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


const deleteCookie = (name: string, path = "/", domain?: string) => {
  let cookieString = `${name}=; Max-Age=0; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 1. Remove sessionToken from Cookies
      deleteCookie("sessionToken");

      // 2. Remove permissions from LocalStorage
      localStorage.removeItem("updaid-permissions");

      // 3. Force redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);