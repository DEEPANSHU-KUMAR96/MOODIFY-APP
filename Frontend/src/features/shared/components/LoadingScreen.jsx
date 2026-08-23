import React from 'react'
import '../styles/loading.scss'

export default function LoadingScreen({ message = "Tuning to your vibe...", subtitle = "Just a moment while we set things up" }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-screen__glow loading-screen__glow--1" />
      <div className="loading-screen__glow loading-screen__glow--2" />

      <div className="loading-screen__card">
        {/* Animated Brand Icon with Equalizer effect */}
        <div className="loading-screen__icon-wrap">
          <div className="loading-screen__pulse-ring" />
          <div className="loading-screen__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="loading-screen__brand">Moodify</h1>

        {/* Sound Wave Animation */}
        <div className="loading-screen__wave" aria-hidden="true">
          <span className="bar bar--1" />
          <span className="bar bar--2" />
          <span className="bar bar--3" />
          <span className="bar bar--4" />
          <span className="bar bar--5" />
          <span className="bar bar--6" />
          <span className="bar bar--7" />
        </div>

        {/* Dynamic Status Text */}
        <div className="loading-screen__text-wrap">
          <p className="loading-screen__message">{message}</p>
          {subtitle && <p className="loading-screen__subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
