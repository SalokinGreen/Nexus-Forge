import axios from "axios";

export default async function getNaiAccessToken(email, password, id) {
  const response = await axios.post("/api/getNaiAccess", {
    email,
    password,
  });
  return response.data.data;
}
