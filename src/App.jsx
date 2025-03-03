import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Vehicles from './pages/Vehicles'
import Activities from './pages/Activities'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Drivers from './pages/Drivers'
import Revenue from './pages/Revenue'
import Expenses from './pages/Expenses' // Added import for Expenses page
import { supabase } from '../supabaseClient'
import './index.css' // Import the CSS file

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true) // Add loading state
  const location = useLocation() // Get current location

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error('Error fetching session:', error)
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Store current path in localStorage
  useEffect(() => {
    localStorage.setItem('lastPath', location.pathname)
  }, [location])

  if (loading) {
    return <div>Loading...</div> // Or a spinner
  }

  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <ul className="flex justify-around">
          <li>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </li>
          {session ? (
            <>
              <li>
                <Link to="/profile" className="text-white hover:text-gray-300">Profile</Link>
              </li>
              <li>
                <Link to="/vehicles" className="text-white hover:text-gray-300">Vehicles</Link>
              </li>
              <li>
                <Link to="/drivers" className="text-white hover:text-gray-300">Drivers</Link>
              </li>
              <li>
                <Link to="/activities" className="text-white hover:text-gray-300">Activities</Link>
              </li>
              <li>
                <Link to="/revenue" className="text-white hover:text-gray-300">Revenue</Link>
              </li>
              <li>
                <Link to="/expenses" className="text-white hover:text-gray-300">Expenses</Link>
              </li> {/* Added Expenses link to navigation */}
              <li>
                <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
              </li>
              <li>
                <Link to="/settings" className="text-white hover:text-gray-300">Settings</Link>
              </li>
              <li>
                <Link to="/admin" className="text-white hover:text-gray-300">Admin</Link>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/vehicles" element={session ? <Vehicles /> : <Navigate to="/login" />} />
        {/* REMOVED: <Route path="/vehicles/:id" element={session ? <VehicleRecord /> : <Navigate to="/login" />} /> */}
        <Route path="/drivers" element={session ? <Drivers /> : <Navigate to="/login" />} />
        <Route path="/activities" element={session ? <Activities /> : <Navigate to="/login" />} />
        <Route path="/revenue" element={session ? <Revenue /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/settings" element={session ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/admin" element={session ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={session ? <Expenses /> : <Navigate to="/login" />} /> {/* Added route for Expenses page */}
      </Routes>
    </div>
  )
}

function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default Root
