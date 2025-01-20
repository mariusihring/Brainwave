import axios from "axios";

const api_client = axios.create({
	baseURL: "http://localhost:3000",
	
});

export default api_client;
