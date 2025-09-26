import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // backend Express API
  withCredentials: true,
});

export default instance;
