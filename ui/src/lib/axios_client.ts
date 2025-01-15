import axios from "axios";

const api_client = axios.create({
	baseURL: "http://localhost:3000",
	withCredentials: true
});

export default api_client;
