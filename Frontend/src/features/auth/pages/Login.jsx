import React, { useState, useEffect } from 'react'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { user, loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true })
        }
    }, [user, navigate])

    async function handleSubmit(e) {
        e.preventDefault()
        setErrorMessage("")
        const res = await handleLogin({ email, password })
        if (res?.success) {
            navigate('/')
        } else if (res?.error) {
            setErrorMessage(res.error)
        }
    }

    return (
        <main className="login-page">
            <div className='form-container'>
                <h1>Moodify</h1>
                <p className="subtitle">Sign in to sync your moods and discover personalized sounds.</p>
                
                {errorMessage && (
                    <div className="auth-error-banner" role="alert">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (errorMessage) setErrorMessage("")
                        }}
                        label="Email Address" 
                        placeholder="e.g. name@example.com" 
                        type="email"
                        required
                    />

                    <FormGroup
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (errorMessage) setErrorMessage("")
                        }}
                        label="Password" 
                        placeholder="••••••••" 
                        type="password"
                        required
                    />

                    <button className='btn-primary' type='submit' disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="footer-link">
                    New to Moodify? <Link to='/register'>Create an account</Link>
                </p>
            </div>
        </main>
    )
}

export default Login
