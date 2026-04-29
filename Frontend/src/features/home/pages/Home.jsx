import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSongs'
import './Home.scss'

const Home = () => {
  const { handleGetSong } = useSong()

  return (
    <main className="home-container">
      <header className="home-header">
        <h1 className="home-title">
          Moodify
        </h1>
        <p className="home-subtitle">
          How are you feeling today?
        </p>
      </header>

      <FaceExpression
        onClick={(expression) => {
          handleGetSong({ mood: expression })
        }}
      />
      <Player />
    </main>
  )
}

export default Home
