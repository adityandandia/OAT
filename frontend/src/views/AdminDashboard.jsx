import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, LayoutDashboard, FileText, Users, Settings as SettingsIcon, LogOut, Search, Plus, Eye, Edit2, Trash2, ShieldCheck, Key, ShieldAlert, BarChart3, Award, UserPlus, FolderPlus, ArrowRight, CheckCircle2, RotateCcw, X, Clock, Check, Calendar, Target, Upload, Filter, Layers, CheckSquare
} from 'lucide-react';

const DEFAULT_PERMISSIONS = [
  {
    role: 'Admin',
    icon: 'A',
    description: 'Full system & platform access',
    color: 'bg-purple-100 text-purple-700',
    rights: { read: true, write: true, execute: true, create: true, delete: true }
  },
  {
    role: 'Test Creator',
    icon: 'C',
    description: 'Builds and manages tests & courses',
    color: 'bg-pink-100 text-pink-700',
    rights: { read: true, write: true, execute: false, create: true, delete: true }
  },
  {
    role: 'Instructor',
    icon: 'I',
    description: 'Reviews cohorts and student results',
    color: 'bg-blue-100 text-blue-700',
    rights: { read: true, write: false, execute: true, create: true, delete: false }
  },
  {
    role: 'Student',
    icon: 'S',
    description: 'Takes assigned tests and views results',
    color: 'bg-emerald-100 text-emerald-700',
    rights: { read: true, write: false, execute: true, create: false, delete: false }
  }
];

const PERMISSION_COLUMNS = [
  { key: 'read', label: 'READ', desc: 'View portal content' },
  { key: 'write', label: 'WRITE', desc: 'Edit records & content' },
  { key: 'execute', label: 'EXECUTE', desc: 'Attempt & run tests' },
  { key: 'create', label: 'CREATE', desc: 'Build new tests/cohorts' },
  { key: 'delete', label: 'DELETE', desc: 'Remove data items' }
];

const ALL_AVAILABLE_ROLES = ['Admin', 'Test Creator', 'Instructor', 'Student'];

