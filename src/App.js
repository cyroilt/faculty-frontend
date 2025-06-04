import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecordingProvider } from './context/RecordingContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import RecordingsPage from './pages/RecordingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel';
import CreateRecording from './pages/CreateRecording';
import EditRecording from './pages/EditRecording';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <RecordingProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recordings" element={<RecordingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-recording" 
                  element={
                    <ProtectedRoute adminOnly>
                      <CreateRecording />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-recording/:id" 
                  element={
                    <ProtectedRoute adminOnly>
                      <EditRecording />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
          </div>
        </Router>
      </RecordingProvider>
    </AuthProvider>
  );
}

export default App;
