import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  // Load user
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/api/auth/me');
        dispatch({ 
          type: 'USER_LOADED', 
          payload: { user: res.data.user } 
        });
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data.user,
        },
      });
      return res.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          token: res.data.token,
          user: res.data.user,
        },
      });
      return res.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