const AdminDashboard = () => {
  const { 
    user, 
    logout, 
    systemUsers, 
    addSystemUser, 
    updateSystemUser, 
    toggleUserStatus, 
    deleteSystemUser,
    tests, 
    createTest, 
    updateTest, 
    deleteTest,
    studentResults, 
    gradeStudentSubmission,
    courses, 
    createCourse, 
    updateCourse, 
    deleteCourse,
    cohorts, 
    createCohort, 
    deleteCohort, 
    addStudentToCohort 
  } = useApp();

  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  
  // Search & Filter States
  const [searchUser, setSearchUser] = useState('');
  const [searchTest, setSearchTest] = useState('');
  const [searchCohort, setSearchCohort] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [searchResult, setSearchResult] = useState('');

  // Roles & Permissions matrix state
  const [rolePermissions, setRolePermissions] = useState(DEFAULT_PERMISSIONS);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- 1. USER MANAGEMENT STATE & MODALS ---
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userStatusState, setUserStatusState] = useState('Active');
  const [selectedUserRoles, setSelectedUserRoles] = useState(['Student']);

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserName('');
    setUserEmail('');
    setUserStatusState('Active');
    setSelectedUserRoles(['Student']);
    setShowUserModal(true);
  };

  const handleOpenEditUser = (userItem) => {
    setEditingUserId(userItem.id);
    setUserName(userItem.name);
    setUserEmail(userItem.email || '');
    setUserStatusState(userItem.userStatus || 'Active');
    setSelectedUserRoles(Array.isArray(userItem.roles) ? userItem.roles : [userItem.role || 'Student']);
    setShowUserModal(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    if (selectedUserRoles.length === 0) {
      alert("Please select at least one role for the user.");
      return;
    }

    const payload = {
      name: userName.trim(),
      email: userEmail.trim(),
      userStatus: userStatusState,
      roles: selectedUserRoles
    };

    if (editingUserId) {
      updateSystemUser(editingUserId, payload);
      showToast("User updated successfully!");
    } else {
      addSystemUser(payload);
      showToast("New user added successfully!");
    }
    setShowUserModal(false);
  };

  const handleToggleRoleSelection = (roleName) => {
    setSelectedUserRoles(prev => 
      prev.includes(roleName)
        ? (prev.length > 1 ? prev.filter(r => r !== roleName) : prev)
        : [...prev, roleName]
    );
  };

  // --- 2. TEST BUILDER & MANAGERS ---
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditingTest, setIsEditingTest] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);
  
  const [testTitle, setTestTitle] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [testDuration, setTestDuration] = useState('30');
  const [testCategory, setTestCategory] = useState('Software Engineering');
  const [customCategory, setCustomCategory] = useState('');
  const [testAttemptsAllowed, setTestAttemptsAllowed] = useState('1');
  const [testShuffleQuestions, setTestShuffleQuestions] = useState(true);
  const [testRandomizeQuestions, setTestRandomizeQuestions] = useState(true);
  const [scheduleType, setScheduleType] = useState('one_time');

  const [testQuestions, setTestQuestions] = useState([
    { type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTest, setPreviewTest] = useState(null);

  const handleOpenCreateTest = () => {
    setIsEditingTest(false);
    setTestTitle('');
    setTestDesc('');
    setTestDuration('30');
    setTestCategory('Software Engineering');
    setCustomCategory('');
    setTestAttemptsAllowed('1');
    setTestShuffleQuestions(true);
    setTestRandomizeQuestions(true);
    setScheduleType('one_time');
    setTestQuestions([
      { type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
    setShowFormModal(true);
  };

  const handleOpenEditTest = (test) => {
    setIsEditingTest(true);
    setActiveTestId(test.id);
    setTestTitle(test.title);
    setTestDesc(test.description);
    setTestDuration(test.duration ? test.duration.toString() : '30');

    const standardCategories = ['Software Engineering', 'Web Development', 'UI/UX Design', 'Database Systems', 'Data Science', 'Cloud & DevOps', 'QA & Testing'];
    if (test.category && !standardCategories.includes(test.category)) {
      setTestCategory('Custom');
      setCustomCategory(test.category);
    } else {
      setTestCategory(test.category || 'Software Engineering');
      setCustomCategory('');
    }

    setTestAttemptsAllowed(test.attemptsAllowed !== undefined ? test.attemptsAllowed.toString() : '1');
    setTestShuffleQuestions(test.shuffleQuestions !== undefined ? test.shuffleQuestions : true);
    setTestRandomizeQuestions(test.randomizeQuestions !== undefined ? test.randomizeQuestions : true);
    setScheduleType(test.frequencyType || 'one_time');

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

  const handleSaveTest = (e) => {
    e.preventDefault();
    if (!testTitle.trim()) return;

    const cleanQuestions = testQuestions.filter(q => q.text.trim() !== '');
    if (cleanQuestions.length === 0) {
      alert("Please add at least one question with text.");
      return;
    }

    const finalCategory = testCategory === 'Custom' ? (customCategory.trim() || 'General') : testCategory;

    const testPayload = {
      title: testTitle,
      description: testDesc,
      duration: parseInt(testDuration) || 30,
      category: finalCategory,
      frequencyType: scheduleType,
      attemptsAllowed: testAttemptsAllowed === 'Unlimited' ? 'Unlimited' : parseInt(testAttemptsAllowed) || 1,
      shuffleQuestions: testShuffleQuestions,
      randomizeQuestions: testRandomizeQuestions,
      questions: cleanQuestions.map((q, idx) => {
        const base = { id: `q-${idx}-${Date.now()}`, type: q.type, text: q.text };
        if (q.type === 'mcq') {
          return { ...base, options: q.options.map(opt => opt.trim() || 'Option'), correctAnswer: parseInt(q.correctAnswer) || 0 };
        } else if (q.type === 'short_ans') {
          return { ...base, sampleAnswer: q.sampleAnswer || 'Model answer prompt', keywords: typeof q.keywords === 'string' ? q.keywords.split(',').map(k => k.trim()) : (q.keywords || []) };
        } else if (q.type === 'embedded') {
          return { ...base, embedType: q.embedType || 'code', codeSnippet: q.codeSnippet || '', embedUrl: q.embedUrl || '' };
        }
        return base;
      })
    };

    if (isEditingTest) {
      updateTest(activeTestId, testPayload);
      showToast("Test updated successfully!");
    } else {
      createTest(testPayload);
      showToast("New test created successfully!");
    }
    setShowFormModal(false);
  };

  const handleAddQuestionItem = (type = 'mcq') => {
    setTestQuestions(prev => [
      ...prev,
      {
        type,
        text: '',
        options: type === 'mcq' ? ['', '', '', ''] : undefined,
        correctAnswer: 0,
        sampleAnswer: type === 'short_ans' ? '' : undefined,
        keywords: type === 'short_ans' ? '' : undefined,
        embedType: type === 'embedded' ? 'code' : undefined,
        codeSnippet: '',
        embedUrl: ''
      }
    ]);
  };

  const handleRemoveQuestionItem = (idx) => {
    if (testQuestions.length <= 1) {
      alert("At least one question is required.");
      return;
    }
    setTestQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // --- 3. COHORT MANAGERS ---
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortDesc, setNewCohortDesc] = useState('');

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedCohortForStudent, setSelectedCohortForStudent] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const handleCreateCohort = (e) => {
    e.preventDefault();
    if (!newCohortName.trim()) return;
    createCohort({ name: newCohortName, description: newCohortDesc });
    showToast("Cohort created successfully!");
    setNewCohortName('');
    setNewCohortDesc('');
    setShowCohortModal(false);
  };

  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedCohortForStudent) return;
    addStudentToCohort(selectedCohortForStudent.id, newStudentName, newStudentEmail);
    showToast(`Added ${newStudentName} to cohort!`);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddStudentModal(false);
  };

  // --- 4. COURSE MANAGERS ---
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDuration, setCourseDuration] = useState('60');
  const [courseStatus, setCourseStatus] = useState('Active');

  const handleOpenCreateCourse = () => {
    setIsEditingCourse(false);
    setCourseTitle('');
    setCourseDesc('');
    setCourseDuration('60');
    setCourseStatus('Active');
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course) => {
    setIsEditingCourse(true);
    setActiveCourseId(course.id);
    setCourseTitle(course.title);
    setCourseDesc(course.description || '');
    setCourseDuration(course.duration ? course.duration.toString() : '60');
    setCourseStatus(course.status || 'Active');
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    const payload = {
      title: courseTitle,
      description: courseDesc,
      duration: parseInt(courseDuration) || 60,
      status: courseStatus
    };
    if (isEditingCourse) {
      updateCourse(activeCourseId, payload);
      showToast("Course updated successfully!");
    } else {
      createCourse(payload);
      showToast("New course created successfully!");
    }
    setShowCourseModal(false);
  };

  // --- 5. RESULTS & EVALUATION GRADERS ---
  const [selectedCorrectionSubmission, setSelectedCorrectionSubmission] = useState(null);
  const [localCorrections, setLocalCorrections] = useState({});

  const handleOpenEvaluationModal = (sub) => {
    setSelectedCorrectionSubmission(sub);
    setLocalCorrections(sub.corrections || {});
  };

  const handleGradeSubmissionSubmit = (subId) => {
    if (!selectedCorrectionSubmission) return;
    const testObj = tests.find(t => t.id === selectedCorrectionSubmission.testId || t.title === selectedCorrectionSubmission.testTitle);
    const questions = testObj?.questions || [];
    
    let totalScore = 0;
    let totalMax = 0;

    questions.forEach((q, idx) => {
      const qMax = q.maxMarks || (q.type === 'short_ans' ? 5 : 1);
      totalMax += qMax;
      if (q.type === 'short_ans') {
        const corr = localCorrections[idx];
        if (corr) {
          totalScore += (parseFloat(corr.points) || 0);
        }
      } else {
        const userAns = selectedCorrectionSubmission.answers?.[idx];
        if (userAns !== undefined && userAns === q.correctAnswer) {
          totalScore += qMax;
        }
      }
    });

    const finalPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    gradeStudentSubmission(subId, localCorrections, totalScore, finalPct, 'Graded & Corrected');
    showToast("Submission graded successfully!");
    setSelectedCorrectionSubmission(null);
  };

  // --- 6. ADMIN PLATFORM SETTINGS ---
  const [platformTitle, setPlatformTitle] = useState('OneTest Assessment Portal');
  const [autoGradingThreshold, setAutoGradingThreshold] = useState('75');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast("Platform settings saved successfully!");
  };

  // Roles Matrix Toggle Handlers
  const handleTogglePermission = (roleName, permKey) => {
    setRolePermissions(prev => prev.map(r => r.role === roleName ? { ...r, rights: { ...r.rights, [permKey]: !r.rights[permKey] } } : r));
  };

  const handleToggleRow = (roleName) => {
    setRolePermissions(prev => prev.map(r => {
      if (r.role === roleName) {
        const allChecked = Object.values(r.rights).every(Boolean);
        const newRights = {};
        Object.keys(r.rights).forEach(k => { newRights[k] = !allChecked; });
        return { ...r, rights: newRights };
      }
      return r;
    }));
  };

  const handleSavePermissions = () => {
    showToast("Roles & Permissions matrix updated and saved!");
  };

  const handleResetPermissions = () => {
    setRolePermissions(DEFAULT_PERMISSIONS);
    showToast("Permissions reset to defaults!");
  };

  // Filtered Users List
  const filteredUsersList = systemUsers.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    (Array.isArray(u.roles) ? u.roles.join(' ').toLowerCase() : (u.role || '').toLowerCase()).includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#f8f2ff] text-slate-900 font-sans">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-purple-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 font-bold text-xs animate-fade-in border border-purple-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-gray-150 px-6 py-8 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pl-2">
            <div className="w-12 h-12 rounded-2xl bg-[#e54e73] text-white grid place-items-center text-xl font-black shadow-md shadow-pink-200">A</div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-extrabold">Admin Portal</p>
              <h1 className="font-display font-black text-xl text-slate-900 tracking-tight">CourseHub</h1>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5 text-sm">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Users', icon: Users },
              { name: 'Roles & Permissions', icon: ShieldCheck },
              { name: 'Create Test', icon: Plus, action: handleOpenCreateTest },
              { name: 'All Tests', icon: FileText },
              { name: 'Cohort', icon: FolderPlus },
              { name: 'Courses', icon: Layers },
              { name: 'Results', icon: BarChart3 },
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
                  className={`w-full text-left rounded-2xl px-4 py-3 flex items-center gap-3 font-bold transition cursor-pointer ${
                    isActive 
                      ? 'bg-purple-50 text-purple-800 shadow-xs border-l-4 border-[#e54e73]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#e54e73]' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="bg-[#f4efff] rounded-3xl p-5 border border-purple-100 mt-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-purple-700 font-extrabold">System Control</p>
          <p className="mt-2 text-xs text-slate-800 font-bold">Admin Privileges Active</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT CANVAS */}
      <main className="flex-1 overflow-y-auto p-10 flex flex-col gap-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-150 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-2xl text-slate-900">{activeMenu}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase tracking-wider">
                Admin Control
              </span>
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-1">Platform management, test creator features, and multi-role user administration.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenAddUser()} 
              className="py-2.5 px-4 rounded-2xl bg-[#e54e73] hover:bg-pink-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-pink-200 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Add New User
            </button>

            <button 
              onClick={handleOpenCreateTest} 
              className="py-2.5 px-4 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Test
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs flex items-center justify-center border border-purple-200">
                {user?.name?.[0] || 'A'}
              </div>
              <span className="text-xs font-extrabold text-slate-800">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* VIEW 1: MAIN ADMIN DASHBOARD (6 STAT CARDS) */}
        {activeMenu === 'Dashboard' && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900">Dashboard Metrics Overview</h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">Real-time statistics across tests, submissions, enrolled students, active cohorts, and courses.</p>
            </div>

            {/* 6 STAT CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Total Test Created */}
              <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">1. Total Test Created</p>
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 grid place-items-center">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-purple-950">{tests.length}</p>
                <p className="text-[11px] text-purple-600 font-medium mt-2">Active assessments in database</p>
              </div>

              {/* Card 2: How many test completed */}
              <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-green-700">2. Test Completed</p>
                  <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 grid place-items-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-green-950">
                  {studentResults.filter(s => s.status === 'Completed' || s.status === 'Graded & Corrected').length}
                </p>
                <p className="text-[11px] text-green-600 font-medium mt-2">Graded & finished student attempts</p>
              </div>

              {/* Card 3: How many test are Pending */}
              <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">3. Test Pending</p>
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 grid place-items-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-amber-950">
                  {studentResults.filter(s => s.status === 'Needs Correction' || s.status === 'In Progress').length}
                </p>
                <p className="text-[11px] text-amber-600 font-medium mt-2">Awaiting correction or in progress</p>
              </div>

              {/* Card 4: Total students enrolled */}
              <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">4. Total Students Enrolled</p>
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 grid place-items-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-blue-950">{systemUsers.length}</p>
                <p className="text-[11px] text-blue-600 font-medium mt-2">Registered platform user accounts</p>
              </div>

              {/* Card 5: Active Cohort */}
              <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">5. Active Cohort</p>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 grid place-items-center">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-indigo-950">
                  {cohorts.filter(c => c.status === 'Active').length}
                </p>
                <p className="text-[11px] text-indigo-600 font-medium mt-2">Active student training batches</p>
              </div>

              {/* Card 6: Total course */}
              <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-700">6. Total Course</p>
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 grid place-items-center">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-4 text-4xl font-extrabold text-pink-950">{courses.length}</p>
                <p className="text-[11px] text-pink-600 font-medium mt-2">Published & draft course modules</p>
              </div>

            </div>

            {/* Quick Quick Access Table Preview */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-extrabold text-base text-slate-800">Recent User Registrations & Roles</h4>
                <button onClick={() => setActiveMenu('Users')} className="text-xs font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">
                  View All Users <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-4 rounded-l-xl">User Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Assigned Roles</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center rounded-r-xl">Joined On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                    {systemUsers.slice(0, 5).map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(u.roles) ? u.roles : [u.role || 'Student']).map((r, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                r === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                r === 'Test Creator' ? 'bg-pink-100 text-pink-800' :
                                r === 'Instructor' ? 'bg-blue-100 text-blue-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            u.userStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.userStatus === 'Active' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                            {u.userStatus || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-gray-500">{u.addedOn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: USERS MODULE (MULTI-ROLE & ACTIVE/INACTIVE STATUS) */}
        {activeMenu === 'Users' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">User Management</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">Assign multiple roles per single user and manage Active/Inactive statuses.</p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search user name, email, role..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full rounded-full border border-gray-200 pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <button
                  onClick={handleOpenAddUser}
                  className="py-2.5 px-4 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-200 font-extrabold">
                    <th className="py-3.5 px-4 rounded-l-xl">User Profile</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Multiple Roles</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Added Date</th>
                    <th className="py-3.5 px-4 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-slate-700 font-medium">
                  {filteredUsersList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-400 font-semibold">
                        No users found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsersList.map((userItem) => {
                      const userRolesList = Array.isArray(userItem.roles) ? userItem.roles : [userItem.role || 'Student'];
                      const isActive = userItem.userStatus === 'Active';

                      return (
                        <tr key={userItem.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-extrabold text-xs grid place-items-center border border-purple-200">
                                {userItem.name[0]}
                              </div>
                              <span>{userItem.name}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-gray-500 font-mono text-[11px]">{userItem.email}</td>

                          {/* Multi-Role Badges */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {userRolesList.map((r, rIdx) => (
                                <span 
                                  key={rIdx} 
                                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${
                                    r === 'Admin' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                    r === 'Test Creator' ? 'bg-pink-50 text-pink-800 border-pink-200' :
                                    r === 'Instructor' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                    'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  }`}
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Active / Inactive Status + Toggle */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                                isActive ? 'bg-green-50 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                {isActive ? 'Active' : 'Inactive'}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  toggleUserStatus(userItem.id);
                                  showToast(`Status updated for ${userItem.name}!`);
                                }}
                                className="text-[10px] font-bold text-purple-700 hover:text-purple-900 hover:underline px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                                title="Click to toggle Active/Inactive status"
                              >
                                Toggle
                              </button>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center text-gray-500">{userItem.addedOn}</td>

                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => handleOpenEditUser(userItem)}
                                className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                                title="Edit User & Roles"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete user "${userItem.name}"?`)) {
                                    deleteSystemUser(userItem.id);
                                    showToast("User deleted successfully!");
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VIEW 3: ROLES & PERMISSIONS MATRIX */}
        {activeMenu === 'Roles & Permissions' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Roles & Permissions Matrix</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">Configure permission matrix rules across system roles.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleResetPermissions}
                  className="rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Matrix
                </button>
                <button 
                  onClick={handleSavePermissions}
                  className="rounded-2xl bg-purple-900 hover:bg-purple-950 text-white px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 shadow-md shadow-purple-900/20 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Permissions
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 min-w-[220px]">Role Name & Description</th>
                    {PERMISSION_COLUMNS.map((perm) => (
                      <th key={perm.key} className="py-4 px-4 text-center min-w-[100px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <span>{perm.label}</span>
                          <span className="text-[9px] text-purple-200 font-normal lowercase">{perm.desc}</span>
                        </div>
                      </th>
                    ))}
                    <th className="py-4 px-4 text-center min-w-[100px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {rolePermissions.map((roleItem) => (
                    <tr key={roleItem.role} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl grid place-items-center font-bold text-sm ${roleItem.color}`}>
                            {roleItem.icon}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{roleItem.role}</h4>
                            <p className="text-xs text-gray-500 font-normal">{roleItem.description}</p>
                          </div>
                        </div>
                      </td>

                      {PERMISSION_COLUMNS.map((perm) => {
                        const isChecked = !!roleItem.rights[perm.key];
                        return (
                          <td key={perm.key} className="py-4 px-4 text-center">
                            <label className="inline-flex items-center justify-center cursor-pointer p-2 rounded-xl hover:bg-purple-100/50 transition-all">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(roleItem.role, perm.key)}
                                className="w-5 h-5 rounded-md border-2 border-gray-300 text-purple-700 focus:ring-purple-500 cursor-pointer accent-purple-700 transition-all"
                              />
                            </label>
                          </td>
                        );
                      })}

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleRow(roleItem.role)}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          Toggle All
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VIEW 4: ALL TESTS MODULE (FULL FUNCTIONALITY) */}
        {activeMenu === 'All Tests' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Assessments Management</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">View, preview, edit, or remove tests created across the portal.</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search tests..."
                    value={searchTest}
                    onChange={(e) => setSearchTest(e.target.value)}
                    className="w-full rounded-full border border-gray-200 pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                  <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <button
                  onClick={handleOpenCreateTest}
                  className="py-2.5 px-4 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Test
                </button>
              </div>
            </div>

            {/* Tests Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-200 font-extrabold">
                    <th className="py-3.5 px-4 rounded-l-xl">Test Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-center">Frequency</th>
                    <th className="py-3.5 px-4 text-center">Questions</th>
                    <th className="py-3.5 px-4 text-center">Attempts</th>
                    <th className="py-3.5 px-4 text-center">Duration</th>
                    <th className="py-3.5 px-4 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-slate-700 font-medium">
                  {tests.filter(t => t.title.toLowerCase().includes(searchTest.toLowerCase())).map((t) => (
                    <tr key={t.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-700" />
                          <span>{t.title}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">
                          {t.category || 'Software Engineering'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gray-100 text-gray-700 uppercase">
                          {t.frequencyType || 'One-Time'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-purple-800">{t.questions?.length || 0} Qs</td>
                      <td className="py-4 px-4 text-center font-bold text-gray-700">{t.attemptsAllowed || 1}</td>
                      <td className="py-4 px-4 text-center text-gray-500">{t.duration} mins</td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => { setPreviewTest(t); setShowPreviewModal(true); }}
                            className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors cursor-pointer"
                            title="Preview Test"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditTest(t)}
                            className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                            title="Edit Test Settings"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete test "${t.title}"?`)) {
                                deleteTest(t.id);
                                showToast("Test deleted successfully!");
                              }
                            }}
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Delete Test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* VIEW 5: COHORT MODULE (FULL FUNCTIONALITY) */}
        {activeMenu === 'Cohort' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Cohort & Student Batches</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">Create cohorts and assign students to learning batches.</p>
              </div>

              <button
                onClick={() => setShowCohortModal(true)}
                className="py-2.5 px-4 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" /> Create Cohort
              </button>
            </div>

            {/* Cohorts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cohorts.map((cohort) => (
                <div key={cohort.id} className="bg-purple-50/50 rounded-3xl p-6 border border-purple-100 flex flex-col justify-between gap-4 shadow-xs">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-display font-extrabold text-base text-slate-900">{cohort.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-100 text-green-800">
                        {cohort.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{cohort.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-purple-100">
                    <span className="font-bold text-purple-900">{cohort.totalStudents || 0} Students</span>
                    <button
                      onClick={() => {
                        setSelectedCohortForStudent(cohort);
                        setShowAddStudentModal(true);
                      }}
                      className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Add Student
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 6: COURSES MODULE (FULL FUNCTIONALITY) */}
        {activeMenu === 'Courses' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Courses & Curriculums</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">Manage course offerings and learning tracks.</p>
              </div>

              <button
                onClick={handleOpenCreateCourse}
                className="py-2.5 px-4 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Course
              </button>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-200 font-extrabold">
                    <th className="py-3.5 px-4 rounded-l-xl">Course Title</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-center">Duration</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-slate-700 font-medium">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">{course.title}</td>
                      <td className="py-4 px-4 text-gray-500 max-w-xs truncate">{course.description}</td>
                      <td className="py-4 px-4 text-center text-gray-600">{course.duration} hrs</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCourse(course)}
                            className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete course "${course.title}"?`)) {
                                deleteCourse(course.id);
                                showToast("Course deleted!");
                              }
                            }}
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* VIEW 7: RESULTS & EVALUATION MODULE (FULL FUNCTIONALITY) */}
        {activeMenu === 'Results' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Student Results & Evaluation</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">Review student test submissions and perform short-answer evaluations.</p>
              </div>
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search student or test title..."
                  value={searchResult}
                  onChange={(e) => setSearchResult(e.target.value)}
                  className="w-full rounded-full border border-gray-200 pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-200 font-extrabold">
                    <th className="py-3.5 px-4 rounded-l-xl">Student Name</th>
                    <th className="py-3.5 px-4">Test Title</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4 text-center">Percentage</th>
                    <th className="py-3.5 px-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-slate-700 font-medium">
                  {studentResults.filter(s => s.name.toLowerCase().includes(searchResult.toLowerCase()) || s.testTitle.toLowerCase().includes(searchResult.toLowerCase())).map((sub) => (
                    <tr key={sub.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-4 px-4 text-gray-600">{sub.testTitle}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          sub.status === 'Completed' || sub.status === 'Graded & Corrected' ? 'bg-green-100 text-green-800' :
                          sub.status === 'Needs Correction' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-purple-900">{sub.score} / {sub.totalQs}</td>
                      <td className="py-4 px-4 text-center font-bold text-pink-600">{sub.percentage}%</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleOpenEvaluationModal(sub)}
                          className="py-1.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Grade / Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VIEW 8: SETTINGS MODULE (FULL FUNCTIONALITY) */}
        {activeMenu === 'Settings' && (
          <section className="bg-white rounded-3xl p-8 shadow-xs border border-gray-150 flex flex-col gap-6 animate-fade-in max-w-3xl">
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-900">Platform Settings</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">Configure global portal parameters and evaluation rules.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">Portal Display Title</label>
                <input
                  type="text"
                  value={platformTitle}
                  onChange={(e) => setPlatformTitle(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">Auto-Pass Score Threshold (%)</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={autoGradingThreshold}
                  onChange={(e) => setAutoGradingThreshold(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Email Submission Notifications</h4>
                  <p className="text-[10px] text-gray-500">Send instant alerts when students complete a test.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 accent-purple-700 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 border border-red-100">
                <div>
                  <h4 className="font-bold text-xs text-red-900">Maintenance Mode</h4>
                  <p className="text-[10px] text-red-600">Temporarily block student test logins for maintenance.</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer w-fit"
              >
                Save Portal Settings
              </button>
            </form>
          </section>
        )}

      </main>

      {/* --- MODAL 1: ADD / EDIT USER MODAL (MULTI-ROLE & STATUS) --- */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in py-10">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                {editingUserId ? 'Edit User & Roles' : 'Add New System User'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">User Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {/* Multi-Role Checkbox Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Assign Multiple Roles</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_AVAILABLE_ROLES.map((roleName) => {
                    const isSelected = selectedUserRoles.includes(roleName);
                    return (
                      <label
                        key={roleName}
                        onClick={() => handleToggleRoleSelection(roleName)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer select-none transition-all ${
                          isSelected
                            ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-purple-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // Handled by container onClick
                          className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                        />
                        <span>{roleName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Account Status</label>
                <select
                  value={userStatusState}
                  onChange={(e) => setUserStatusState(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="py-2 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-purple-900 text-white font-bold text-xs shadow-md hover:bg-purple-950 cursor-pointer"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CREATE / EDIT TEST DIALOG MODAL --- */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto py-10 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0 bg-gray-50/50">
              <h3 className="font-display font-extrabold text-xl text-slate-900">
                {isEditingTest ? 'Edit Assessment Settings' : 'Create New Assessment'}
              </h3>
              <button 
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Test Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Advanced SQL Engineering" 
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700"
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
                    className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Test Description</label>
                <textarea 
                  rows="2"
                  placeholder="Provide test scope description..."
                  value={testDesc}
                  onChange={(e) => setTestDesc(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 resize-none"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Test Category (Grouping Domain)</label>
                <select 
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 bg-white"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Database Systems">Database Systems</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="QA & Testing">QA & Testing</option>
                  <option value="Custom">Custom Category...</option>
                </select>
              </div>

              {/* Delivery Rules */}
              <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100 flex flex-col gap-3">
                <label className="text-xs font-extrabold text-purple-900 uppercase">Delivery & Attempts Rules</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">No. of Attempts</label>
                    <select
                      value={testAttemptsAllowed}
                      onChange={(e) => setTestAttemptsAllowed(e.target.value)}
                      className="py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700"
                    >
                      <option value="1">1 Attempt</option>
                      <option value="2">2 Attempts</option>
                      <option value="3">3 Attempts</option>
                      <option value="5">5 Attempts</option>
                      <option value="Unlimited">Unlimited Attempts</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      checked={testShuffleQuestions}
                      onChange={(e) => setTestShuffleQuestions(e.target.checked)}
                      className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-gray-700">Shuffle Questions</span>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      checked={testRandomizeQuestions}
                      onChange={(e) => setTestRandomizeQuestions(e.target.checked)}
                      className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-gray-700">Randomize Order</span>
                  </div>
                </div>
              </div>

              {/* Question Setup */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase">Questions List ({testQuestions.length})</h4>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleAddQuestionItem('mcq')} className="py-1 px-2.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg">+ MCQ</button>
                    <button type="button" onClick={() => handleAddQuestionItem('short_ans')} className="py-1 px-2.5 bg-pink-50 text-pink-700 text-xs font-bold rounded-lg">+ Short Ans</button>
                  </div>
                </div>

                {testQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-purple-900">Q{qIdx + 1}. Type: {q.type.toUpperCase()}</span>
                      <button type="button" onClick={() => handleRemoveQuestionItem(qIdx)} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Enter question text..."
                      value={q.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTestQuestions(prev => prev.map((item, i) => i === qIdx ? { ...item, text: val } : item));
                      }}
                      className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
                    />

                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => (
                          <input
                            key={optIdx}
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                            value={opt}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTestQuestions(prev => prev.map((item, i) => {
                                if (i === qIdx) {
                                  const opts = [...item.options];
                                  opts[optIdx] = val;
                                  return { ...item, options: opts };
                                }
                                return item;
                              }));
                            }}
                            className="py-1.5 px-3 rounded-lg border border-gray-200 text-xs bg-white"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 shrink-0">
                <button type="button" onClick={() => setShowFormModal(false)} className="py-2 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">Cancel</button>
                <button type="submit" className="py-2 px-6 rounded-xl bg-purple-900 text-white font-bold text-xs shadow-md">Save Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CREATE COHORT MODAL --- */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 flex flex-col gap-4 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900">Create New Cohort</h3>
              <button onClick={() => setShowCohortModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateCohort} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Cohort Batch Name</label>
                <input type="text" required placeholder="e.g. Full-Stack Web Dev 2026-B" value={newCohortName} onChange={(e) => setNewCohortName(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-semibold" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                <textarea rows="2" placeholder="Cohort details..." value={newCohortDesc} onChange={(e) => setNewCohortDesc(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-medium resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowCohortModal(false)} className="py-2 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">Cancel</button>
                <button type="submit" className="py-2 px-5 rounded-xl bg-purple-900 text-white font-bold text-xs">Create Cohort</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ADD STUDENT TO COHORT MODAL --- */}
      {showAddStudentModal && selectedCohortForStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 flex flex-col gap-4 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900">Add Student to "{selectedCohortForStudent.name}"</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddStudentSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Student Name</label>
                <input type="text" required placeholder="Student full name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-semibold" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                <input type="email" required placeholder="student@example.com" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-semibold" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="py-2 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">Cancel</button>
                <button type="submit" className="py-2 px-5 rounded-xl bg-purple-900 text-white font-bold text-xs">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: CREATE / EDIT COURSE MODAL --- */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 flex flex-col gap-4 border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-display font-extrabold text-base text-slate-900">{isEditingCourse ? 'Edit Course' : 'Create New Course'}</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCourse} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Course Title</label>
                <input type="text" required placeholder="Course title..." value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-semibold" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                <textarea rows="2" placeholder="Course description..." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-medium resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Duration (Hours)</label>
                  <input type="number" min="1" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} className="py-2 px-3 rounded-xl border border-gray-250 text-xs font-semibold" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                  <select value={courseStatus} onChange={(e) => setCourseStatus(e.target.value)} className="py-2 px-3 bg-white border border-gray-250 rounded-xl text-xs font-semibold">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowCourseModal(false)} className="py-2 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">Cancel</button>
                <button type="submit" className="py-2 px-5 rounded-xl bg-purple-900 text-white font-bold text-xs">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6: EVALUATE & GRADE SUBMISSION MODAL --- */}
      {selectedCorrectionSubmission && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in py-10">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Grade Test Submission</h3>
                <p className="text-xs text-gray-500 font-semibold">{selectedCorrectionSubmission.name} • {selectedCorrectionSubmission.testTitle}</p>
              </div>
              <button onClick={() => setSelectedCorrectionSubmission(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              {(() => {
                const testObj = tests.find(t => t.id === selectedCorrectionSubmission.testId || t.title === selectedCorrectionSubmission.testTitle);
                const questions = testObj?.questions || [];

                return questions.map((q, qIdx) => {
                  const studentAns = selectedCorrectionSubmission.answers?.[qIdx];

                  return (
                    <div key={qIdx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-2">
                      <h4 className="font-bold text-xs text-slate-900">Q{qIdx + 1}. {q.text}</h4>
                      
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Student Answer:</span>
                        <p className="font-medium text-slate-800">{studentAns !== undefined ? (typeof studentAns === 'number' ? `Option ${String.fromCharCode(65 + studentAns)}` : studentAns) : 'No answer provided'}</p>
                      </div>

                      {q.type === 'short_ans' && (
                        <div className="flex items-center gap-3 pt-2">
                          <label className="text-xs font-bold text-purple-900">Points Awarded:</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max={q.maxMarks || 5}
                            value={localCorrections[qIdx]?.points !== undefined ? localCorrections[qIdx].points : ''}
                            onChange={(e) => {
                              const pts = parseFloat(e.target.value) || 0;
                              setLocalCorrections(prev => ({
                                ...prev,
                                [qIdx]: { mark: pts > 0 ? 'full' : 'zero', points: pts }
                              }));
                            }}
                            className="w-20 py-1 px-3 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                          />
                          <span className="text-xs text-gray-400 font-bold">/ {q.maxMarks || 5} max</span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 shrink-0 bg-gray-50">
              <button onClick={() => setSelectedCorrectionSubmission(null)} className="py-2 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600">Cancel</button>
              <button onClick={() => handleGradeSubmissionSubmit(selectedCorrectionSubmission.id)} className="py-2 px-5 rounded-xl bg-purple-900 text-white font-bold text-xs shadow-md">Submit Evaluation</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 7: PREVIEW TEST MODAL --- */}
      {showPreviewModal && previewTest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in py-10">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900">Preview: {previewTest.title}</h3>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">{previewTest.category}</span>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              {previewTest.questions?.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col gap-2 text-xs">
                  <h4 className="font-bold text-slate-900">Q{idx + 1}. {q.text}</h4>
                  {q.type === 'mcq' && q.options && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-2 rounded-lg border ${oIdx === q.correctAnswer ? 'bg-green-50 border-green-300 font-bold text-green-800' : 'bg-white border-gray-200'}`}>
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.sampleAnswer && (
                    <p className="text-purple-700 font-semibold bg-purple-50 p-2 rounded-lg">Key: {q.sampleAnswer}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50">
              <button onClick={() => setShowPreviewModal(false)} className="py-2 px-5 rounded-xl bg-purple-900 text-white font-bold text-xs">Close Preview</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
