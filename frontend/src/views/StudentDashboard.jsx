import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, BookOpen, CheckSquare, BarChart3, LogOut, FileText, Clock, Play } from 'lucide-react';

const StudentDashboard = () => {
  const { 
    user, 
    logout, 
    upcomingTests, 
    charanCompletedTests, 
    studentStats 
  } = useApp();
  
  const navigate = useNavigate();

  // Active view below metrics (upcoming, completed, performance)
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "A new test 'Python Basics' has been published.", unread: true },
    { id: 2, text: "Your score for 'HTML & CSS' is updated.", unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="min-h-screen flex bg-[#cebfe2] font-sans antialiased animate-fade-in">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-72 bg-white flex flex-col justify-between border-r border-gray-150 py-8 px-6 shrink-0 shadow-lg">
        
        {/* Top Logo Section */}
        <div>
          <div className="flex items-center gap-3 mb-10 pl-2 select-none">
            {/* Logo Stack (Symbol + SHAI) */}
            <div className="flex flex-col items-center shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Pink shape (Top/Left) */}
                <path d="M 76 44 A 24 24 0 0 1 124 44 L 124 100 A 24 24 0 0 1 100 124 L 44 124 A 24 24 0 0 1 44 76 L 76 76 Z" fill="#e9386d" />
                {/* Purple shape (Bottom/Right) */}
                <path d="M 124 156 A 24 24 0 0 1 76 156 L 76 100 A 24 24 0 0 1 100 76 L 156 76 A 24 24 0 0 1 156 124 L 124 124 Z" fill="#5e328c" />
                {/* Overlap shape (Dark Lens) */}
                <path d="M 76 124 L 76 100 A 24 24 0 0 1 100 76 L 124 76 L 124 124 Z" fill="#27142b" />
                {/* TM */}
                <text x="148" y="36" fill="#7a7a7a" fontSize="18" fontFamily="sans-serif" fontWeight="bold">TM</text>
              </svg>
              <div className="flex items-start mt-0.5 relative">
                <span className="font-display font-black text-xs text-gray-800 tracking-tight leading-none select-none">SHAI</span>
                <span className="text-[5px] font-bold text-gray-500 ml-0.5 select-none -mt-0.5">TM</span>
              </div>
            </div>
            {/* OneTest Text */}
            <span className="font-display font-extrabold text-2xl text-gray-800 tracking-tight leading-none mt-1">OneTest</span>
          </div>
        </div>

        {/* Middle: Motivational Card */}
        <div className="my-auto">
          <div className="bg-gradient-to-br from-[#f3f0fc] to-[#e8e2f8] rounded-3xl p-6 shadow-sm border border-purple-100 flex flex-col relative overflow-hidden">
            {/* Quote icon */}
            <span className="text-[#a57fc9] text-5xl font-serif leading-none select-none absolute -top-1 left-3 opacity-30">“</span>
            
            <div className="relative z-10">
              <p className="text-[#402068] font-bold text-base leading-snug mb-2 font-display pr-2">
                Consistency today, success tomorrow.
              </p>
              <p className="text-gray-500 font-medium text-xs leading-relaxed mb-6">
                Keep learning, keep growing.
              </p>
            </div>

            {/* Plant Sprout Growing SVG Graphic */}
            <div className="flex justify-center mt-2 relative">
              <svg className="w-28 h-28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dirt Mound */}
                <path d="M20 100 C30 92, 90 92, 100 100" stroke="#b4a3d7" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M30 99 C45 94, 75 94, 90 99" stroke="#927fc0" strokeWidth="2" strokeLinecap="round" />
                
                {/* Stem */}
                <path d="M60 97 Q58 60, 68 45" stroke="#9a7fdb" strokeWidth="5" strokeLinecap="round" fill="none" />
                
                {/* Main Branch Leaves */}
                {/* Left Leaf */}
                <path d="M59 75 C45 70, 36 78, 48 83 C54 85, 59 80, 59 75 Z" fill="#b3a2ec" stroke="#9a7fdb" strokeWidth="2" />
                {/* Right Leaf */}
                <path d="M61 62 C75 58, 84 66, 72 71 C66 73, 61 68, 61 62 Z" fill="#b3a2ec" stroke="#9a7fdb" strokeWidth="2" />
                {/* Top Leaf */}
                <path d="M68 45 C65 30, 53 34, 60 41 C64 45, 66 45, 68 45 Z" fill="#a085eb" stroke="#8769dc" strokeWidth="2" />

                {/* Stars/Sparkles */}
                <path d="M25 60 L27 64 L31 65 L27 66 L25 70 L23 66 L19 65 L23 64 Z" fill="#bfaee8" opacity="0.8" />
                <path d="M95 45 L96.5 48 L100 48.5 L96.5 49 L95 52 L93.5 49 L90 48.5 L93.5 48 Z" fill="#bfaee8" opacity="0.8" />
                <path d="M80 80 L81 82 L83.5 82.5 L81 83 L80 85 L79 83 L76.5 82.5 L79 82 Z" fill="#9a7fdb" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Logout */}
        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all font-semibold cursor-pointer group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN HEADER & CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="h-20 bg-[#e54e73] flex items-center justify-between px-10 shadow-md shrink-0 z-20">
          <h1 className="font-display font-extrabold text-2xl text-white tracking-wide">
            Dashboard
          </h1>
          
          <div className="flex items-center gap-6 relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer relative text-white"
              >
                <Bell className="w-6 h-6" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-300 rounded-full ring-2 ring-[#e54e73]"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-30 animate-fade-in">
                  <h4 className="font-semibold text-sm px-4 py-2 border-b border-gray-100 text-gray-800">Notifications</h4>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-b-0 text-xs text-gray-700 flex items-start justify-between gap-2 hover:bg-gray-50 transition-colors`}>
                        <span>{n.text}</span>
                        {n.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-1"></span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-white/10 hover:bg-white/25 rounded-2xl transition-all cursor-pointer text-white border border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 text-[#e54e73] font-display font-extrabold text-sm flex items-center justify-center border border-white/20 shadow-inner">
                  {user?.name?.[0]}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-sm tracking-wide leading-tight">{user?.name}</span>
                  <span className="text-[10px] text-pink-100 font-medium leading-none">{user?.title}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-pink-100 ml-1" />
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 animate-fade-in">
                  <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100 font-bold uppercase tracking-wider">User Options</div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-10 flex flex-col gap-8">
          
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl px-8 py-5 shadow-md border border-purple-100/30 flex items-center shrink-0">
            <h2 className="font-display font-bold text-2xl text-[#361a58] tracking-wide select-none">
              Welcome Back, {user?.name}!
            </h2>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-3 gap-8">
            
            {/* Card 1: Upcoming Tests */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100/20 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-purple-700" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-3">Upcoming Tests</h3>
              <span className="font-display font-extrabold text-5xl text-[#28c76f] mb-3 leading-none select-none">
                {studentStats.upcomingCount}
              </span>
              <p className="text-gray-400 font-medium text-xs font-serif leading-none mb-6">
                You have {studentStats.upcomingCount} tests to attempt
              </p>
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`py-2 px-6 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'upcoming' 
                    ? 'bg-[#e54e73] text-white shadow-md shadow-pink-100' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                View Details
              </button>
            </div>

            {/* Card 2: Completed Tests */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100/20 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                <CheckSquare className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-3">Completed Tests</h3>
              <span className="font-display font-extrabold text-5xl text-[#28c76f] mb-3 leading-none select-none">
                {studentStats.completedCount}
              </span>
              <p className="text-gray-400 font-medium text-xs font-serif leading-none mb-6">
                You Completed {studentStats.completedCount} Tests
              </p>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`py-2 px-6 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'completed' 
                    ? 'bg-[#e54e73] text-white shadow-md shadow-pink-100' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                View Details
              </button>
            </div>

            {/* Card 3: Results */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100/20 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-3">Results</h3>
              <span className="font-display font-extrabold text-5xl text-[#28c76f] mb-3 leading-none select-none">
                {studentStats.resultsCount}
              </span>
              <p className="text-gray-400 font-medium text-xs font-serif leading-none mb-6">
                View Your Performance
              </p>
              <button 
                onClick={() => setActiveTab('results')}
                className={`py-2 px-6 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'results' 
                    ? 'bg-[#e54e73] text-white shadow-md shadow-pink-100' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                View Details
              </button>
            </div>

          </div>

          {/* 3. DETAILS CONTAINER */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 overflow-hidden flex flex-col">
            
            {/* Header info for selected detail tab */}
            <div className="border-b border-gray-100 pb-5 mb-6 flex justify-between items-center">
              <h3 className="font-display font-extrabold text-xl text-gray-800">
                {activeTab === 'upcoming' && 'Available / Upcoming Tests'}
                {activeTab === 'completed' && 'Completed Tests History'}
                {activeTab === 'results' && 'Your Performance Summary'}
              </h3>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 py-1 px-3 rounded-full">
                {activeTab === 'upcoming' && `${upcomingTests.length} tests active`}
                {activeTab === 'completed' && `${charanCompletedTests.length} completed recently`}
                {activeTab === 'results' && 'Grade Metrics'}
              </span>
            </div>

            {/* Tab content displays */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Upcoming Tests Listing */}
              {activeTab === 'upcoming' && (
                upcomingTests.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                    <CheckSquare className="w-12 h-12 text-green-500 mb-2 opacity-70" />
                    <p className="font-bold text-gray-800">All caught up!</p>
                    <p className="text-xs text-gray-400">You have completed all active tests. Check back later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingTests.map(test => (
                      <div key={test.id} className="bg-gray-50 border border-gray-100 hover:border-purple-200 rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h4 className="font-display font-bold text-lg text-[#402068]">{test.title}</h4>
                            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 py-1 px-2.5 rounded-full shrink-0">
                              {test.duration} mins
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{test.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold">
                            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {test.totalQuestions} Questions</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.createdOn}</span>
                          </div>
                          <button 
                            onClick={() => handleStartTest(test.id)}
                            className="flex items-center gap-1.5 py-2 px-4 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Start Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Completed Tests List */}
              {activeTab === 'completed' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase bg-gray-50/50">
                        <th className="py-3 px-4 rounded-l-xl">Test Name</th>
                        <th className="py-3 px-4">Completed On</th>
                        <th className="py-3 px-4">Questions</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4 rounded-r-xl">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      
                      {/* Active session completed tests */}
                      {charanCompletedTests.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50/70 transition-colors text-xs text-gray-700">
                          <td className="py-3 px-4 font-bold text-gray-800">{c.title}</td>
                          <td className="py-3 px-4 text-gray-400 font-medium">{c.completedOn}</td>
                          <td className="py-3 px-4 font-semibold">{c.totalQs}</td>
                          <td className="py-3 px-4 font-bold text-purple-700">{c.score} / {c.totalQs}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block py-1 px-3.5 rounded-full font-bold text-[10px] ${
                              c.percentage >= 80 ? 'bg-green-50 text-green-700' :
                              c.percentage >= 60 ? 'bg-blue-50 text-blue-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {c.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Historical mock tests for counts */}
                      {[...Array(10)].map((_, i) => (
                        <tr key={`hist-${i}`} className="hover:bg-gray-50/70 transition-colors text-xs text-gray-400">
                          <td className="py-3 px-4 font-semibold text-gray-600">Mock Historical Assessment #{10 - i}</td>
                          <td className="py-3 px-4">Apr - May 2024</td>
                          <td className="py-3 px-4">25</td>
                          <td className="py-3 px-4">21 / 25</td>
                          <td className="py-3 px-4">
                            <span className="inline-block py-1 px-3.5 rounded-full font-bold text-[10px] bg-green-50/50 text-green-600">
                              84%
                            </span>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}

              {/* Performance Analysis Graph / Stats */}
              {activeTab === 'results' && (
                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                  <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-gray-800 mb-2">Performance Metrics</h4>
                      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                        A quick review of your percentage distribution across your attempts. Aim for above 80% to achieve Excellent status.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Average Score</span>
                        <span className="text-2xl font-extrabold text-purple-700 mt-1">82.5%</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-100 flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total Correct</span>
                        <span className="text-2xl font-extrabold text-green-600 mt-1">68 / 80</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Score progression visual chart using simple bar graph style */}
                  <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col">
                    <h4 className="font-display font-bold text-base text-gray-800 mb-4">Latest Tests Breakdown</h4>
                    <div className="flex-1 flex flex-col justify-center gap-3">
                      {charanCompletedTests.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1">
                            <span>{item.title}</span>
                            <span>{item.score}/{item.totalQs} ({item.percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.percentage >= 80 ? 'bg-green-500' :
                                item.percentage >= 60 ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`} 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      {charanCompletedTests.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-6">No active test attempts yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;
