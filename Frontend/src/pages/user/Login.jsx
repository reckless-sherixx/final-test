/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useLoginUserMutation, useLogoutUserMutation } from '../../redux/features/auth/authapi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/auth/authSlice';
import "./customCheckbox.css"

const Login = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [grade, setGrade] = useState('');

  const dispatch = useDispatch();

  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const navigate = useNavigate();
    // console.log("Loging user Api", loginUser);
  const handleLogin = async (e) => {
    const username = `${name}${surname}${grade}`;
    e.preventDefault();
    const data = {
        username : username,
        password,
      }
    
    try {
      const response= await loginUser(data).unwrap();
      //console.log(response)
      const { token, user } = response;
      dispatch(setUser({ user }));
      navigate('/');
      
    } catch (err) {
      setMessage(`Please provide valid informations !`);
    }
  };



  return (
    <div className='max-w-sm bg-white mx-auto p-8 mt-36'>
      <h2 className='text-2xl font-semibold pt-5'>Please login</h2>
      <form onSubmit={handleLogin} className='space-y-5 max-w-sm mx-auto pt-8'>
        <input type="text" value={name} 
         className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name" required />
        <input type="text" value={surname} 
         className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        onChange={(e) => setSurname(e.target.value)} 
        placeholder="Surname" required />
        <input type="text" value={grade} 
         className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        onChange={(e) => setGrade(e.target.value)} 
        placeholder="Grade" required />
        <input type="password" value={password} 
        className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        {
          message && <p className="text-red-500">{message}</p>  // Display error message if any
        }
        <button type="submit" disabled={loginLoading}
         className='w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'
        >Login</button>
        <label class="custom-checkbox">
          <input type="checkbox" required/>
          <span></span>
          <p className='my-5 text-center' >I accept the use of cookies (it is only to stay logged in, even after closing your browser).</p>
        </label>
       
      </form>
     
       
    </div>
  );
};

export default Login;