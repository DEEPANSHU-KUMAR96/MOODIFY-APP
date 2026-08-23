import React, { useRef, useState, useEffect, useMemo } from 'react'
import { useSong } from '../hooks/useSongs'
import './player.scss'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

// Clean up ugly filenames/tags like [DOWNLOADED FROM...], (Official Video), etc.
const cleanTitle = (rawTitle) => {
    if (!rawTitle) return 'Unknown Track'
    return rawTitle
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\.mp3$/i, '')
        .replace(/_320kbps|_128kbps/gi, '')
        .trim() || rawTitle
}

const Player = () => {
    const { song } = useSong()

    const audioRef = useRef(null)
    const progressRef = useRef(null)
    const speedMenuRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [volume, setVolume] = useState(0.85)
    const [showSpeed, setShowSpeed] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [hoverTime, setHoverTime] = useState(null)
    const [hoverPos, setHoverPos] = useState(0)

    // Reset and auto-play when song changes
    useEffect(() => {
        if (audioRef.current && song?.url) {
            audioRef.current.load()
            setCurrentTime(0)
            const playPromise = audioRef.current.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false))
            }
        }
    }, [song?.url])

    // Close speed menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (speedMenuRef.current && !speedMenuRef.current.contains(e.target)) {
                setShowSpeed(false)
            }
        }
        if (showSpeed) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showSpeed])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.pause()
            setIsPlaying(false)
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(console.error)
        }
    }

    const skip = (secs) => {
        const audio = audioRef.current
        if (!audio) return
        audio.currentTime = Math.min(Math.max(audio.currentTime + secs, 0), duration || 0)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleProgressClick = (e) => {
        const bar = progressRef.current
        if (!bar || !duration) return
        const rect = bar.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        const newTime = ratio * duration
        if (audioRef.current) {
            audioRef.current.currentTime = newTime
        }
        setCurrentTime(newTime)
    }

    const handleProgressMouseMove = (e) => {
        const bar = progressRef.current
        if (!bar || !duration) return
        const rect = bar.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        setHoverTime(ratio * duration)
        setHoverPos(ratio * 100)
    }

    const handleProgressMouseLeave = () => {
        setHoverTime(null)
    }

    const handleSpeedChange = (s) => {
        setSpeed(s)
        if (audioRef.current) {
            audioRef.current.playbackRate = s
        }
        setShowSpeed(false)
    }

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        if (audioRef.current) {
            audioRef.current.volume = val
        }
        setIsMuted(val === 0)
    }

    const toggleMute = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isMuted) {
            audio.volume = volume || 0.85
            setIsMuted(false)
        } else {
            audio.volume = 0
            setIsMuted(true)
        }
    }

    const handleSongEnd = () => {
        setIsPlaying(false)
        setCurrentTime(0)
    }

    const progress = duration ? (currentTime / duration) * 100 : 0
    const displayTitle = useMemo(() => cleanTitle(song?.title), [song?.title])
    const moodSlug = (song?.mood || 'happy').toLowerCase()

    if (!song) return null

    return (
        <aside className={`player ${isPlaying ? 'player--playing' : ''}`} aria-label="Music Player">
            <audio
                ref={audioRef}
                src={song.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleSongEnd}
            />

            {/* Track Info (Left) */}
            <div className="player__info">
                <div className="player__poster-wrap">
                    <img
                        className="player__poster"
                        src={song.posterUrl}
                        alt={displayTitle}
                        loading="lazy"
                    />
                    {isPlaying && <span className="player__playing-dot" />}
                </div>
                <div className="player__meta">
                    <p className="player__title" title={song.title}>
                        {displayTitle}
                    </p>
                    <span className={`player__mood player__mood--${moodSlug}`}>
                        {song.mood}
                    </span>
                </div>
            </div>

            {/* Main Center Section (Controls + Progress) */}
            <div className="player__center">
                {/* Control Buttons Row */}
                <div className="player__controls">
                    {/* Speed Selector */}
                    <div className="player__speed-wrap" ref={speedMenuRef}>
                        <button
                            type="button"
                            className={`player__btn player__btn--speed ${showSpeed ? 'active' : ''}`}
                            onClick={() => setShowSpeed(!showSpeed)}
                            title="Playback Speed"
                            aria-label={`Playback speed ${speed}x`}
                        >
                            {speed}×
                        </button>
                        {showSpeed && (
                            <div className="player__speed-menu">
                                <span className="player__speed-header">Speed</span>
                                {SPEED_OPTIONS.map((s) => (
                                    <button
                                        type="button"
                                        key={s}
                                        className={`player__speed-option ${s === speed ? 'active' : ''}`}
                                        onClick={() => handleSpeedChange(s)}
                                    >
                                        {s}×
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rewind 5s */}
                    <button
                        type="button"
                        className="player__btn player__btn--skip"
                        onClick={() => skip(-5)}
                        title="Rewind 5 seconds"
                        aria-label="Rewind 5 seconds"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                        </svg>
                        <span>5s</span>
                    </button>

                    {/* Play / Pause Primary Button */}
                    <button
                        type="button"
                        className="player__btn player__btn--play"
                        onClick={togglePlay}
                        title={isPlaying ? 'Pause' : 'Play'}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                                <rect x="14" y="4" width="4" height="16" rx="1.5" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style={{ transform: 'translateX(1px)' }}>
                                <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                        )}
                    </button>

                    {/* Forward 5s */}
                    <button
                        type="button"
                        className="player__btn player__btn--skip"
                        onClick={() => skip(5)}
                        title="Forward 5 seconds"
                        aria-label="Forward 5 seconds"
                    >
                        <span>5s</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                        </svg>
                    </button>
                </div>

                {/* Scrub Progress Bar */}
                <div className="player__progress-wrap">
                    <span className="player__time player__time--current">{formatTime(currentTime)}</span>
                    <div
                        className="player__progress"
                        ref={progressRef}
                        onClick={handleProgressClick}
                        onMouseMove={handleProgressMouseMove}
                        onMouseLeave={handleProgressMouseLeave}
                        role="slider"
                        aria-valuemin="0"
                        aria-valuemax={duration || 100}
                        aria-valuenow={currentTime}
                        aria-label="Track playback progress"
                    >
                        <div className="player__progress-track" />
                        <div className="player__progress-fill" style={{ width: `${progress}%` }} />
                        <div className="player__progress-thumb" style={{ left: `${progress}%` }} />
                        {hoverTime !== null && (
                            <div className="player__hover-bubble" style={{ left: `${hoverPos}%` }}>
                                {formatTime(hoverTime)}
                            </div>
                        )}
                    </div>
                    <span className="player__time player__time--duration">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume Section (Right) */}
            <div className="player__volume">
                <button
                    type="button"
                    className="player__btn player__btn--vol"
                    onClick={toggleMute}
                    title={isMuted || volume === 0 ? "Unmute" : "Mute"}
                    aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                >
                    {isMuted || volume === 0 ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19 19.27 20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                    ) : volume < 0.5 ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19">
                            <path d="M7 9v6h4l5 5V4L11 9H7z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    )}
                </button>
                <div className="player__volume-slider-wrap">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolume}
                        className="player__volume-slider"
                        style={{
                            background: `linear-gradient(to right, var(--primary, #8b5cf6) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.15) ${(isMuted ? 0 : volume) * 100}%)`
                        }}
                        aria-label="Volume slider"
                    />
                </div>
            </div>
        </aside>
    )
}

export default Player
