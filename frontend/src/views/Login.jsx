import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    const lowerUser = username.toLowerCase().trim();
    if (lowerUser === 'student' || lowerUser === 'charan') {
      login('student');
      navigate('/dashboard');
    } else if (lowerUser === 'creator' || lowerUser === 'admin' || lowerUser === 'teacher') {
      login('creator');
      navigate('/creator');
    } else {
      // Default to student for testing convenience, or show error
      setError("Unknown user. Use 'charan' for Student, 'creator' for Course Creator.");
    }
  };

  const handleQuickLogin = (role) => {
    login(role);
    if (role === 'student') {
      navigate('/dashboard');
    } else {
      navigate('/creator');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#a280cc] p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white rounded-[2.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.18)] px-10 py-12 flex flex-col items-center border border-purple-100/50">
        
        {/* SHAI Clover Logo */}
        <div className="flex flex-col items-center mb-4 select-none shrink-0 w-full">
          {/* Symbol */}
          <svg className="w-24 h-24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Pink shape (Top/Left) */}
            <path d="M 76 44 A 24 24 0 0 1 124 44 L 124 100 A 24 24 0 0 1 100 124 L 44 124 A 24 24 0 0 1 44 76 L 76 76 Z" fill="#e9386d" />
            {/* Purple shape (Bottom/Right) */}
            <path d="M 124 156 A 24 24 0 0 1 76 156 L 76 100 A 24 24 0 0 1 100 76 L 156 76 A 24 24 0 0 1 156 124 L 124 124 Z" fill="#5e328c" />
            {/* Overlap shape (Dark Lens) */}
            <path d="M 76 124 L 76 100 A 24 24 0 0 1 100 76 L 124 76 L 124 124 Z" fill="#27142b" />
            {/* TM */}
            <text x="148" y="36" fill="#7a7a7a" fontSize="18" fontFamily="sans-serif" fontWeight="bold">TM</text>
          </svg>
          {/* Wordmark below */}
          <div className="flex items-start justify-center mt-1 relative">
            <span className="font-display font-black text-3xl text-gray-800 tracking-tight select-none">SHAI</span>
            <span className="text-[8px] font-bold text-gray-500 ml-0.5 mt-1 select-none">TM</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display font-semibold text-2xl text-[#4a2e80] tracking-wider mb-8">LOGIN</h2>

        {/* Error Alert */}
        {error && (
          <div className="w-full bg-red-50 text-red-600 text-xs py-2 px-4 rounded-xl mb-4 text-center border border-red-100 animate-fade-in">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-5">
          <div className="w-full">
            <input 
              type="text" 
              placeholder="username" 
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full py-3.5 px-6 rounded-full border-[2.5px] border-[#e54e73] text-center text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all font-medium text-sm shadow-sm"
            />
          </div>

          <div className="w-full">
            <input 
              type="password" 
              placeholder="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full py-3.5 px-6 rounded-full border-[2.5px] border-[#e54e73] text-center text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all font-medium text-sm shadow-sm"
            />
          </div>

          <button 
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs font-semibold text-[#4a2e80] hover:underline hover:text-purple-900 transition-colors mt-1 mb-2 self-center cursor-pointer"
          >
            Forgot password?
          </button>

          <button 
            type="submit"
            className="w-full py-4 bg-[#e54e73] hover:bg-[#d03b60] active:bg-[#b82d51] text-white rounded-full font-semibold text-base transition-all duration-150 cursor-pointer shadow-md shadow-pink-200/50 hover:shadow-lg focus:outline-none"
          >
            Sign in
          </button>
        </form>

        {/* Quick Logins (Demo helpers) */}
        <div className="w-full mt-10 border-t border-gray-100 pt-6">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 text-center mb-3">Quick Login (For Demo)</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleQuickLogin('student')}
              className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl text-[11px] font-semibold text-purple-700 transition-colors cursor-pointer text-center"
            >
              🔑 Charan (Employee)
            </button>
            <button 
              onClick={() => handleQuickLogin('creator')}
              className="py-2.5 px-3 bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-xl text-[11px] font-semibold text-pink-700 transition-colors cursor-pointer text-center"
            >
              🔑 Charan (Creator)
            </button>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">Password Recovery</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              For security, this application is connected to the SSO system. Please contact your administrator or use the corporate portal to reset your password.
            </p>
            <div className="flex flex-col gap-2">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-purple-800 font-medium">
                💡 Try typing <span className="font-bold underline">charan</span> as username and any password to sign in as Employee!
              </div>
              <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-xs text-pink-800 font-medium mt-1">
                💡 Try typing <span className="font-bold underline">creator</span> as username to sign in as Course Creator!
              </div>
            </div>
            <button 
              onClick={() => setShowForgotModal(false)}
              className="w-full mt-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
