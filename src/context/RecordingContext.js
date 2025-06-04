import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const RecordingContext = createContext();

const initialState = {
  recordings: [],
  categories: ['Научная деятельность', 'Спорт', 'Культура', 'Образование', 'Конференции', 'Достижения'],
  loading: false,
  error: null
};

const recordingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_RECORDINGS':
      return {
        ...state,
        recordings: action.payload,
        loading: false
      };
    case 'ADD_RECORDING':
      return {
        ...state,
        recordings: [action.payload, ...state.recordings]
      };
    case 'UPDATE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.map(recording =>
          recording._id === action.payload._id ? action.payload : recording
        )
      };
    case 'DELETE_RECORDING':
      return {
        ...state,
        recordings: state.recordings.filter(recording => recording._id !== action.payload)
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export const RecordingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recordingReducer, initialState);

  // Fetch all recordings
  const fetchRecordings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get('/api/recordings');
      dispatch({ type: 'SET_RECORDINGS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch recordings' });
    }
  };

  // Create recording
  const createRecording = async (recordingData) => {
    try {
      const res = await axios.post('/api/recordings', recordingData);
      dispatch({ type: 'ADD_RECORDING', payload: res.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create recording' };
    }
  };

  // Update recording
  const updateRecording = async (id, recordingData) => {
    try {
      const res = await axios.put(`/api/recordings/${id}`, recordingData);
      dispatch({ type: 'UPDATE_RECORDING', payload: res.data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update recording' };
    }
  };

  // Delete recording
  const deleteRecording = async (id) => {
    try {
      await axios.delete(`/api/recordings/${id}`);
      dispatch({ type: 'DELETE_RECORDING', payload: id });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete recording' };
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  return (
    <RecordingContext.Provider
      value={{
        ...state,
        fetchRecordings,
        createRecording,
        updateRecording,
        deleteRecording
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecordings = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error('useRecordings must be used within a RecordingProvider');
  }
  return context;
};
