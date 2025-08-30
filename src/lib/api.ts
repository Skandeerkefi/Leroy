import axios from "axios";

const api = axios.create({
	// baseURL: "https://misterteedata.onrender.com",
	baseURL: "https://leroydata.onrender.com",
	// Your backend URL
});

export default api;
