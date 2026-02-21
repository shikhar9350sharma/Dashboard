import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch current user data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/check', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setNewUsername(data.username); // Pre-fill the input box!
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle the PUT request to update the username
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch('http://localhost:3000/update-profile', {
        method: 'PUT', // 👈 PUT request for updating data!
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      toast.success('Username updated successfully!');
      // Update local state so the UI changes instantly
      setUserData({ ...userData, username: newUsername }); 
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <span className="text-xl font-semibold text-gray-600">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-500 hover:text-blue-700 font-semibold mb-6 flex items-center"
        >
          &larr; Back to Dashboard
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Edit Profile
        </h2>

        {/* Display Fixed Full Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
          <div className="text-lg font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
            {userData?.fullName}
          </div>
        </div>

        {/* Update Username Form */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isUpdating || newUsername === userData?.username}
            className="w-full px-4 py-2 text-white font-semibold bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Profile;