import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function handleGetMe() {
        try {
            setLoading(true)
            const data = await getMe()
            setUser(data.user)
        } catch (err) {
            // Log the error to help debug
            console.error("Auth check status:", err.response?.status);
            
            // If the error is NOT a 401 (e.g., 500, network error, or server sleep),
            // we might want to be careful about clearing the user.
            // But for now, we follow the server's lead on 401.
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetMe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}