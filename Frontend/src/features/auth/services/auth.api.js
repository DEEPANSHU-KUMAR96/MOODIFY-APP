import axios from 'axios'

const api = axios.create({
    baseURL: "https://moodify-app-n3r2.onrender.com",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export async function register({ email, password, username }) {
    const response = await api.post("/api/auth/register", {
        email, password, username
    })
    return response.data
}

export async function login({ email, password }) {
    // In many setups, specifically passing the credentials here helps
    const response = await api.post("/api/auth/login", {
        email, password
    })
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")
    return response.data
}