import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, ShieldCheck, Sparkles, UserCheck, KeyRound } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  // Active Role Tab: 'employee' | 'creator' | 'admin'
  const [selectedRole, setSelectedRole] = useState('employee');
  const [username, setUsername] = useState('Charan');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Determine target role from toggle or input keywords
      const inputLower = username.toLowerCase().trim();
      let targetRole = selectedRole;

      if (inputLower === 'creator' || inputLower === 'teacher') {
        targetRole = 'creator';
      } else if (inputLower === 'admin') {
        targetRole = 'admin';
      }

      await login(username.trim(), password, targetRole);

      if (targetRole === 'admin') {
        navigate('/admin');
      } else if (targetRole === 'creator') {
        navigate('/creator');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setError('');

    try {
      let demoUser = 'charan';
      if (role === 'creator') demoUser = 'creator';
      if (role === 'admin') demoUser = 'admin';

      const displayName = role === 'creator' ? 'Charan (Course Creator)' : role === 'admin' ? 'Charan (Admin)' : 'Charan (Employee)';
      setUsername(displayName);
      setPassword('password123');

      await login(demoUser, 'password123', role);

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'creator') {
        navigate('/creator');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setError('');
    if (username === 'Charan' || username.startsWith('Charan (')) {
      if (role === 'admin') setUsername('Charan (Admin)');
      else if (role === 'creator') setUsername('Charan (Course Creator)');
      else setUsername('Charan (Employee)');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#a280cc] via-[#8c67be] to-[#5e328c] p-4 font-sans antialiased animate-fade-in relative overflow-hidden">
      
      {/* Subtle Background Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e9386d]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5e328c]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.22)] px-8 py-10 flex flex-col items-center border border-white/40 relative z-10">
        
        {/* SHAI Clover Logo */}
        <div className="flex flex-col items-center mb-3 select-none shrink-0 w-full">
          <svg className="w-20 h-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 76 44 A 24 24 0 0 1 124 44 L 124 100 A 24 24 0 0 1 100 124 L 44 124 A 24 24 0 0 1 44 76 L 76 76 Z" fill="#e9386d" />
            <path d="M 124 156 A 24 24 0 0 1 76 156 L 76 100 A 24 24 0 0 1 100 76 L 156 76 A 24 24 0 0 1 156 124 L 124 124 Z" fill="#5e328c" />
            <path d="M 76 124 L 76 100 A 24 24 0 0 1 100 76 L 124 76 L 124 124 Z" fill="#27142b" />
            <text x="148" y="36" fill="#7a7a7a" fontSize="18" fontFamily="sans-serif" fontWeight="bold">TM</text>
          </svg>
          
          <div className="flex items-start justify-center mt-1 relative">
            <span className="font-display font-black text-2xl text-gray-800 tracking-tight select-none">SHAI</span>
            <span className="text-[7px] font-bold text-gray-500 ml-0.5 mt-0.5 select-none">TM</span>
            <span className="font-display font-extrabold text-2xl text-gray-800 tracking-tight ml-1">OneTest</span>
          </div>
        </div>

        {/* 3 Role Selector Tabs: Employee, Admin, Course Creator */}
        <div className="w-full bg-gray-100 p-1.5 rounded-2xl grid grid-cols-3 gap-1 mb-6 border border-gray-200/60">
          <button 
            type="button"
            onClick={() => handleRoleTabChange('employee')}
            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedRole === 'employee'
                ? 'bg-white text-[#5e328c] shadow-md shadow-purple-100'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Employee
          </button>
          
          <button 
            type="button"
            onClick={() => handleRoleTabChange('admin')}
            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedRole === 'admin'
                ? 'bg-white text-[#5e328c] shadow-md shadow-purple-100'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Admin
          </button>

          <button 
            type="button"
            onClick={() => handleRoleTabChange('creator')}
            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedRole === 'creator'
                ? 'bg-white text-[#e54e73] shadow-md shadow-pink-100'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Course Creator
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full bg-red-50 text-red-600 text-xs py-2.5 px-4 rounded-2xl mb-4 text-center border border-red-100 animate-fade-in font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          
          {/* Username Field */}
          <div className="w-full relative">
            <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Username or Email" 
              value={username}
              disabled={isSubmitting}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              className="w-full py-3.5 pl-11 pr-4 rounded-2xl border-2 border-gray-200 focus:border-[#e54e73] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-semibold text-sm shadow-xs disabled:bg-gray-50"
            />
          </div>

          {/* Password Field */}
          <div className="w-full relative">
            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password" 
              value={password}
              disabled={isSubmitting}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full py-3.5 pl-11 pr-11 rounded-2xl border-2 border-gray-200 focus:border-[#e54e73] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all font-semibold text-sm shadow-xs disabled:bg-gray-50"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <button 
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs font-bold text-[#5e328c] hover:underline transition-colors mt-0.5 mb-1 self-end cursor-pointer"
          >
            Forgot password?
          </button>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#e54e73] hover:bg-[#d03b60] active:bg-[#b82d51] text-white rounded-2xl font-bold text-base transition-all duration-150 cursor-pointer shadow-md shadow-pink-200/70 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>
                  Sign In as {selectedRole === 'employee' ? 'Employee' : selectedRole === 'admin' ? 'Admin' : 'Course Creator'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Logins - 3 Options */}
        <div className="w-full mt-8 border-t border-gray-100 pt-5">
          <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 text-center mb-2.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" />
            1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={() => handleQuickLogin('employee')}
              className="py-2.5 px-2 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl text-[10px] font-extrabold text-purple-800 transition-colors cursor-pointer text-center flex flex-col items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>Employee</span>
            </button>
            
            <button 
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-2.5 px-2 bg-purple-100/70 hover:bg-purple-200 border border-purple-200 rounded-xl text-[10px] font-extrabold text-purple-900 transition-colors cursor-pointer text-center flex flex-col items-center justify-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-800" />
              <span>Admin</span>
            </button>

            <button 
              type="button"
              onClick={() => handleQuickLogin('creator')}
              className="py-2.5 px-3 bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-xl text-[10px] font-extrabold text-pink-800 transition-colors cursor-pointer text-center flex flex-col items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#e54e73]" />
              <span>Creator</span>
            </button>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display font-bold text-xl text-gray-800 mb-2">Password Assistance</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Select your role tab above (Employee, Admin, or Course Creator) and click Sign In, or use the 1-Click Demo Login buttons for instant testing.
            </p>
            <div className="flex flex-col gap-2">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-purple-800 font-medium">
                💡 Employee Portal: Select "Employee" and sign in.
              </div>
              <div className="bg-purple-100/60 p-3 rounded-xl border border-purple-200 text-xs text-purple-950 font-medium mt-1">
                💡 Admin Portal: Select "Admin" and sign in.
              </div>
              <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-xs text-pink-800 font-medium mt-1">
                💡 Course Creator Portal: Select "Course Creator" and sign in.
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full mt-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
