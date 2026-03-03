export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token !== null && token !== undefined;
};

export const logout = () => {
  localStorage.removeItem("token");
};