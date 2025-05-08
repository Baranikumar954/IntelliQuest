// src/App.js
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { About } from './Pages/About';
import { Question } from './Pages/Question';
import { Contact } from './Pages/Contact';
import { MissingPage } from './Pages/MissingPage';
import { Analyser } from './Pages/Analyser';
import { Response } from './Pages/Response';
import { Login } from './Pages/Login';
import { AnalyseResponse } from './Pages/AnalyseResponse';
import { DataProvider } from './Context/DataProvider';
import { PrivateRoute } from './Components/PrivateRoute';


// ✅ Supabase Auth imports
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './Api/supabaseClient'; // Ensure this file exists and exports the supabase client
import { Feedbacks } from './Pages/Feedbacks';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <DataProvider>
        <div className="App">
          <Routes>
            {/* ✅ Public Login Route */}
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/question"
              element={
                <PrivateRoute>
                  <Question />
                </PrivateRoute>
              }
            />
            <Route
              path="/response"
              element={
                <PrivateRoute>
                  <Response />
                </PrivateRoute>
              }
            />
            <Route
              path='/feedbacks'
              element={
                <PrivateRoute>
                    <Feedbacks/>
                </PrivateRoute>
              }
            />
            <Route
              path="/analyser"
              element={
                <PrivateRoute>
                  <Analyser />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/analyserResponse"
              element={
                <PrivateRoute>
                  <AnalyseResponse />
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }
            />
            {/* Fallback Route */}
            <Route path="*" element={<MissingPage />} />
          </Routes>
        </div>
      </DataProvider>
    </SessionContextProvider>
  );
}

export default App;
