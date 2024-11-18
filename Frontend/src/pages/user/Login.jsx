/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useLoginUserMutation, useLogoutUserMutation } from '../../redux/features/auth/authapi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/features/auth/authSlice';
import "./customCheckbox.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const navigate = useNavigate();
    // console.log("Loging user Api", loginUser);
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
        email,
        password,
      }
    
    try {
      const response= await loginUser(data).unwrap();
      //console.log(response)
      const { token, user } = response;
      dispatch(setUser({ user }));
      alert('Login successful');
      navigate('/');
      
    } catch (err) {
      setMessage(`Please provide a valid email and password! ${JSON.stringify(err)}`);
    }
  };



  return (
    <div className='max-w-sm bg-white mx-auto p-8 mt-36'>
      <h2 className='text-2xl font-semibold pt-5'>Please login</h2>
      <form onSubmit={handleLogin} className='space-y-5 max-w-sm mx-auto pt-8'>
        <input type="text" value={email} 
         className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" required />

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