import axiosCreate from "axios";

// Buat instance axios dengan base URL dan header default
const axios = axiosCreate.create({
  baseURL: "http://localhost:4001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;
