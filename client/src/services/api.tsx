import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // required so the browser sends the httpOnly jwt cookie
});

export default api;
