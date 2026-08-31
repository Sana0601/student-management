import axios from "axios";

const api = axios.create({
    baseURL: "https://student-management-4mg5.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;