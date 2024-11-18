import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose, IoMenu } from 'react-icons/io5';

import { useLogoutUserMutation } from '../redux/features/auth/authapi';
import { logout } from '../redux/features/auth/authSlice';
import "./Dropdown.css";
import Avatar from './Avatar/Avatar';

const navLists = [
  { name: 'Home', path: '/' },
  { name: 'Posts', path: '/Posts' },
  { name: 'Announcements', path: '/Announcements' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {user} = useSelector((state) => state.auth);
  console.log(user);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation()

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (error) {
      
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Fonction pour ouvrir/fermer le dropdown
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Gestion du clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Fermer le dropdown si on clique à l'extérieur
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scrolling and navbar visibility
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, visible]);

  return (
    <header className={`bg-white py-6 shadow-md sticky top-0 z-50 transition-all duration-300 ${visible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <nav className='container mx-auto flex justify-between items-center px-5'>
        {/* Brand Logo */}
        <a href="/" className='flex items-center gap-2'>
          <img
            src="/logo3.jpg"
            alt="Logo"
            className="h-12 w-19"
          />
          <span className='text-2xl font-semibold text-gray-800'></span>
        </a>

        {/* Desktop Nav Menu */}
        <ul className='hidden sm:flex items-center gap-10'>
          {navLists.map((list, index) => (
            
              <li key={index}>
          
              <NavLink
                to={`${list.path}`}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-medium'
                    : 'text-gray-600 hover:text-blue-600 transition-all'
                }
              >
                {list.name}
              </NavLink>
           
            </li> 
           
            
          ))}
          <li ref={dropdownRef}>
          <button
              onClick={toggleDropdown}
              
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-medium'
                  : 'text-gray-600 hover:text-blue-600 transition-all'
              }
              style={{display:'inline-block', position:'relative'}}
            >
              Activities
              {isOpen && (
                <div className="dropdown-content">
                <NavLink
                to={`/Cas`}
                className='text-gray-600 hover:text-blue-600 transition-all'
              >
                CAS
              </NavLink>
              <NavLink
                to={`/`}
                className='text-gray-600 hover:text-blue-600 transition-all'
              >
                Tutoring
              </NavLink>
              <NavLink
                to={`/`}
                className='text-gray-600 hover:text-blue-600 transition-all'
              >
                Club
              </NavLink>
              </div>
              )}
            </button>
          </li>

          {/* Render button based on user login action */}

          {
            user ? (<li className='flex items-center gap-3'>
              
              <button
               onClick={handleLogout}
               className='text-gray-600 hover:text-blue-600 transition-all font-medium'>Logout</button>
            </li>) : (          <li>
              <NavLink
                to='/login'
                className='text-gray-600 hover:text-blue-600 transition-all font-medium'>
                Login
              </NavLink>
            </li>)
          }


          {
            user && user.role === "admin" && (<li className='flex items-center gap-3'>
              <Link to="/dashboard"><button className='bg-[#1E73BE] px-4 py-1.5 text-white rounded-sm'>Dashboard</button></Link>
            </li>) 
          }
  {user ? (
    <li>
    <Avatar username={user.username}/>
    </li>
  ) : (
""
  )}
          
        </ul>

        {/* Mobile Menu Toggle Button */}
        <div className='flex items-center sm:hidden'>
          <button
            onClick={toggleMenu}
            className='flex items-center px-3 py-3 bg-gray-100 rounded-full shadow-md text-gray-700 hover:bg-gray-200 transition'
          >
            {isMenuOpen ? <IoClose className='w-6 h-6' /> : <IoMenu className='w-6 h-6' />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Items */}
      {isMenuOpen && (
        <ul className='fixed top-[88px] left-0 w-full h-auto pb-8 bg-white shadow-lg z-50 rounded-b-lg'>
          {navLists.map((list, index) => (
            <li className='mt-5 px-6' key={index}>
              <NavLink
                onClick={() => setIsMenuOpen(false)}
                to={`${list.path}`}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-medium'
                    : 'text-gray-600 hover:text-blue-600 transition-all'
                }
              >
                {list.name}
              </NavLink>
            </li>
          ))}
          <li className='px-6 mt-5'>
            <NavLink
              to='/login'
              onClick={() => setIsMenuOpen(false)}
              className='text-gray-600 hover:text-blue-600 transition-all font-medium'
            >
              Login
            </NavLink>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;
