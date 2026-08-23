import { login, register, getMe, logout } from '../services/auth.api'
import { useContext, useState } from 'react'
import { AuthContext } from '../auth.context'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const [authError, setAuthError] = useState(null)

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        setAuthError(null)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed"
            setAuthError(msg)
            return { success: false, error: msg }
        } finally {
            setLoading(false)
        }
    }

    async function handleLogin({ email, password }) {
        setLoading(true)
        setAuthError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true, user: data.user }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed. Check your email & password."
            setAuthError(msg)
            return { success: false, error: msg }
        } finally {
            setLoading(false)
        }
    }

    async function handleLogout() {
        setLoading(true)
        try {
            await logout()
        } catch (err) {
            console.error("Logout error:", err)
        } finally {
            setUser(null)
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        authError,
        setAuthError,
        handleRegister,
        handleLogin,
        handleLogout
    }
}