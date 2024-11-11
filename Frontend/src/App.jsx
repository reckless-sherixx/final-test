import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='bg-bgprimary min-h-screen flex flex-col'>
      <Navbar/>
      <div  className='flex-grow'>
        <Outlet/>
      </div>
      <footer className='mt-auto'>Footer</footer>
    </div>
    </>
  )
}

export default App
