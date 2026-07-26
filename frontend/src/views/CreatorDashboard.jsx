import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, List, LayoutDashboard, FileSpreadsheet, Users, 
  Settings as SettingsIcon, LogOut, Eye, Edit2, Trash2, Search, Plus, 
  Trash, X, Clock, HelpCircle, Check, FileText
} from 'lucide-react';

const CreatorDashboard = () => {
  const { 
    user, 
    logout, 
    tests, 
    createTest, 
    updateTest, 
    deleteTest, 
    studentResults, 
    getPerformanceDistribution 
  } = useApp();
  
  const navigate = useNavigate();

  // Navigation menu state
  const [activeMenu, setActiveMenu] = useState('Course Creator');

  // Search filter for Student Results
  const [searchStudent, setSearchStudent] = useState('');

  // Pagination states
  const [testPage, setTestPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const testsPerPage = 5;
  const studentsPerPage = 6;

  // Modals / Form Dialog States
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);
  
  // Test builder fields
  const [testTitle, setTestTitle] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [testDuration, setTestDuration] = useState('30');
  const [testQuestions, setTestQuestions] = useState([
    { text: 'Question 1', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 0 }
  ]);

  // Preview Test Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTest, setPreviewTest] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Open Form to Create Test
  const handleOpenCreate = () => {
    setIsEditing(false);
    setTestTitle('');
    setTestDesc('');
    setTestDuration('30');
    setTestQuestions([
      { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
    setShowFormModal(true);
  };

  // Open Form to Edit Test
  const handleOpenEdit = (test) => {
    setIsEditing(true);
    setActiveTestId(test.id);
    setTestTitle(test.title);
    setTestDesc(test.description);
    setTestDuration(test.duration.toString());
    setTestQuestions(test.questions.map(q => ({
      text: q.text,
      options: [...q.options],
      correctAnswer: q.correctAnswer
    })));
    setShowFormModal(true);
  };

  // Handle Save Test (Create or Update)
  const handleSaveTest = (e) => {
    e.preventDefault();
    if (!testTitle.trim()) return;

    // Filter out incomplete questions
    const cleanQuestions = testQuestions.filter(q => q.text.trim() !== '');
    if (cleanQuestions.length === 0) {
      alert("Please add at least one question with text.");
      return;
    }

    const testPayload = {
      title: testTitle,
      description: testDesc,
      duration: parseInt(testDuration) || 30,
      questions: cleanQuestions.map((q, idx) => ({
        id: `q-${idx}-${Date.now()}`,
        text: q.text,
        options: q.options.map(opt => opt.trim() || 'Choice Option'),
        correctAnswer: parseInt(q.correctAnswer) || 0
      }))
    };

    if (isEditing) {
      updateTest(activeTestId, testPayload);
    } else {
      createTest(testPayload);
    }
    setShowFormModal(false);
  };

  // Form question managers
  const handleAddQuestion = () => {
    setTestQuestions(prev => [
      ...prev,
      { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    setTestQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx, val) => {
    setTestQuestions(prev => prev.map((q, i) => i === idx ? { ...q, text: val } : q));
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    setTestQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        const nextOpts = [...q.options];
        nextOpts[optIdx] = val;
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const handleCorrectAnswerChange = (qIdx, val) => {
    setTestQuestions(prev => prev.map((q, i) => i === qIdx ? { ...q, correctAnswer: parseInt(val) } : q));
  };

  const handleOpenPreview = (test) => {
    setPreviewTest(test);
    setShowPreviewModal(true);
  };

  // Calculate dynamic data
  const dist = getPerformanceDistribution();

  // Search filtered students list
  const filteredStudents = studentResults.filter(student => 
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.status.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.testTitle.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Paginated lists
  const totalTestPages = Math.ceil(tests.length / testsPerPage);
  const paginatedTests = tests.slice((testPage - 1) * testsPerPage, testPage * testsPerPage);

  const totalStudentPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage);

  // SVG Donut Chart geometry calculation
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.159
  let accumulatedPercent = 0;

  return (
    <div className="min-h-screen flex bg-[#cebfe2] font-sans antialiased animate-fade-in">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-72 bg-white flex flex-col justify-between border-r border-gray-150 py-8 px-6 shrink-0 shadow-lg">
        
        {/* Top Logo */}
        <div>
          <div className="flex items-center gap-3 mb-8 pl-2 select-none">
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

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-6">
            {[
              { name: 'Course Creator', icon: List },
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Create Test', icon: Plus, action: handleOpenCreate },
              { name: 'All Tests', icon: FileText },
              { name: 'Cohort', icon: Users },
              { name: 'Results', icon: FileSpreadsheet },
              { name: 'Settings', icon: SettingsIcon }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveMenu(item.name);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 py-3 px-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-purple-50 text-purple-700 font-bold border-l-4 border-[#e54e73]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#e54e73]' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Motivational Card */}
        <div className="mt-6 mb-6">
          <div className="bg-[#fcfaff] rounded-3xl p-5 border border-purple-100/50 flex flex-col relative overflow-hidden">
            <span className="text-[#a57fc9] text-4xl font-serif absolute -top-1 left-2 opacity-25">“</span>
            <p className="text-[#402068] font-bold text-xs leading-snug mb-1 font-display relative z-10">
              Consistency today, success tomorrow.
            </p>
            <p className="text-gray-400 font-medium text-[10px] leading-tight mb-4">
              Keep learning, keep growing.
            </p>
            <div className="flex justify-center">
              <svg className="w-16 h-16" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 100 C30 92, 90 92, 100 100" stroke="#d5cde6" strokeWidth="4" fill="none" />
                <path d="M60 97 Q58 60, 68 45" stroke="#9a7fdb" strokeWidth="4" fill="none" />
                <path d="M59 75 C45 70, 36 78, 48 83 C54 85, 59 80, 59 75 Z" fill="#b3a2ec" stroke="#9a7fdb" strokeWidth="1.5" />
                <path d="M61 62 C75 58, 84 66, 72 71 C66 73, 61 68, 61 62 Z" fill="#b3a2ec" stroke="#9a7fdb" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom Logout */}
        <div className="pt-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all font-semibold cursor-pointer group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN HEADER & CANVAS */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="h-20 bg-[#e54e73] flex items-center justify-between px-10 shadow-md shrink-0 z-20">
          <h1 className="font-display font-extrabold text-2xl text-white tracking-wide">
            {activeMenu}
          </h1>
          
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-white relative">
              <Bell className="w-6 h-6" />
            </button>

            {/* Profile badge */}
            <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-white/10 rounded-2xl text-white border border-white/10">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-[#e54e73] font-display font-extrabold text-sm flex items-center justify-center shadow-inner">
                {user?.name?.[0]}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm tracking-wide leading-tight">{user?.name}</span>
                <span className="text-[10px] text-pink-100 font-medium leading-none">{user?.title}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-pink-100 ml-1" />
            </div>
          </div>
        </header>

        {/* Content canvas */}
        <div className="flex-1 p-10 flex flex-col gap-8">
          
          {/* Section 1: Manage Tests Table */}
          <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-extrabold text-xl text-gray-800">Manage Tests</h2>
              <button 
                onClick={handleOpenCreate}
                className="py-2.5 px-6 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-100 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create New Test
              </button>
            </div>

            {/* Tests list table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50/50">
                    <th className="py-3.5 px-4 rounded-l-xl">Test Title</th>
                    <th className="py-3.5 px-4 w-1/3">Description</th>
                    <th className="py-3.5 px-4 text-center">Total Questions</th>
                    <th className="py-3.5 px-4 text-center">Duration</th>
                    <th className="py-3.5 px-4 text-center">Created On</th>
                    <th className="py-3.5 px-4 text-center rounded-r-xl w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                  {paginatedTests.map(test => (
                    <tr key={test.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-800">{test.title}</td>
                      <td className="py-3.5 px-4 text-gray-400 leading-relaxed font-normal">{test.description}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{test.totalQuestions}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#e54e73]">{test.duration} mins</td>
                      <td className="py-3.5 px-4 text-center text-gray-400">{test.createdOn}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            onClick={() => handleOpenPreview(test)}
                            title="Preview Test"
                            className="p-1.5 hover:bg-purple-50 text-purple-600 hover:text-purple-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(test)}
                            title="Edit Test"
                            className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete test "${test.title}"?`)) deleteTest(test.id);
                            }}
                            title="Delete Test"
                            className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tests.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-400">No tests available. Click "Create New Test" to get started.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {tests.length > 0 && (
              <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
                <span className="text-[10px] text-gray-400 font-semibold select-none">
                  Showing {(testPage - 1) * testsPerPage + 1} to {Math.min(testPage * testsPerPage, tests.length)} of {tests.length} tests
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={testPage === 1}
                    onClick={() => setTestPage(prev => prev - 1)}
                    className="p-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-lg transition-colors cursor-pointer"
                  >
                    &lt;
                  </button>
                  {[...Array(totalTestPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestPage(i + 1)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        testPage === i + 1 
                          ? 'bg-purple-900 text-white shadow-xs' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={testPage === totalTestPages}
                    onClick={() => setTestPage(prev => prev + 1)}
                    className="p-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-lg transition-colors cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Two Column Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Widget 1: Test Overview & Donut Chart (5 Cols) */}
            <section className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6 self-stretch justify-between">
              <div>
                <h2 className="font-display font-extrabold text-xl text-gray-800 mb-6">Test overview</h2>
                
                {/* Stats badge grid */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                  <div className="bg-purple-50 p-2 px-3 rounded-xl border border-purple-100 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-purple-700">{dist.total}</span>
                    <span className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-wide leading-none mt-1">Total Students</span>
                  </div>
                  <div className="bg-green-50 p-2 px-3 rounded-xl border border-green-100 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-green-700">{dist.total - 4}</span>
                    <span className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-wide leading-none mt-1">Completed</span>
                  </div>
                  <div className="bg-blue-50 p-2 px-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-blue-700">4</span>
                    <span className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-wide leading-none mt-1">In Progress</span>
                  </div>
                  <div className="bg-red-50 p-2 px-3 rounded-xl border border-red-100 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-red-700">0</span>
                    <span className="text-[8px] font-bold text-gray-400 text-center uppercase tracking-wide leading-none mt-1">Not Attempted</span>
                  </div>
                </div>
              </div>

              {/* Performance Pie/Donut Chart Area */}
              <div className="flex flex-col gap-6 items-center">
                <h3 className="font-display font-bold text-xs text-gray-400 uppercase tracking-widest self-start -mb-2">Performance Summary</h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
                  {/* SVG Donut Chart */}
                  <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Outer backing circle */}
                      <circle 
                        cx="60" 
                        cy="60" 
                        r={radius} 
                        fill="transparent" 
                        stroke="#f3f4f6" 
                        strokeWidth={strokeWidth} 
                      />
                      
                      {/* Dynamic stacked arcs */}
                      {dist.categories.map((cat, idx) => {
                        const percent = (cat.count / dist.total) * 100;
                        const strokeDash = (percent / 100) * circumference;
                        const offset = circumference - strokeDash;
                        const dashOffset = circumference - (accumulatedPercent / 100) * circumference;
                        
                        accumulatedPercent += percent;

                        return (
                          <circle
                            key={idx}
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke={cat.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out hover:opacity-85"
                          />
                        );
                      })}
                    </svg>
                    {/* Inner centered text label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                      <span className="font-display font-extrabold text-2xl text-gray-800 leading-none">{dist.total}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Students</span>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {dist.categories.map((cat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                        <span>{cat.name.split(' ')[0]}</span>
                        <span className="text-gray-400 font-normal">({cat.count} attempts / {cat.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </section>

            {/* Widget 2: Student Results List (7 Cols) */}
            <section className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6 self-stretch">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-display font-extrabold text-xl text-gray-800">Student Results</h2>
                
                {/* Search field */}
                <div className="relative w-full sm:w-60">
                  <input 
                    type="text" 
                    placeholder="Search Student.." 
                    value={searchStudent}
                    onChange={(e) => { setSearchStudent(e.target.value); setStudentPage(1); }}
                    className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
                  />
                  <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Student Results Table */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50/50">
                      <th className="py-3 px-4 rounded-l-xl">Student Name</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-center">Percentage</th>
                      <th className="py-3 px-4 text-center rounded-r-xl">Completed On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                    {paginatedStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{student.name}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{student.testTitle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block py-1 px-3 rounded-full font-bold text-[9px] ${
                            student.status === 'Completed' ? 'bg-green-50 text-green-700' :
                            student.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-purple-700">
                          {student.status === 'Completed' ? `${student.score} / ${student.totalQs}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gray-800">
                          {student.status === 'Completed' ? `${student.percentage}%` : '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-400 font-semibold">{student.completedOn}</td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-400">No results found matching query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredStudents.length > 0 && (
                <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
                  <span className="text-[10px] text-gray-400 font-semibold select-none">
                    Showing {(studentPage - 1) * studentsPerPage + 1} to {Math.min(studentPage * studentsPerPage, filteredStudents.length)} of {filteredStudents.length} students
                  </span>
                  <div className="flex items-center gap-1">
                    <button 
                      disabled={studentPage === 1}
                      onClick={() => setStudentPage(prev => prev - 1)}
                      className="p-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-lg transition-colors cursor-pointer"
                    >
                      &lt;
                    </button>
                    {[...Array(totalStudentPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStudentPage(i + 1)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          studentPage === i + 1 
                            ? 'bg-purple-900 text-white shadow-xs' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      disabled={studentPage === totalStudentPages}
                      onClick={() => setStudentPage(prev => prev + 1)}
                      className="p-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-lg transition-colors cursor-pointer"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>

        </div>

      </main>

      {/* 3. CREATE / EDIT TEST DIALOG MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto py-10 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-display font-extrabold text-xl text-gray-800">
                {isEditing ? 'Edit Assessment Settings' : 'Create New Assessment'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <form onSubmit={handleSaveTest} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
              
              {/* Basic Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Test Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. React Hooks In-Depth" 
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Duration (Minutes)</label>
                  <input 
                    type="number" 
                    required
                    min="5"
                    max="180"
                    placeholder="30" 
                    value={testDuration}
                    onChange={(e) => setTestDuration(e.target.value)}
                    className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Test Description</label>
                <textarea 
                  rows="2"
                  placeholder="Provide a short description of the test scope..."
                  value={testDesc}
                  onChange={(e) => setTestDesc(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Question Editor Section */}
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-extrabold text-sm text-gray-800 uppercase tracking-wide">Questions Setup</h4>
                  <button 
                    type="button" 
                    onClick={handleAddQuestion}
                    className="py-1.5 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {testQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-gray-50 border border-gray-150 p-5 rounded-2xl flex flex-col gap-4 relative">
                      
                      {/* Close button */}
                      {testQuestions.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="absolute top-4 right-4 p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <input 
                          type="text" 
                          required
                          placeholder="Type Question stem..." 
                          value={q.text}
                          onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                          className="w-full py-1.5 bg-transparent border-b border-gray-250 focus:border-purple-600 focus:outline-none text-sm font-semibold text-gray-800 placeholder-gray-400"
                        />
                      </div>

                      {/* Options input grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 shrink-0">Option {String.fromCharCode(65 + optIdx)}</span>
                            <input 
                              type="text" 
                              required
                              placeholder={`Option text...`} 
                              value={opt}
                              onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              className="w-full py-1.5 px-3 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-600 text-gray-700"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Correct Choice Setter */}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-gray-400">Select Correct Answer:</span>
                        <select 
                          value={q.correctAnswer}
                          onChange={(e) => handleCorrectAnswerChange(qIdx, e.target.value)}
                          className="py-1.5 px-4 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none"
                        >
                          {q.options.map((_, optIdx) => (
                            <option key={optIdx} value={optIdx}>
                              Option {String.fromCharCode(65 + optIdx)}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </form>

            {/* Modal Actions Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setShowFormModal(false)}
                className="py-2.5 px-5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveTest}
                className="py-2.5 px-6 bg-[#e54e73] hover:bg-[#d03b60] text-white font-bold rounded-xl text-xs shadow-md shadow-pink-100 transition-all cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Create Test'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. PREVIEW TEST MODAL */}
      {showPreviewModal && previewTest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl border border-gray-100 flex flex-col max-h-[80vh]">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-display font-extrabold text-lg text-gray-800">{previewTest.title}</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5 text-purple-600" /> {previewTest.duration} mins duration</p>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 text-xs text-purple-800 font-medium">
                💡 <span className="font-bold">Description: </span> {previewTest.description || 'No description provided.'}
              </div>
              
              <div className="flex flex-col gap-5">
                {previewTest.questions.map((q, idx) => (
                  <div key={q.id || idx} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="font-bold text-xs text-gray-800 mb-2 flex items-start gap-1.5">
                      <span className="text-purple-600 font-display font-extrabold">{idx + 1}.</span>
                      <span>{q.text}</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        return (
                          <div 
                            key={optIdx} 
                            className={`p-2 rounded-lg text-[10px] font-semibold border ${
                              isCorrect 
                                ? 'bg-green-50 border-green-200 text-green-700 flex items-center justify-between' 
                                : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                            {isCorrect && <Check className="w-3 h-3 text-green-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="py-2 px-5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CreatorDashboard;
