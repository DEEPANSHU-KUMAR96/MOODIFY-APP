import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import LoadingScreen from '../../shared/components/LoadingScreen'

const Protected = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingScreen message="Verifying session..." subtitle="Checking your Moodify credentials" />
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected
