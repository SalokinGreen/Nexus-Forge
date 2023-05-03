import axios from "axios";

export default async function getNaiAccessToken(email, password, id) {
  const response = await axios.post("/api/getNaiAccess", {
    email,
    password,
  });
  console.log(response);
  return response.data.data;
}
