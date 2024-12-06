import { Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'

import './App.css'
import './footer.css'

function App() {
  return (
    <>
    <div className='bg-bgprimary min-h-screen flex flex-col'>
      <Navbar/>
      <div  className='flex-grow'>
        <Outlet/>
      </div>
      <footer className="footer">
        <p>
          All rights reserved to The School of Milan © 
          <a href="/GeneralConditionsofUsefortheInternationalSchoolofMilanWebsite.pdf" download className="footer-link">Download CGU</a>
        </p>
      </footer>
    </div>
    </>
  )
}

export default App
