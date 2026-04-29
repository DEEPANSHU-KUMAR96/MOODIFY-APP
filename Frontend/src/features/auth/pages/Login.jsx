import React, { useState } from 'react'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate('/')
    }

    return (
        <main className="login-page">
            <div className='form-container'>
                <h1>Moodify</h1>
                <p className="subtitle">Sign in to sync your moods and discover personalized sounds.</p>
                
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address" 
                        placeholder="e.g. name@example.com" 
                        type="email"
                        required
                    />

                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password" 
                        placeholder="••••••••" 
                        type="password"
                        required
                    />

                    <button className='btn-primary' type='submit'>
                        Sign In
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
