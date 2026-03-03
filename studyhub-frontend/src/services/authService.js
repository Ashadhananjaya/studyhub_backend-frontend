import API from "../api/axiosConfig";

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const signupUser = (data) => {
  return API.post("/auth/signup", data);
};