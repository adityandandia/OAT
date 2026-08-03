import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, BookOpen, CheckSquare, BarChart3, LogOut, FileText, Clock, 
  Play, Home, ClipboardList, GraduationCap, ArrowRight, Award, CheckCircle2, 
  XCircle, RotateCcw, Eye, X, Sparkles, TrendingUp
} from 'lucide-react';

const StudentDashboard = () => {
  const { 
    user, 
    logout, 
    upcomingTests, 
    charanCompletedTests, 
    studentStats,
    tests
  } = useApp();
  
  const navigate = useNavigate();

  // Active Sidebar Menu: 'Home', 'Tests', 'Course', 'Reports'
  const [activeMenu, setActiveMenu] = useState('Home'); 
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modal state for viewing test report
  const [selectedReport, setSelectedReport] = useState(null);

  const [notifications] = useState([
    { id: 1, text: "A new test 'Python Basics' has been published.", unread: true },
    { id: 2, text: "Your score for 'HTML & CSS' is updated.", unread: false }
  ]);

  // Live Available Tests mock data
  const liveAvailableTests = [
    {
      id: 'react-redux-live',
      testId: 'react-fundamentals',
      title: 'React & Redux State Architecture',
      course: 'Full Stack Web Development 2026',
      totalQs: 20,
      durationMinutes: 30,
      validUntil: 'Today at 11:59 PM',
      status: 'Live'
    },
    {
      id: 'python-ds-live',
      testId: 'js-basics',
      title: 'Python for Data Science & AI',
      course: 'Data Science & Backend Systems',
      totalQs: 25,
      durationMinutes: 45,
      validUntil: 'Tomorrow at 06:00 PM',
      status: 'Live'
    }
  ];

  // Courses mock data
  const enrolledCourses = [
    {
      id: 'course-1',
      title: 'Full Stack Web Development 2026',
      instructor: 'Dr. Ramesh Kumar',
      completedModules: 12,
      totalModules: 16,
      progressPct: 75,
      category: 'Web Engineering',
      nextLesson: 'Redux Toolkit Async Thunks'
    },
    {
      id: 'course-2',
      title: 'Data Science & Backend Systems',
      instructor: 'Prof. Ananya Sen',
      completedModules: 5,
      totalModules: 11,
      progressPct: 45,
      category: 'Data & Backend',
      nextLesson: 'PostgreSQL Query Optimization'
    },
    {
      id: 'course-3',
      title: 'UI/UX Design Systems & Tailwind',
      instructor: 'Vikramaditya Roy',
      completedModules: 9,
      totalModules: 10,
      progressPct: 90,
      category: 'Design Systems',
      nextLesson: 'Figma Component Tokens'
    }
  ];

  // Attended Tests History & Report Data
  const attendedTestsHistory = [
    {
      id: 'att-1',
      testId: 'html-css',
      testName: 'HTML & CSS Design System',
      attemptedOn: '02 Aug 2026, 14:30',
      highestPercentage: 95,
      lastScore: '19/20',
      attemptsTaken: 3,
      attemptsMax: 5,
      attemptsLeft: 2,
      status: 'Passed',
      timeSpent: '18 mins',
      correctQs: 19,
      wrongQs: 1,
      accuracy: '95%'
    },
    {
      id: 'att-2',
      testId: 'js-basics',
      testName: 'JavaScript & Web Engineering',
      attemptedOn: '30 Jul 2026, 11:15',
      highestPercentage: 85,
      lastScore: '17/20',
      attemptsTaken: 2,
      attemptsMax: 5,
      attemptsLeft: 3,
      status: 'Passed',
      timeSpent: '24 mins',
      correctQs: 17,
      wrongQs: 3,
      accuracy: '85%'
    },
    {
      id: 'att-3',
      testId: 'react-fundamentals',
      testName: 'React Fundamentals & Architecture',
      attemptedOn: '25 Jul 2026, 16:45',
      highestPercentage: 90,
      lastScore: '18/20',
      attemptsTaken: 4,
      attemptsMax: 5,
      attemptsLeft: 1,
      status: 'Passed',
      timeSpent: '32 mins',
      correctQs: 18,
      wrongQs: 2,
      accuracy: '90%'
    },
    {
      id: 'att-4',
      testId: 'sql-db-test',
      testName: 'Database Systems & SQL Optimization',
      attemptedOn: '18 Jul 2026, 09:20',
      highestPercentage: 78,
      lastScore: '15/20',
      attemptsTaken: 1,
      attemptsMax: 5,
      attemptsLeft: 4,
      status: 'Passed',
      timeSpent: '28 mins',
      correctQs: 15,
      wrongQs: 5,
      accuracy: '78%'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="min-h-screen flex bg-[#cebfe2] font-sans antialiased animate-fade-in relative">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-72 bg-white flex flex-col justify-between border-r border-gray-150 py-8 px-6 shrink-0 shadow-lg">
        
        {/* Top Logo Section */}
        <div>
          <div className="flex items-center gap-3 mb-8 pl-2 select-none">
            <div className="flex flex-col items-center shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 76 44 A 24 24 0 0 1 124 44 L 124 100 A 24 24 0 0 1 100 124 L 44 124 A 24 24 0 0 1 44 76 L 76 76 Z" fill="#e9386d" />
                <path d="M 124 156 A 24 24 0 0 1 76 156 L 76 100 A 24 24 0 0 1 100 76 L 156 76 A 24 24 0 0 1 156 124 L 124 124 Z" fill="#5e328c" />
                <path d="M 76 124 L 76 100 A 24 24 0 0 1 100 76 L 124 76 L 124 124 Z" fill="#27142b" />
                <text x="148" y="36" fill="#7a7a7a" fontSize="18" fontFamily="sans-serif" fontWeight="bold">TM</text>
              </svg>
              <div className="flex items-start mt-0.5 relative">
                <span className="font-display font-black text-xs text-gray-800 tracking-tight leading-none select-none">SHAI</span>
                <span className="text-[5px] font-bold text-gray-500 ml-0.5 select-none -mt-0.5">TM</span>
              </div>
            </div>
            <span className="font-display font-extrabold text-2xl text-gray-800 tracking-tight leading-none mt-1">OneTest</span>
          </div>

          {/* Sidebar Navigation Links - 4 Required Options */}
          <nav className="flex flex-col gap-2 mt-6">
            {[
              { id: 'Home', label: 'Home', icon: Home },
              { id: 'Tests', label: 'Tests', icon: ClipboardList },
              { id: 'Course', label: 'Course', icon: BookOpen },
              { id: 'Reports', label: 'Reports', icon: BarChart3 }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id || (activeMenu === 'Dashboard' && item.id === 'Home');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-4 py-3.5 px-4 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-purple-50 text-[#5e328c] shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#5e328c]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Motivational Quote Card */}
        <div className="mt-auto pt-6">
          <div className="bg-gradient-to-br from-[#f3f0fc] to-[#e8e2f8] rounded-3xl p-5 shadow-sm border border-purple-100 flex flex-col relative overflow-hidden">
            <span className="text-[#a57fc9] text-4xl font-serif leading-none select-none absolute -top-1 left-2 opacity-30">“</span>
            <div className="relative z-10">
              <p className="text-[#402068] font-bold text-xs leading-snug mb-1 font-display pr-2">
                Consistency today, success tomorrow.
              </p>
              <p className="text-gray-500 font-medium text-[10px] leading-relaxed">
                Keep learning, keep growing.
              </p>
            </div>

            <div className="flex justify-center mt-2 relative">
              <svg className="w-20 h-20" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 100 C30 92, 90 92, 100 100" stroke="#b4a3d7" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M60 97 Q58 60, 68 45" stroke="#9a7fdb" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M59 75 C45 70, 36 78, 48 83 C54 85, 59 80, 59 75 Z" fill="#b3a2ec" stroke="#9a7fdb" strokeWidth="1.5" />
                <path d="M61 62 C75 58, 84 66, 72 71 C66 73, 61 68, 61 62 Z" fill="#b3a2ec" stroke="#9a7fdb" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

      </aside>

      {/* 2. MAIN HEADER & CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="h-20 bg-[#e54e73] flex items-center justify-between px-10 shadow-md shrink-0 z-20">
          <h1 className="font-display font-extrabold text-2xl text-white tracking-wide">
            {activeMenu === 'Home' ? 'Dashboard' : activeMenu}
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
                      <div key={n.id} className="px-4 py-3 border-b border-gray-50 last:border-b-0 text-xs text-gray-700 flex items-start justify-between gap-2 hover:bg-gray-50 transition-colors">
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
                  {user?.name?.[0] || 'C'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-sm tracking-wide leading-tight">{user?.name || 'Charan'}</span>
                  <span className="text-[10px] text-pink-100 font-medium leading-none">{user?.title || 'Employee'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-pink-100 ml-1" />
              </button>

              {/* Profile Dropdown (Only Place for Logout) */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 animate-fade-in">
                  <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100 font-bold uppercase tracking-wider">User Options</div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-8 flex flex-col gap-8">
          
          {/* VIEW 1: HOME / MAIN DASHBOARD (50/50 HORIZONTAL DIVISION) */}
          {(activeMenu === 'Home' || activeMenu === 'Dashboard') && (
            <>
              {/* Welcome Greeting Banner */}
              <div className="bg-white rounded-2xl px-8 py-4 shadow-md border border-purple-100/30 flex items-center justify-between shrink-0">
                <h2 className="font-display font-bold text-2xl text-[#361a58] tracking-wide select-none">
                  Welcome Back, {user?.name || 'Charan'}! 👋
                </h2>
                <span className="text-xs font-semibold text-[#5e328c] bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100">
                  Active Student Portal
                </span>
              </div>

              {/* UPPER HALF: 2 EQUAL HORIZONTAL CARDS (Live Tests & Enrolled Courses) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                
                {/* Upper Card 1: Live Tests */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-purple-100/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#e54e73]">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-gray-800">Live Tests</h3>
                          <p className="text-xs text-gray-400 font-medium">Active assessments open for attempt</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                        {liveAvailableTests.length} Live Now
                      </span>
                    </div>

                    {/* Live Test List */}
                    <div className="flex flex-col gap-4">
                      {liveAvailableTests.map(test => (
                        <div key={test.id} className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100/50 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-[#402068]">{test.title}</h4>
                              <p className="text-[11px] text-gray-500 mt-0.5">{test.course}</p>
                            </div>
                            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                              {test.durationMinutes} mins
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-600 font-medium bg-white/70 p-2.5 rounded-xl border border-purple-100/40">
                            <span className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                              <FileText className="w-3.5 h-3.5 text-purple-600" />
                              {test.totalQs} Questions
                            </span>
                            <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#e54e73]" />
                              Attempt before: <span className="text-[#e54e73] font-extrabold">{test.validUntil}</span>
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Single Attempt Session</span>
                            <button 
                              onClick={() => handleStartTest(test.testId)}
                              className="py-1.5 px-5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              Start Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upper Card 2: Enrolled Courses */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-purple-100/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-[#5e328c]">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-gray-800">My Courses</h3>
                          <p className="text-xs text-gray-400 font-medium">Active courses & learning progress</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                        {enrolledCourses.length} Courses
                      </span>
                    </div>

                    {/* Courses List */}
                    <div className="flex flex-col gap-3">
                      {enrolledCourses.map(course => (
                        <div key={course.id} className="bg-gray-50 hover:bg-purple-50/30 rounded-2xl p-3.5 border border-gray-100 transition-all flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-xs text-gray-800 truncate">{course.title}</h4>
                              <span className="text-[9px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md shrink-0">
                                {course.category}
                              </span>
                            </div>
                            
                            {/* Course Progress */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-[#5e328c] h-1.5 rounded-full" 
                                  style={{ width: `${course.progressPct}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-extrabold text-purple-900 shrink-0">
                                {course.completedModules}/{course.totalModules} modules ({course.progressPct}%)
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => setActiveMenu('Course')}
                            className="p-2 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors shrink-0 cursor-pointer"
                            title="Continue Course"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* LOWER HALF: TABULAR FORMAT FOR ATTENDED TESTS & REPORTS */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-purple-100/30 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-gray-800">Attended Tests History</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Comprehensive history of completed tests, highest percentage scores, attempt metrics, and individual reports.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                    {attendedTestsHistory.length} Attended Tests
                  </span>
                </div>

                {/* Table Format */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-extrabold text-gray-400 uppercase bg-gray-50/70">
                        <th className="py-3.5 px-4 rounded-l-xl">Test Name</th>
                        <th className="py-3.5 px-4">Attempted Date</th>
                        <th className="py-3.5 px-4 text-center">Highest Percentage</th>
                        <th className="py-3.5 px-4 text-center">Attempts Taken</th>
                        <th className="py-3.5 px-4 text-center">Attempts Left</th>
                        <th className="py-3.5 px-4 text-center rounded-r-xl">Action / Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs text-gray-700 font-medium">
                      {attendedTestsHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-purple-50/40 transition-colors">
                          {/* 1. Test Name */}
                          <td className="py-3.5 px-4 font-bold text-gray-800">
                            <div className="flex flex-col">
                              <span className="text-sm text-[#402068]">{item.testName}</span>
                              <span className="text-[10px] text-gray-400 font-normal">Last Score: {item.lastScore} ({item.accuracy})</span>
                            </div>
                          </td>

                          {/* 2. When Attempted */}
                          <td className="py-3.5 px-4 text-gray-500 font-semibold">{item.attemptedOn}</td>

                          {/* 3. Highest Percentage */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block py-1 px-3.5 rounded-full font-extrabold text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {item.highestPercentage}%
                            </span>
                          </td>

                          {/* 4. Attempts Taken */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block py-1 px-3 rounded-full font-bold text-xs bg-purple-50 text-purple-800">
                              {item.attemptsTaken} {item.attemptsTaken === 1 ? 'Attempt' : 'Attempts'}
                            </span>
                          </td>

                          {/* 5. Attempts Left */}
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block py-1 px-3 rounded-full font-bold text-xs bg-amber-50 text-amber-700">
                              {item.attemptsLeft} Left
                            </span>
                          </td>

                          {/* 6. Action Column: Clicking takes to test report */}
                          <td className="py-3.5 px-4 text-center">
                            <button 
                              onClick={() => setSelectedReport(item)}
                              className="py-1.5 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* VIEW 2: TESTS PAGE */}
          {activeMenu === 'Tests' && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl text-gray-800">Available & Upcoming Tests</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Explore tests assigned to your curriculum or start new attempts.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map(test => (
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
                        className="flex items-center gap-1.5 py-2 px-5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Start Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: COURSE PAGE */}
          {activeMenu === 'Course' && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-display font-extrabold text-xl text-gray-800">Enrolled Courses & Curriculum</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Track modules, watch lecture recordings, and access study materials.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="bg-purple-50/40 border border-purple-100 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-3 py-1 rounded-full inline-block mb-3">
                        {course.category}
                      </span>
                      <h3 className="font-display font-bold text-lg text-gray-800 mb-1">{course.title}</h3>
                      <p className="text-xs text-gray-500 mb-4">Instructor: {course.instructor}</p>

                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Course Progress</span>
                          <span className="text-[#5e328c]">{course.progressPct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#5e328c] h-2 rounded-full" style={{ width: `${course.progressPct}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-2xl border border-gray-100 mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Up Next</span>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">{course.nextLesson}</p>
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer">
                      Continue Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: REPORTS PAGE */}
          {activeMenu === 'Reports' && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-display font-extrabold text-xl text-gray-800">Performance & Test Reports</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Click any test below to inspect full analytical feedback and score breakdown.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attendedTestsHistory.map(item => (
                  <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-base text-gray-800">{item.testName}</h3>
                        <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                          {item.highestPercentage}% Highest
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">Attempted: {item.attemptedOn} • {item.attemptsTaken} Attempts Taken</p>

                      <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-gray-100 mb-4 text-center">
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Score</span>
                          <span className="text-sm font-extrabold text-purple-700">{item.lastScore}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Time Spent</span>
                          <span className="text-sm font-extrabold text-gray-700">{item.timeSpent}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 uppercase font-bold block">Attempts Left</span>
                          <span className="text-sm font-extrabold text-amber-600">{item.attemptsLeft}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedReport(item)}
                      className="w-full py-2.5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Analysis Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* DETAILED TEST REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-purple-100 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedReport(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl text-gray-800">{selectedReport.testName}</h3>
                <p className="text-xs text-gray-400 font-semibold">Attempted on {selectedReport.attemptedOn}</p>
              </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Highest Score</span>
                <span className="text-xl font-black text-purple-800 block mt-0.5">{selectedReport.highestPercentage}%</span>
              </div>
              <div className="bg-green-50 p-3 rounded-2xl border border-green-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Correct Answers</span>
                <span className="text-xl font-black text-green-700 block mt-0.5">{selectedReport.correctQs} Qs</span>
              </div>
              <div className="bg-red-50 p-3 rounded-2xl border border-red-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Wrong Answers</span>
                <span className="text-xl font-black text-red-600 block mt-0.5">{selectedReport.wrongQs} Qs</span>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Attempts Left</span>
                <span className="text-xl font-black text-amber-700 block mt-0.5">{selectedReport.attemptsLeft} / {selectedReport.attemptsMax}</span>
              </div>
            </div>

            {/* Analysis & Feedback Box */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 flex flex-col gap-3">
              <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Performance Feedback & Key Insights
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Great job! You scored higher than 90% of peers in this assessment. You demonstrated strong proficiency in syntax, component state, and logic execution. Review wrong answer logs to push towards 100%.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-4 border-t border-gray-100 pt-4">
              <button 
                onClick={() => setSelectedReport(null)}
                className="py-2.5 px-6 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                Close Report
              </button>
              {selectedReport.attemptsLeft > 0 && (
                <button 
                  onClick={() => {
                    const tid = selectedReport.testId;
                    setSelectedReport(null);
                    handleStartTest(tid);
                  }}
                  className="py-2.5 px-6 rounded-full text-xs font-bold bg-[#e54e73] hover:bg-[#d03b60] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-pink-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  Re-attempt Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
