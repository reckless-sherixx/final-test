import cookies from "js-cookie"
import { createSlice } from '@reduxjs/toolkit';

// Utility function to check if the token exists in cookies
const isTokenPresentInCookies = () => {
  const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
  return !!token;
};

// Utility function to get the initial state from localStorage
const loadUserFromLocalStorage = () => {
  try {
    // if (!isTokenPresentInCookies()) {
    //   localStorage.removeItem('user');
    //   return { user: null };
    // }

    const serializedState = localStorage.getItem('user');
    if (serializedState === null) return { user: null };
    return { user: JSON.parse(serializedState) };
  } catch (err) {
    return { user: null };
  }
};

const getInitialState = () => {
  const state = {
    user: null,
    isLoggedIn: false,
  }

  const localStorageUser = localStorage.getItem('user')
  if (localStorageUser) {
    state.user = JSON.parse(localStorageUser)
  }

  const isLoggedInCookie = cookies.get("isLoggedIn")
  if (isLoggedInCookie) {
    state.isLoggedIn = Boolean(isLoggedInCookie)
  }

  return state
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      cookies.remove("isLoggedIn")
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;