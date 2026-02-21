import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  // Grouping form state into a single object
 const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');

  // A single handler for all inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Clear previous errors
    setError('');
    
    try {

      const response = await fetch('https://dashboard-backend-2-a1qg.onrender.com/signup', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // We exclude confirmPassword since the backend doesn't need it
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // If the backend sends an error status (like 400 or 500)
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong during registration');
      }

      // Success!
      toast.success('Account created successfully!');
      navigate('/dashboard');
      
      // TODO: Redirect the user to the login page or dashboard here

    } catch (err) {
      console.error('Fetch error:', err);
      // Display the error message from the backend to the user
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full px-4 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Sign Up
        </button>

        {/* Login Link Section */}
        <div className="pt-4 text-sm text-center text-gray-600 border-t border-gray-200">
          Already have an account?{' '}
          <Link 
            to="/" 
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;