import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, List, LayoutDashboard, FileSpreadsheet, Users, 
  Settings as SettingsIcon, LogOut, Eye, Edit2, Trash2, Search, Plus, 
  Trash, X, Clock, HelpCircle, Check, FileText, Code, Image as ImageIcon,
  BarChart3, PieChart, Sparkles, UserPlus, FolderPlus, Download, Award, Target, ArrowRight, ShieldCheck 
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
    cohorts,
    createCohort,
    deleteCohort,
    addStudentToCohort,
    getPerformanceDistribution,
    getInfographicAnalytics
  } = useApp();
  
  const navigate = useNavigate();

  // Navigation menu state
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Search filter for Student Results & Cohorts
  const [searchStudent, setSearchStudent] = useState('');
  const [searchCohort, setSearchCohort] = useState('');

  // Pagination states
  const [testPage, setTestPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const testsPerPage = 5;
  const studentsPerPage = 6;

  // Test Modal / Form Dialog States
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);
  
  // Test builder fields
  const [testTitle, setTestTitle] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [testDuration, setTestDuration] = useState('30');
  
  // Questions array with question types (mcq, short_ans, embedded)
  const [testQuestions, setTestQuestions] = useState([
    { 
      type: 'mcq', 
      text: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0 
    }
  ]);

  // Preview Test Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTest, setPreviewTest] = useState(null);

  // Cohort Modal States
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortDesc, setNewCohortDesc] = useState('');

  // Add Student to Cohort Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedCohortForStudent, setSelectedCohortForStudent] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  // Profile Dropdown State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Toast / Notification banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      { type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: 0 }
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
    setTestQuestions(test.questions.map(q => {
      let resolvedType = q.type || 'mcq';
      if (resolvedType === 'embedded' && (!q.codeSnippet || q.codeSnippet.trim() === '') && q.options && q.options.length > 0) {
        resolvedType = 'mcq';
      }
      return {
        type: resolvedType,
        text: q.text,
        options: q.options ? [...q.options] : ['', '', '', ''],
        correctAnswer: q.correctAnswer || 0,
        sampleAnswer: q.sampleAnswer || '',
        keywords: q.keywords ? (Array.isArray(q.keywords) ? q.keywords.join(', ') : q.keywords) : '',
        embedType: q.embedType || 'code',
        codeSnippet: q.codeSnippet || '',
        embedUrl: q.embedUrl || ''
      };
    }));
    setShowFormModal(true);
  };

  // Handle Save Test (Create or Update)
  const handleSaveTest = (e) => {
    e.preventDefault();
    if (!testTitle.trim()) return;

    // Clean questions list
    const cleanQuestions = testQuestions.filter(q => q.text.trim() !== '');
    if (cleanQuestions.length === 0) {
      alert("Please add at least one question with text.");
      return;
    }

    const testPayload = {
      title: testTitle,
      description: testDesc,
      duration: parseInt(testDuration) || 30,
      questions: cleanQuestions.map((q, idx) => {
        const base = {
          id: `q-${idx}-${Date.now()}`,
          type: q.type,
          text: q.text
        };
        
        if (q.type === 'mcq') {
          return {
            ...base,
            options: q.options.map(opt => opt.trim() || 'Option'),
            correctAnswer: parseInt(q.correctAnswer) || 0
          };
        } else if (q.type === 'short_ans') {
          return {
            ...base,
            sampleAnswer: q.sampleAnswer || 'Model answer prompt',
            keywords: typeof q.keywords === 'string' ? q.keywords.split(',').map(k => k.trim()) : (q.keywords || [])
          };
        } else if (q.type === 'embedded') {
          return {
            ...base,
            embedType: q.embedType || 'code',
            codeSnippet: q.codeSnippet || '',
            embedUrl: q.embedUrl || ''
          };
        }
        return base;
      })
    };

    if (isEditing) {
      updateTest(activeTestId, testPayload);
      showToast("Test updated successfully!");
    } else {
      createTest(testPayload);
      showToast("New test created successfully!");
    }
    setShowFormModal(false);
  };

  // Question form item managers
  const handleAddQuestion = (type = 'mcq') => {
    if (type === 'short_ans') {
      setTestQuestions(prev => [
        ...prev,
        { type: 'short_ans', text: '', sampleAnswer: '', keywords: '' }
      ]);
    } else if (type === 'embedded') {
      setTestQuestions(prev => [
        ...prev,
        { type: 'embedded', text: '', embedType: 'code', codeSnippet: `// Enter sample code here\nconst express = require('express');` }
      ]);
    } else {
      setTestQuestions(prev => [
        ...prev,
        { type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]);
    }
  };

  const handleRemoveQuestion = (idx) => {
    setTestQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx, field, val) => {
    setTestQuestions(prev => prev.map((q, i) => {
      if (i !== idx) return q;
      const updated = { ...q, [field]: val };
      if (field === 'type') {
        if (val === 'mcq' && (!updated.options || updated.options.length === 0)) {
          updated.options = ['', '', '', ''];
          updated.correctAnswer = 0;
        }
        if (val === 'embedded' && !updated.codeSnippet) {
          updated.codeSnippet = '// Enter sample code here\nconst express = require("express");';
        }
      }
      return updated;
    }));
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    setTestQuestions(prev => prev.map((q, i) => {
      if (i === qIdx) {
        const nextOpts = [...(q.options || ['', '', '', ''])];
        nextOpts[optIdx] = val;
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const handleOpenPreview = (test) => {
    setPreviewTest(test);
    setShowPreviewModal(true);
  };

  // Create Cohort Handler
  const handleSaveCohort = (e) => {
    e.preventDefault();
    if (!newCohortName.trim()) return;
    createCohort({ name: newCohortName, description: newCohortDesc });
    setNewCohortName('');
    setNewCohortDesc('');
    setShowCohortModal(false);
    showToast("New cohort created successfully!");
  };

  // Add Student to Cohort Handler
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedCohortForStudent) return;
    addStudentToCohort(selectedCohortForStudent.id, newStudentName, newStudentEmail);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddStudentModal(false);
    showToast(`Added ${newStudentName} to cohort!`);
  };

  // Dynamic Data & Analytics
  const dist = getPerformanceDistribution();
  const infographicData = getInfographicAnalytics();

  // Search filtered students list
  const filteredStudents = studentResults.filter(student => 
    student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.status.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.testTitle.toLowerCase().includes(searchStudent.toLowerCase()) ||
    student.cohort.toLowerCase().includes(searchStudent.toLowerCase()) ||
    (student.timeTaken || '').toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Search filtered cohorts list
  const filteredCohorts = cohorts.filter(c => 
    c.name.toLowerCase().includes(searchCohort.toLowerCase()) ||
    c.description.toLowerCase().includes(searchCohort.toLowerCase())
  );

  const attemptsCount = studentResults.length;
  const passedCount = studentResults.filter(r => r.percentage >= 50 && r.status !== 'Not Attempted').length;
  const failedCount = studentResults.filter(r => r.percentage > 0 && r.percentage < 50).length;
  const averageScore = studentResults.length
    ? Math.round(studentResults.reduce((sum, item) => sum + (item.percentage || 0), 0) / studentResults.length)
    : 0;

  const completedCount = studentResults.filter(r => r.status === 'Completed').length;
  const inProgressCount = studentResults.filter(r => r.status === 'In Progress').length;
  const notAttemptedCount = studentResults.filter(r => r.status === 'Not Attempted').length;

  // Paginated lists
  const totalTestPages = Math.ceil(tests.length / testsPerPage);
  const paginatedTests = tests.slice((testPage - 1) * testsPerPage, testPage * testsPerPage);

  const totalStudentPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage);

  // SVG Donut Chart geometry calculation
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="min-h-screen flex bg-[#cebfe2] font-sans antialiased animate-fade-in relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-purple-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-700 z-50 flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-72 bg-white flex flex-col justify-between border-r border-gray-150 py-8 px-6 shrink-0 shadow-lg">
        
        {/* Top Logo */}
        <div>
          <div className="flex items-center gap-3 mb-8 pl-2 select-none">
            {/* Logo Stack (Symbol + SHAI) */}
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
            {/* CourseHub Text */}
            <span className="font-display font-extrabold text-2xl text-gray-800 tracking-tight leading-none mt-1">CourseHub</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 mt-6">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Create Test', icon: Plus, action: handleOpenCreate },
              { name: 'All Tests', icon: FileText },
              { name: 'Cohort', icon: Users },
              { name: 'Results', icon: FileSpreadsheet },
              { name: 'Courses', icon: ShieldCheck, action: () => navigate('/creator/course') },
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
        <div className="mt-6 mb-4">
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

        {/* Sidebar Logout */}
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
                  <span className="text-[10px] text-pink-100 font-medium leading-none">{user?.title || 'Course Creator'}</span>
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
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content canvas switcher */}
        <div className="flex-1 p-10 flex flex-col gap-8">
          
          {/* VIEW 1: MAIN DASHBOARD */}
          {activeMenu === 'Dashboard' && (
            <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl text-gray-800">Overview & Student Results</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Track cohort performance, test completion, and student progress.</p>
                </div>
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={searchStudent}
                    onChange={(e) => { setSearchStudent(e.target.value); setStudentPage(1); }}
                    className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
                  />
                  <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Students</p>
                  <p className="mt-4 text-3xl font-extrabold text-purple-900">{studentResults.length}</p>
                </div>
                <div className="bg-green-50 rounded-3xl p-6 border border-green-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Completed</p>
                  <p className="mt-4 text-3xl font-extrabold text-green-900">{completedCount}</p>
                </div>
                <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">In Progress</p>
                  <p className="mt-4 text-3xl font-extrabold text-yellow-900">{inProgressCount}</p>
                </div>
                <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Not Attempted</p>
                  <p className="mt-4 text-3xl font-extrabold text-red-900">{notAttemptedCount}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50/50">
                      <th className="py-3.5 px-4 rounded-l-xl">Student Name</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Score</th>
                      <th className="py-3.5 px-4">Percentage</th>
                      <th className="py-3.5 px-4">Completed On</th>
                      <th className="py-3.5 px-4 rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                    {paginatedStudents.map((student, idx) => (
                      <tr key={student.id || idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-800">{student.name}</span>
                            <span className="text-[10px] text-gray-400">{student.testTitle} • {student.cohort}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ${
                            student.status === 'Completed' ? 'bg-green-50 text-green-700' :
                            student.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-purple-700">{student.status === 'Completed' ? `${student.score} / ${student.totalQs}` : '-'}</td>
                        <td className="py-3.5 px-4 text-gray-500">{student.percentage}%</td>
                        <td className="py-3.5 px-4 text-gray-500">{student.completedOn}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50 pt-4 mt-2">
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
          )}

          {/* VIEW 2: COHORT MANAGEMENT */}
          {activeMenu === 'Cohort' && (
            <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl text-gray-800">Cohort</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Groups of students assigned to tests.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Search cohort..."
                      value={searchCohort}
                      onChange={(e) => setSearchCohort(e.target.value)}
                      className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
                    />
                    <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowCohortModal(true)}
                    className="py-2.5 px-5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-100 flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    Create New Cohort
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Cohort Name</p>
                  <p className="mt-4 text-3xl font-extrabold text-purple-900">{cohorts.length}</p>
                </div>
                <div className="bg-green-50 rounded-3xl p-5 border border-green-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Students</p>
                  <p className="mt-4 text-3xl font-extrabold text-green-900">{cohorts.reduce((sum, c) => sum + c.totalStudents, 0)}</p>
                </div>
                <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Active Cohorts</p>
                  <p className="mt-4 text-3xl font-extrabold text-blue-900">{cohorts.filter(c => c.status === 'Active').length}</p>
                </div>
                <div className="bg-red-50 rounded-3xl p-5 border border-red-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Inactive</p>
                  <p className="mt-4 text-3xl font-extrabold text-red-900">{cohorts.filter(c => c.status !== 'Active').length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50/50">
                      <th className="py-3.5 px-4 rounded-l-xl">Cohort Name</th>
                      <th className="py-3.5 px-4">Students</th>
                      <th className="py-3.5 px-4">Assigned Test</th>
                      <th className="py-3.5 px-4">Created On</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                    {filteredCohorts.map(cohort => (
                      <tr key={cohort.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-800">{cohort.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{cohort.totalStudents}</td>
                        <td className="py-3.5 px-4 text-gray-500">{cohort.assignedTests?.[0] || 'Unassigned'}</td>
                        <td className="py-3.5 px-4 text-gray-500">{cohort.createdOn}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ${cohort.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {cohort.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete cohort "${cohort.name}"?`)) deleteCohort(cohort.id);
                              }}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* VIEW 3: ALL TESTS */}
          {activeMenu === 'All Tests' && (
            <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl text-gray-800">All Tests</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Review assessments, manage questions, and export test packages.</p>
                </div>
                <button
                  onClick={handleOpenCreate}
                  className="py-2.5 px-5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-100 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Test
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50/50">
                      <th className="py-3.5 px-4 rounded-l-xl">Test Title</th>
                      <th className="py-3.5 px-4">Description</th>
                      <th className="py-3.5 px-4 text-center">Questions</th>
                      <th className="py-3.5 px-4 text-center">Duration</th>
                      <th className="py-3.5 px-4 text-center">Type Mix</th>
                      <th className="py-3.5 px-4 text-center rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                    {paginatedTests.map(test => (
                      <tr key={test.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-800">{test.title}</td>
                        <td className="py-3.5 px-4 text-gray-500">{test.description}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-purple-700">{test.questions?.length || 0}</td>
                        <td className="py-3.5 px-4 text-center text-gray-500">{test.duration} mins</td>
                        <td className="py-3.5 px-4 text-center text-gray-500">
                          <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em]">
                            {Array.from(new Set(test.questions?.map(q => {
                              let t = q.type || 'mcq';
                              if (t === 'embedded' && (!q.codeSnippet || q.codeSnippet.trim() === '') && q.options && q.options.length > 0) {
                                t = 'mcq';
                              }
                              return t;
                            }))).map((type, idx) => (
                              <span key={idx} className={`px-2 py-1 rounded-full ${type === 'mcq' ? 'bg-purple-100 text-purple-700' : type === 'short_ans' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                {type === 'mcq' ? 'MCQ' : type === 'short_ans' ? 'Short' : 'Embed'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenPreview(test)}
                              className="p-1.5 hover:bg-purple-50 text-purple-600 hover:text-purple-800 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(test)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-800 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { if (confirm(`Delete test "${test.title}"?`)) deleteTest(test.id); }}
                              className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {tests.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50 pt-4 mt-2">
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
          )}

          {/* VIEW 4: SETTINGS */}
          {activeMenu === 'Settings' && (
            <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h2 className="font-display font-extrabold text-xl text-gray-800">Settings</h2>
                <p className="text-xs text-gray-400 font-medium">Manage your creator settings and workspace preferences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3">Profile</h3>
                  <p className="text-xs text-gray-500">Update your display name, title, and contact details.</p>
                </div>
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3">Notifications</h3>
                  <p className="text-xs text-gray-500">Configure alerts for new submissions and test completions.</p>
                </div>
              </div>
            </section>
          )}

          {/* VIEW 3: RESULTS */}
          {activeMenu === 'Results' && (
            <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-xl text-gray-800">Results</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Detailed results across all tests and cohorts.</p>
                </div>
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search student or test..."
                    value={searchStudent}
                    onChange={(e) => { setSearchStudent(e.target.value); setStudentPage(1); }}
                    className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
                  />
                  <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Attempts</p>
                  <p className="mt-4 text-3xl font-extrabold text-purple-900">{attemptsCount}</p>
                </div>
                <div className="bg-green-50 rounded-3xl p-6 border border-green-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Passed</p>
                  <p className="mt-4 text-3xl font-extrabold text-green-900">{passedCount}</p>
                </div>
                <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Failed</p>
                  <p className="mt-4 text-3xl font-extrabold text-red-900">{failedCount}</p>
                </div>
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Average Score</p>
                  <p className="mt-4 text-3xl font-extrabold text-blue-900">{averageScore}%</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50/50">
                      <th className="py-3.5 px-4 rounded-l-xl">Student Name</th>
                      <th className="py-3.5 px-4">Test Name</th>
                      <th className="py-3.5 px-4">Cohort</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Score</th>
                      <th className="py-3.5 px-4 text-center">Percentage</th>
                      <th className="py-3.5 px-4 text-center">Time Taken</th>
                      <th className="py-3.5 px-4 text-center rounded-r-xl">Completed On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-medium">
                    {paginatedStudents.map((student, idx) => (
                      <tr key={student.id || idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-800">{student.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{student.testTitle}</td>
                        <td className="py-3.5 px-4 text-gray-500">{student.cohort}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[10px] font-bold ${
                            student.status === 'Completed' ? 'bg-green-50 text-green-700' :
                            student.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-purple-700">{student.score}</td>
                        <td className="py-3.5 px-4 text-center text-gray-500">{student.percentage}%</td>
                        <td className="py-3.5 px-4 text-center text-gray-500">{student.timeTaken || '-'}</td>
                        <td className="py-3.5 px-4 text-center text-gray-500">{student.completedOn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50 pt-4 mt-2">
                  <span className="text-[10px] text-gray-400 font-semibold select-none">
                    Showing {(studentPage - 1) * studentsPerPage + 1} to {Math.min(studentPage * studentsPerPage, filteredStudents.length)} of {filteredStudents.length} results
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
          )}

        </div>

      </main>

      {/* 3. CREATE / EDIT TEST DIALOG MODAL (WITH MCQ, SHORT ANS, EMBEDDED QUESTION OPTIONS) */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto py-10 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
            
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
                    placeholder="e.g. Full-Stack Engineering Assessment" 
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

              {/* QUESTION TYPE BUILDER SECTION */}
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-gray-800 uppercase tracking-wide">Questions & Types Setup</h4>
                    <p className="text-[10px] text-gray-400">Choose between MCQ, Short Answer, or Embedded Code/Media question types.</p>
                  </div>

                  {/* Add Question Button Group */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => handleAddQuestion('mcq')}
                      className="py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> MCQ
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAddQuestion('short_ans')}
                      className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Short Ans
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAddQuestion('embedded')}
                      className="py-1.5 px-3 bg-pink-50 hover:bg-pink-100 text-[#e54e73] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Embedded
                    </button>
                  </div>
                </div>

                {/* Question Items Editor List */}
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

                      {/* Top Header: Question Index + Question Type Selector */}
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Question Format:</label>
                          <select 
                            value={q.type}
                            onChange={(e) => handleQuestionChange(qIdx, 'type', e.target.value)}
                            className="py-1 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-purple-900 focus:outline-none"
                          >
                            <option value="mcq">Multiple Choice (MCQ)</option>
                            <option value="short_ans">Short Answer</option>
                            <option value="embedded">Embedded Question Type</option>
                          </select>
                        </div>
                      </div>

                      {/* Question Stem Field */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Question Stem Prompt:</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Type Question prompt..." 
                          value={q.text}
                          onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                          className="w-full py-2 px-3 bg-white border border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none text-xs font-semibold text-gray-800 placeholder-gray-400"
                        />
                      </div>

                      {/* CONDITIONAL QUESTION TYPE INPUTS */}
                      
                      {/* TYPE 1: MCQ */}
                      {q.type === 'mcq' && (
                        <div className="flex flex-col gap-3 mt-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(q.options || ['', '', '', '']).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 shrink-0">Option {String.fromCharCode(65 + optIdx)}</span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder={`Choice text...`} 
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                  className="w-full py-1.5 px-3 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-600 text-gray-700"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-gray-400">Correct Choice:</span>
                            <select 
                              value={q.correctAnswer}
                              onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', parseInt(e.target.value))}
                              className="py-1 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700"
                            >
                              {(q.options || ['', '', '', '']).map((_, optIdx) => (
                                <option key={optIdx} value={optIdx}>
                                  Option {String.fromCharCode(65 + optIdx)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* TYPE 2: SHORT ANSWER */}
                      {q.type === 'short_ans' && (
                        <div className="flex flex-col gap-3 mt-1">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Model / Sample Answer Key:</label>
                            <textarea 
                              rows="2"
                              placeholder="Describe expected correct points or sample answer..."
                              value={q.sampleAnswer || ''}
                              onChange={(e) => handleQuestionChange(qIdx, 'sampleAnswer', e.target.value)}
                              className="w-full py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Key Keywords (comma-separated):</label>
                            <input 
                              type="text"
                              placeholder="e.g. state, re-render, Virtual DOM"
                              value={q.keywords || ''}
                              onChange={(e) => handleQuestionChange(qIdx, 'keywords', e.target.value)}
                              className="w-full py-1.5 px-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* TYPE 3: EMBEDDED QUESTION */}
                      {q.type === 'embedded' && (
                        <div className="flex flex-col gap-3 mt-1 border-t border-gray-200 pt-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Embedded Code Snippet:</label>
                            <textarea 
                              rows="4"
                              placeholder="// Code block to display to student..."
                              value={q.codeSnippet || ''}
                              onChange={(e) => handleQuestionChange(qIdx, 'codeSnippet', e.target.value)}
                              className="w-full py-2.5 px-3 bg-gray-900 border border-gray-800 text-purple-200 rounded-xl text-xs font-mono"
                            />
                          </div>
                        </div>
                      )}

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
                {isEditing ? 'Save Changes' : 'Create Assessment'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. PREVIEW TEST MODAL */}
      {showPreviewModal && previewTest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-display font-extrabold text-lg text-gray-800">{previewTest.title}</h3>
                <p className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5 text-purple-600" /> {previewTest.duration} mins duration • {previewTest.questions?.length} Questions</p>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex flex-col gap-6">
              {previewTest.questions?.map((q, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-purple-700">Q{idx + 1}. {q.text}</span>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {q.type === 'mcq' ? 'MCQ' : q.type === 'short_ans' ? 'Short Answer' : 'Embedded Question'}
                    </span>
                  </div>

                  {q.type === 'embedded' && q.codeSnippet && (
                    <pre className="bg-gray-900 text-purple-200 p-3 rounded-xl text-[10px] font-mono">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}

                  {q.type === 'short_ans' || q.type === 'embedded' ? (
                    <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs italic text-gray-500">
                      {q.type === 'short_ans' 
                        ? `Model Key: ${q.sampleAnswer || 'Sample short answer explanation.'}`
                        : 'Interactive Code Response'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {q.options?.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-2 rounded-lg text-xs font-semibold border ${
                          q.correctAnswer === oIdx ? 'bg-green-100 border-green-300 text-green-800 font-bold' : 'bg-white border-gray-200 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="py-2 px-5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. CREATE COHORT MODAL */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display font-extrabold text-xl text-gray-800 mb-2 flex items-center gap-2">
              <FolderPlus className="w-6 h-6 text-[#e54e73]" />
              Create New Cohort
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Group students into batches to track aggregate progress and assign custom test packages.
            </p>

            <form onSubmit={handleSaveCohort} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Cohort Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. React Mastery - Fall Batch"
                  value={newCohortName}
                  onChange={(e) => setNewCohortName(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                <textarea 
                  rows="3"
                  placeholder="Describe the cohort scope and goals..."
                  value={newCohortDesc}
                  onChange={(e) => setNewCohortDesc(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowCohortModal(false)}
                  className="py-2.5 px-5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="py-2.5 px-6 bg-[#e54e73] hover:bg-[#d03b60] text-white font-bold rounded-xl text-xs shadow-md shadow-pink-100"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD STUDENT TO COHORT MODAL */}
      {showAddStudentModal && selectedCohortForStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="font-display font-extrabold text-xl text-gray-800 mb-2 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-purple-700" />
              Enroll Student to {selectedCohortForStudent.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Add a new member to this cohort batch to assign test tracking.
            </p>

            <form onSubmit={handleAddStudentSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Student Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Divya Sharma"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="divya@example.com"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="py-2.5 px-5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="py-2.5 px-6 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-100"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreatorDashboard;
