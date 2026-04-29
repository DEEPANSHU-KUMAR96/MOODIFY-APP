import React, { useState } from 'react'
import "../style/login.scss" // Using shared styles from login.scss
import FormGroup from '../components/FormGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        await handleRegister({ username, password, email })
        navigate('/')
    }

    return (
        <main className="register-page">
            <div className="form-container">
                <h1>Join Us</h1>
                <p className="subtitle">Create an account to start your personalized emotional music journey.</p>

                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label='Full Name' 
                        placeholder='e.g. John Doe' 
                        required
                    />

                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label='Email Address' 
                        placeholder='e.g. name@example.com' 
                        type="email"
                        required
                    />

                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label='Password' 
                        placeholder='••••••••' 
                        type="password"
                        required
                    />

                    <button className='btn-primary' type='submit' disabled={loading}>
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <p className="footer-link">
                    Already a member? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </main>
    )
}

export default Register
