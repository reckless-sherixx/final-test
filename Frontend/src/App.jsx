import { useState } from 'react'
import './App.css'
import './footer.css'
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
      <footer class="footer">
        <p>
          All rights reserved to The School of Milan © 
          <a href="/GeneralConditionsofUsefortheInternationalSchoolofMilanWebsite.pdf" download class="footer-link">Download CGU</a>
        </p>
      </footer>
    </div>
    </>
  )
}

export default App
