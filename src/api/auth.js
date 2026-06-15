import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Signup
export const signupUser = (data) => API.post("/auth/signup", data);

// Login
export const loginUser = (data) => API.post("/auth/login", data);
export default API;
