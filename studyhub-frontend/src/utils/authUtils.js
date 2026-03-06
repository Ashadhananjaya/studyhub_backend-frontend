export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // JWT is 3 parts: header.payload.signature
    // Decode the payload (middle part) to check expiry
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000; // current time in seconds

    // If token is expired, clean it up and return false
    if (payload.exp && payload.exp < now) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (err) {
    // If token is malformed, remove it
    localStorage.removeItem("token");
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
