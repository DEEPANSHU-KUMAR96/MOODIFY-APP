import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSongs'
import { useAuth } from '../../auth/hooks/useAuth'
import './Home.scss'

const Home = () => {
  const { handleGetSong } = useSong()
  const { user, handleLogout } = useAuth()

  return (
    <div className="home-wrapper">
      {/* Top Navbar with User Info & Logout */}
      <header className="home-navbar">
        <div className="home-navbar__brand">
          <div className="home-navbar__logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <span className="home-navbar__title">Moodify</span>
        </div>

        {user && (
          <div className="home-navbar__user-group">
            <div className="home-navbar__user-badge" title={user.email}>
              <span className="home-navbar__avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="home-navbar__username">
                {user.username || user.email?.split('@')[0]}
              </span>
            </div>

            <button 
              className="home-navbar__logout-btn" 
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      <main className="home-container">
        <div className="home-header">
          <h1 className="home-title">
            Moodify
          </h1>
          <p className="home-subtitle">
            How are you feeling today?
          </p>
        </div>

        <FaceExpression
          onClick={(expression) => {
            handleGetSong({ mood: expression })
          }}
        />
        <Player />
      </main>
    </div>
  )
}

export default Home
