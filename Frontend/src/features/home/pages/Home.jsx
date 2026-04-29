import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSongs'

const Home = () => {
  const { handleGetSong } = useSong()
  
  return (
    <main className="container" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      paddingTop: '0', 
      paddingBottom: '80px',
      overflow: 'hidden'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '4px', 
          background: 'linear-gradient(to right, #fff, var(--primary))', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          Moodify
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
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
