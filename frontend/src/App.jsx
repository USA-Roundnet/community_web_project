import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Grid from './components/Grid';
import './App.css'

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Grid />
    </div>
  );
}

export default App
