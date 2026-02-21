import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

 const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError('');
    setIsLoading(true); 
    
    try {
      const response = await fetch('https://dashboard-backend-2-a1qg.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong during login');
      }

      toast.success('Login successful! Welcome back.');
      navigate('/dashboard'); 

    } catch (err) {
      toast.error(err.message);
    } finally {
      // 👇 Stop loading spinner whether login failed or succeeded
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              {/* Forgot password moved up here for a cleaner layout */}
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
        </div>
        {/* Upgraded Submit Button */}
        <button 
          type="submit" 
          disabled={!email || !password || isLoading}
          className="flex items-center justify-center w-full px-4 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              {/* Tailwind Animated Loading Spinner */}
              <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* Divider and Register Section */}
        <div className="pt-4 text-sm text-center text-gray-600 border-t border-gray-200">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-colors"
          >
            Sign up now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;