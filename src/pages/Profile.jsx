import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setFullName(user?.user_metadata?.full_name || '')
      setPhone(user?.user_metadata?.phone || '')
    } catch (error) {
      console.error('Error fetching user:', error)
      alert(error.message)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error.message)
        alert(error.message)
      } else {
        console.log('Logged out')
        navigate('/login')
      }
    } catch (error) {
      console.error('Logout error:', error.message)
      alert(error.message)
    }
  }

  const handleEditClick = () => {
    setEditing(true)
  }

  const handleCancelClick = () => {
    setEditing(false)
    setFullName(user?.user_metadata?.full_name || '')
    setPhone(user?.user_metadata?.phone || '')
  }

  const handleSaveClick = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
        },
      })

      if (error) {
        console.error('Error updating profile:', error)
        alert(error.message)
      } else {
        console.log('Profile updated:', data)
        alert('Profile updated successfully!')
        fetchUser() // Refresh user data
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error.message)
      alert(error.message)
    }
  }

  return (
    <div className="page">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl font-semibold mb-4">Profile</h1>

      {user && (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="w-full p-4">
              <div className="flex items-center">
                <div className="relative">
                  {user.user_metadata?.profile_photo ? (
                    <img className="w-24 h-24 rounded-full object-cover" src={user.user_metadata.profile_photo} alt="Profile" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                  )}
                </div>
                <div className="ml-4">
                  {editing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold">{user.user_metadata?.full_name}</h2>
                  )}
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700"><strong>ID:</strong> {user.id}</p>
                <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                {editing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                ) : (
                  <p className="text-gray-700"><strong>Phone:</strong> {user.user_metadata?.phone}</p>
                )}
                <p className="text-gray-700"><strong>Drivers License Photo:</strong> {user.user_metadata?.drivers_license_photo}</p>
                <p className="text-gray-700"><strong>Police Records Photo:</strong> {user.user_metadata?.police_records_photo}</p>
                <p className="text-gray-700"><strong>Criminal Records Photo:</strong> {user.user_metadata?.criminal_records_photo}</p>
                <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
              </div>
              <div className="mt-4">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveClick}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
