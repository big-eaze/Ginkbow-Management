import axios from "axios";



const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});





// Automatically attach token from localStorage to every request
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);




// Handle token expiration
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.clear();

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);


export default instance;