import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, List, LayoutDashboard, FileSpreadsheet, Users, 
  Settings as SettingsIcon, LogOut, Eye, Edit2, Trash2, Search, Plus, 
  Trash, X, Clock, HelpCircle, Check, FileText, Code, Image as ImageIcon,
  BarChart3, PieChart, Sparkles, UserPlus, FolderPlus, Download, Award, Target, ArrowRight, ShieldCheck,
  Upload, FileUp, Calendar, CheckSquare, CheckCircle2, XCircle, ArrowLeft, Table, LayoutList, ChevronLeft, ChevronRight, Filter,
  UserMinus, History, RotateCcw, GripVertical
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
    gradeStudentSubmission,
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
  // Tab State: 'overview', 'tests', 'students', 'cohorts', 'analytics', 'settings'
  const [activeTab, setActiveTab] = useState('overview');

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

  // Schedule & Recurrence Category state
  const [scheduleType, setScheduleType] = useState('one_time'); // 'one_time', 'weekly', 'monthly'
  const [selectedWeeklyDays, setSelectedWeeklyDays] = useState(['Mon']);
  const [monthlyMonth, setMonthlyMonth] = useState('August');
  const [monthlyDate, setMonthlyDate] = useState('15');
  const [monthlyYear, setMonthlyYear] = useState('2026');

  // Hidden File Input Ref for Import
  const fileInputRef = useRef(null);
  
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

  // Test Correction State & Logic
  const [selectedCorrectionSubmissionId, setSelectedCorrectionSubmissionId] = useState(null);
  const [correctionFilterTest, setCorrectionFilterTest] = useState('All');
  const [correctionFilterStatus, setCorrectionFilterStatus] = useState('All');
  const [correctionSearch, setCorrectionSearch] = useState('');
  const [localCorrections, setLocalCorrections] = useState({});

  // User requirement features: Short Ans Focus, View Mode (Single Paged vs Table), Question Page, and All Tests Table Mode
  const [onlyShortAns, setOnlyShortAns] = useState(true);
  const [correctionViewLayout, setCorrectionViewLayout] = useState('table'); // 'table' (5 questions per card page) or 'single'
  const [correctionQuestionPage, setCorrectionQuestionPage] = useState(1);
  const [showAllTestsView, setShowAllTestsView] = useState(true); // Default to All Tests Overview with pagination
  const [allTestsPage, setAllTestsPage] = useState(1);
  const [correctionTestsPerPage, setCorrectionTestsPerPage] = useState(5); // Default 5 tests per page
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState(5); // Default 5 questions per card page
  const [questionChunkPage, setQuestionChunkPage] = useState(1);
  const [activeEvaluatingUser, setActiveEvaluatingUser] = useState(null); // Separate section view for selected student
  const [selectedResultTestGroup, setSelectedResultTestGroup] = useState('All'); // 'All' or specific testId
  const [expandedResultTests, setExpandedResultTests] = useState({}); // accordion expand state per test
  const [resultsSelectedTest, setResultsSelectedTest] = useState(null); // Selected test for Results page
  const [resultsTestsPage, setResultsTestsPage] = useState(1); // Page for tests table in Results
  const [resultsUsersPage, setResultsUsersPage] = useState(1); // Page for users table in Results

  // Cohort & Users Pool Management States
  const [showUsersPoolModal, setShowUsersPoolModal] = useState(false);
  const [showDeletedUsersModal, setShowDeletedUsersModal] = useState(false);
  const [showCohortMembersModal, setShowCohortMembersModal] = useState(null); // cohort object or null
  const [targetCohortForPool, setTargetCohortForPool] = useState(null); // cohort object for UserPlus icon click
  const [selectedPoolUserIds, setSelectedPoolUserIds] = useState([]);
  const [draggedUser, setDraggedUser] = useState(null);
  const [cohortViewMode, setCohortViewMode] = useState('split'); // 'split' (Interactive Drag & Drop Studio) or 'table'
  const [dragOverCohortId, setDragOverCohortId] = useState(null); // active hovered cohort ID during drag

  // Demo state for Users Pool
  const [usersPool, setUsersPool] = useState([
    { id: 'pool-1', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', role: 'Full-Stack Developer', joinedOn: '01 Aug 2026' },
    { id: 'pool-2', name: 'Ananya Gupta', email: 'ananya.g@example.com', role: 'Data Analyst', joinedOn: '02 Aug 2026' },
    { id: 'pool-3', name: 'Devendra Rao', email: 'dev.rao@example.com', role: 'Frontend Engineer', joinedOn: '03 Aug 2026' },
    { id: 'pool-4', name: 'Ishita Roy', email: 'ishita.roy@example.com', role: 'Backend Engineer', joinedOn: '04 Aug 2026' },
    { id: 'pool-5', name: 'Kabir Varma', email: 'kabir.v@example.com', role: 'UI/UX Designer', joinedOn: '05 Aug 2026' },
    { id: 'pool-6', name: 'Neha Chawla', email: 'neha.c@example.com', role: 'Cloud Engineer', joinedOn: '05 Aug 2026' },
    { id: 'pool-7', name: 'Rohan Deshmukh', email: 'rohan.d@example.com', role: 'DevOps Specialist', joinedOn: '05 Aug 2026' }
  ]);

  // Demo state for Deleted Users History
  const [deletedUsersHistory, setDeletedUsersHistory] = useState([
    { id: 'del-1', name: 'Vikramaditya Joshi', email: 'vikram.j@example.com', formerCohort: 'Full-Stack Web Dev 2026-A', deletedOn: '04 Aug 2026', deletedBy: 'Admin' },
    { id: 'del-2', name: 'Siddharth Roy', email: 'siddharth.r@example.com', formerCohort: 'Data Science & Backend Batch', deletedOn: '02 Aug 2026', deletedBy: 'Course Creator' }
  ]);

  // Handlers for Cohort & Users Pool
  const handleBulkAssignPoolUsers = (targetCohortId) => {
    if (!targetCohortId || selectedPoolUserIds.length === 0) return;
    const targetCohortObj = cohorts.find(c => c.id === targetCohortId);
    const usersToMove = usersPool.filter(u => selectedPoolUserIds.includes(u.id));

    usersToMove.forEach(u => {
      addStudentToCohort(targetCohortId, u.name, u.email);
    });

    setUsersPool(prev => prev.filter(u => !selectedPoolUserIds.includes(u.id)));
    setSelectedPoolUserIds([]);
    showToast(`Successfully assigned ${usersToMove.length} users to "${targetCohortObj?.name}"!`);
  };

  const handleDragStartUser = (e, userItem) => {
    setDraggedUser(userItem);
    e.dataTransfer.setData('text/plain', JSON.stringify(userItem));
  };

  const handleDropOnCohortRow = (e, cohortObj) => {
    e.preventDefault();
    setDragOverCohortId(null);

    // Check if we have bulk selected users
    if (selectedPoolUserIds.length > 0) {
      const usersToMove = usersPool.filter(u => selectedPoolUserIds.includes(u.id));
      usersToMove.forEach(u => {
        addStudentToCohort(cohortObj.id, u.name, u.email);
      });
      setUsersPool(prev => prev.filter(u => !selectedPoolUserIds.includes(u.id)));
      setSelectedPoolUserIds([]);
      setDraggedUser(null);
      showToast(`🎯 Dropped & assigned ${usersToMove.length} selected users to "${cohortObj.name}"!`);
      return;
    }

    let userToAssign = draggedUser;
    if (!userToAssign) {
      try {
        userToAssign = JSON.parse(e.dataTransfer.getData('text/plain'));
      } catch (err) {}
    }
    if (!userToAssign) return;

    addStudentToCohort(cohortObj.id, userToAssign.name, userToAssign.email);
    setUsersPool(prev => prev.filter(u => u.id !== userToAssign.id));
    setDraggedUser(null);
    showToast(`🎯 Dropped & assigned "${userToAssign.name}" to "${cohortObj.name}"!`);
  };

  const handleDeleteStudentFromCohort = (cohortObj, studentItem) => {
    if (!confirm(`Are you sure you want to remove "${studentItem.name}" from "${cohortObj.name}"?`)) return;
    
    // Add to Deleted Users History Audit Log
    const deletedEntry = {
      id: `del-${Date.now()}`,
      name: studentItem.name,
      email: studentItem.email || `${studentItem.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      formerCohort: cohortObj.name,
      formerCohortId: cohortObj.id,
      deletedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      deletedBy: user?.name || 'Course Creator'
    };

    setDeletedUsersHistory(prev => [deletedEntry, ...prev]);

    // Remove student from cohort in AppContext
    if (cohortObj.students) {
      cohortObj.students = cohortObj.students.filter(s => s.id !== studentItem.id);
      cohortObj.totalStudents = Math.max(0, cohortObj.totalStudents - 1);
    }
    showToast(`Removed "${studentItem.name}" and recorded in Deleted Users History.`);
  };

  const handleRestoreDeletedUser = (delUser) => {
    setUsersPool(prev => [
      { id: `pool-${Date.now()}`, name: delUser.name, email: delUser.email, role: 'Restored User', joinedOn: 'Today' },
      ...prev
    ]);
    setDeletedUsersHistory(prev => prev.filter(d => d.id !== delUser.id));
    showToast(`Restored "${delUser.name}" back to Users Pool!`);
  };

  // Helper: Match test robustly
  const matchesSelectedTest = (sub) => {
    if (!sub) return false;
    if (correctionFilterTest === 'All' || correctionFilterTest === 'all_tests_overview') return true;
    if (sub.testId === correctionFilterTest) return true;
    const testObj = tests.find(t => t?.id === correctionFilterTest);
    const targetTitle = ((testObj?.title) || correctionFilterTest || '').toLowerCase();
    const subTitle = (sub.testTitle || '').toLowerCase();
    return subTitle.includes(targetTitle) || targetTitle.includes(subTitle);
  };

  // Filtered submissions for Test Correction
  const filteredCorrectionSubmissions = studentResults.filter(sub => {
    if (!sub) return false;
    const matchesTest = matchesSelectedTest(sub);
    const matchesStatus = correctionFilterStatus === 'All' ? true : sub.status === correctionFilterStatus;
    const subName = (sub.name || '').toLowerCase();
    const subTitle = (sub.testTitle || '').toLowerCase();
    const qSearch = (correctionSearch || '').toLowerCase();
    const matchesSearch = subName.includes(qSearch) || subTitle.includes(qSearch);
    return matchesTest && matchesStatus && matchesSearch;
  });

  // Selected Submission
  const selectedSubmission = activeEvaluatingUser || studentResults.find(s => s.id === selectedCorrectionSubmissionId) || filteredCorrectionSubmissions[0] || null;

  // Selected Submission Test Definition
  const selectedSubmissionTest = selectedSubmission 
    ? tests.find(t => t.id === selectedSubmission.testId || t.title === selectedSubmission.testTitle || selectedSubmission.testTitle?.includes(t.title)) || tests[0]
    : null;

  // Handle Select Submission for correction
  const handleSelectCorrectionSubmission = (sub) => {
    if (!sub) return;
    setSelectedCorrectionSubmissionId(sub.id);
    setActiveEvaluatingUser(sub);
    setCorrectionQuestionPage(1);
    setQuestionChunkPage(1);
    
    // Find test
    const matchedTest = tests.find(t => t.id === sub.testId || t.title === sub.testTitle || sub.testTitle?.includes(t.title)) || tests[0];
    
    // Initialise localCorrections state for short ans questions from existing submission corrections
    const initialLocal = {};
    matchedTest?.questions?.forEach((q, idx) => {
      const qMax = q.maxMarks || (q.type === 'short_ans' ? 5 : 1);
      if (q.type === 'short_ans') {
        const existing = sub.corrections?.[idx] || sub.corrections?.[q.id];
        initialLocal[idx] = {
          mark: existing?.mark || (sub.status === 'Graded & Corrected' ? 'full' : 'pending'),
          points: existing?.points !== undefined ? existing.points : (sub.status === 'Completed' || sub.status === 'Graded & Corrected' ? qMax : 0.0),
          feedback: existing?.feedback || ''
        };
      }
    });
    setLocalCorrections(initialLocal);
  };

  // Update question correction state
  const handleUpdateQuestionCorrection = (qIdx, markType, pointsVal) => {
    setLocalCorrections(prev => ({
      ...prev,
      [qIdx]: {
        ...(prev[qIdx] || {}),
        mark: markType,
        points: pointsVal
      }
    }));
  };

  const handleUpdateFeedback = (qIdx, feedbackText) => {
    setLocalCorrections(prev => ({
      ...prev,
      [qIdx]: {
        ...(prev[qIdx] || {}),
        feedback: feedbackText
      }
    }));
  };

  // Compute calculated score & max score for selected submission dynamically
  let calculatedCurrentScore = 0;
  let calculatedMaxScore = 0;
  if (selectedSubmissionTest && selectedSubmission) {
    selectedSubmissionTest.questions?.forEach((q, idx) => {
      const qMax = q.maxMarks || (q.type === 'short_ans' ? 5 : 1);
      calculatedMaxScore += qMax;
      if (q.type === 'short_ans') {
        calculatedCurrentScore += (localCorrections[idx]?.points !== undefined ? localCorrections[idx].points : 0);
      } else {
        const studentAns = selectedSubmission.answers?.[idx] ?? selectedSubmission.answers?.[q.id];
        if (studentAns !== null && studentAns === q.correctAnswer) {
          calculatedCurrentScore += qMax;
        }
      }
    });
  }
  const calculatedCurrentPercentage = calculatedMaxScore > 0 ? Math.round((calculatedCurrentScore / calculatedMaxScore) * 100) : 0;

  // Filter questions according to onlyShortAns toggle for selected test
  const allQuestions = selectedSubmissionTest?.questions || [];
  const displayQuestions = onlyShortAns 
    ? allQuestions.filter(q => q && q.type === 'short_ans')
    : allQuestions;

  // Save correction
  const handleSaveCorrection = () => {
    if (!selectedSubmission) return;
    gradeStudentSubmission(
      selectedSubmission.id,
      localCorrections,
      calculatedCurrentScore,
      calculatedCurrentPercentage,
      'Graded & Corrected'
    );
    showToast(`Test correction saved for ${selectedSubmission.name}! Final score: ${calculatedCurrentScore}/${calculatedMaxScore} (${calculatedCurrentPercentage}%)`);
    setActiveEvaluatingUser(null);
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

  // Dynamic Options Count Manager
  const handleSetOptionCount = (qIdx, count) => {
    setTestQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const currentOpts = q.options || ['', '', '', ''];
      let nextOpts = [...currentOpts];
      if (count > currentOpts.length) {
        while (nextOpts.length < count) {
          nextOpts.push('');
        }
      } else if (count < currentOpts.length) {
        nextOpts = nextOpts.slice(0, Math.max(2, count));
      }
      let nextCorrect = q.correctAnswer || 0;
      if (nextCorrect >= nextOpts.length) {
        nextCorrect = nextOpts.length - 1;
      }
      return { ...q, options: nextOpts, correctAnswer: nextCorrect };
    }));
  };

  const handleAddOption = (qIdx) => {
    setTestQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const nextOpts = [...(q.options || ['', '', '', '']), ''];
      return { ...q, options: nextOpts };
    }));
  };

  const handleRemoveOption = (qIdx, optIdx) => {
    setTestQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const currentOpts = q.options || ['', '', '', ''];
      if (currentOpts.length <= 2) return q;
      const nextOpts = currentOpts.filter((_, idx) => idx !== optIdx);
      let nextCorrect = q.correctAnswer || 0;
      if (nextCorrect >= nextOpts.length) {
        nextCorrect = nextOpts.length - 1;
      }
      return { ...q, options: nextOpts, correctAnswer: nextCorrect };
    }));
  };

  // Import Test Handlers (JSON & CSV & Sample Templates)
  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (parsed.title) setTestTitle(parsed.title);
          if (parsed.description) setTestDesc(parsed.description);
          if (parsed.duration) setTestDuration(parsed.duration.toString());
          if (parsed.scheduleType) setScheduleType(parsed.scheduleType);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            setTestQuestions(parsed.questions.map(q => ({
              type: q.type || 'mcq',
              text: q.text || '',
              options: q.options || ['', '', '', ''],
              correctAnswer: q.correctAnswer || 0,
              sampleAnswer: q.sampleAnswer || '',
              keywords: q.keywords ? (Array.isArray(q.keywords) ? q.keywords.join(', ') : q.keywords) : '',
              codeSnippet: q.codeSnippet || ''
            })));
          }
          showToast("JSON Assessment imported successfully!");
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
          const importedQs = lines.slice(1).map(line => {
            const parts = line.split(',');
            return {
              type: 'mcq',
              text: parts[0] || 'Imported Question Stem',
              options: [parts[1] || 'Option A', parts[2] || 'Option B', parts[3] || 'Option C', parts[4] || 'Option D'],
              correctAnswer: 0
            };
          });
          if (importedQs.length > 0) {
            setTestQuestions(importedQs);
            showToast("CSV Questions imported successfully!");
          }
        }
      } catch (err) {
        alert("Error parsing imported test file. Please check JSON or CSV format.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportSampleTemplate = (templateType) => {
    if (templateType === 'web') {
      setTestTitle("Full-Stack Web Engineering Assessment 2026");
      setTestDesc("Comprehensive test covering React hooks, state architecture, and Node.js REST APIs.");
      setTestDuration("45");
      setTestQuestions([
        {
          type: 'mcq',
          text: 'Which React hook handles side effects after component rendering?',
          options: ['useState', 'useContext', 'useEffect', 'useMemo'],
          correctAnswer: 2
        },
        {
          type: 'short_ans',
          text: 'Explain how Virtual DOM diffing improves rendering performance in React.',
          sampleAnswer: 'React computes minimal differences between Virtual DOM trees and batches updates to the real DOM.',
          keywords: 'diffing, reconciliation, batching, real DOM'
        },
        {
          type: 'embedded',
          text: 'Review the Express middleware snippet below. What does next() execute?',
          codeSnippet: 'app.use((req, res, next) => {\n  console.log("Request Logged");\n  next();\n});'
        }
      ]);
      showToast("Web Engineering Assessment Template Loaded!");
    } else if (templateType === 'python') {
      setTestTitle("Python & Data Science Core Exam");
      setTestDesc("Assessment covering Data Structures, NumPy arrays, Pandas DataFrames, and OOP.");
      setTestDuration("30");
      setTestQuestions([
        {
          type: 'mcq',
          text: 'Which keyword defines a function in Python?',
          options: ['func', 'def', 'function', 'create'],
          correctAnswer: 1
        },
        {
          type: 'mcq',
          text: 'Which Python built-in collection data structure is immutable?',
          options: ['List', 'Dictionary', 'Set', 'Tuple'],
          correctAnswer: 3
        }
      ]);
      showToast("Python Data Science Assessment Template Loaded!");
    }
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
  const filteredStudents = studentResults.filter(student => {
    if (!student) return false;
    const qSearch = (searchStudent || '').toLowerCase();
    const sName = (student.name || '').toLowerCase();
    const sStatus = (student.status || '').toLowerCase();
    const sTitle = (student.testTitle || '').toLowerCase();
    const sCohort = (student.cohort || '').toLowerCase();
    const sTime = (student.timeTaken || '').toLowerCase();

    return sName.includes(qSearch) ||
      sStatus.includes(qSearch) ||
      sTitle.includes(qSearch) ||
      sCohort.includes(qSearch) ||
      sTime.includes(qSearch);
  });

  // Search filtered cohorts list
  const filteredCohorts = cohorts.filter(c => {
    if (!c) return false;
    const qSearch = (searchCohort || '').toLowerCase();
    const cName = (c.name || '').toLowerCase();
    const cDesc = (c.description || '').toLowerCase();
    return cName.includes(qSearch) || cDesc.includes(qSearch);
  });

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
              { name: 'Test Correction', icon: CheckSquare },
              { name: 'Cohort', icon: Users },
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
              
              {!resultsSelectedTest ? (
                /* LEVEL 1: PAGINATED OVERVIEW OF ALL TESTS */
                <div className="flex flex-col gap-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="font-display font-extrabold text-xl text-gray-800">Results & Assessment Performance</h2>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">Select a test from the table below to view all enrolled student users in paginated table form.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                      <input
                        type="text"
                        placeholder="Search test title..."
                        value={searchStudent}
                        onChange={(e) => { setSearchStudent(e.target.value); setResultsTestsPage(1); }}
                        className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
                      />
                      <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Summary Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Submissions</p>
                      <p className="mt-4 text-3xl font-extrabold text-purple-900">{studentResults.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-3xl p-6 border border-green-100 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Passed</p>
                      <p className="mt-4 text-3xl font-extrabold text-green-900">{passedCount}</p>
                    </div>
                    <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Failed</p>
                      <p className="mt-4 text-3xl font-extrabold text-red-900">{failedCount}</p>
                    </div>
                    <div className="bg-purple-900 rounded-3xl p-6 border border-purple-900 shadow-sm text-white">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Average Score</p>
                      <p className="mt-4 text-3xl font-extrabold text-white">{averageScore}%</p>
                    </div>
                  </div>

                  {/* PAGINATED TABLE OF ALL TESTS */}
                  <div className="overflow-x-auto bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
                        Assessments List ({tests.length})
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        Click any test to view all student results
                      </span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                          <th className="py-3.5 px-4 rounded-l-xl">Assessment Title</th>
                          <th className="py-3.5 px-4">Description</th>
                          <th className="py-3.5 px-4 text-center">Questions</th>
                          <th className="py-3.5 px-4 text-center">Enrolled Users</th>
                          <th className="py-3.5 px-4 text-center">Average Score</th>
                          <th className="py-3.5 px-4 text-center rounded-r-xl">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                        {(() => {
                          const tSearch = (searchStudent || '').toLowerCase();
                          const filteredT = tests.filter(t => (t.title || '').toLowerCase().includes(tSearch) || (t.description || '').toLowerCase().includes(tSearch));
                          const tPerPage = 5;
                          const totalTPages = Math.ceil(filteredT.length / tPerPage) || 1;
                          const safeTPage = Math.min(Math.max(1, resultsTestsPage), totalTPages);
                          const pageTests = filteredT.slice((safeTPage - 1) * tPerPage, safeTPage * tPerPage);

                          if (pageTests.length === 0) {
                            return (
                              <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400 font-medium">
                                  No assessments found matching search.
                                </td>
                              </tr>
                            );
                          }

                          return pageTests.map(test => {
                            const testSubs = studentResults.filter(s => s && (s.testId === test.id || (s.testTitle || '').toLowerCase().includes((test.title || '').toLowerCase()) || (test.title || '').toLowerCase().includes((s.testTitle || '').toLowerCase())));
                            const avgScore = testSubs.length > 0 ? Math.round(testSubs.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / testSubs.length) : 0;

                            return (
                              <tr 
                                key={test.id}
                                onClick={() => {
                                  setResultsSelectedTest(test);
                                  setResultsUsersPage(1);
                                }}
                                className="hover:bg-purple-50/50 transition-colors cursor-pointer"
                              >
                                <td className="py-4 px-4 font-bold text-gray-800 text-sm">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-purple-700 shrink-0" />
                                    <span>{test.title}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-gray-500 max-w-xs truncate">{test.description}</td>
                                <td className="py-4 px-4 text-center font-bold text-purple-800">{test.questions?.length || 0} Qs</td>
                                <td className="py-4 px-4 text-center">
                                  <span className="px-3 py-1 bg-purple-100 text-purple-900 font-extrabold rounded-full text-xs">
                                    {testSubs.length} Users
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center font-extrabold text-[#e54e73]">{avgScore}%</td>
                                <td className="py-4 px-4 text-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setResultsSelectedTest(test);
                                      setResultsUsersPage(1);
                                    }}
                                    className="py-2 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
                                  >
                                    <span>View Student Users</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>

                    {/* Tests Pagination Footer */}
                    {(() => {
                      const tSearch = (searchStudent || '').toLowerCase();
                      const filteredT = tests.filter(t => (t.title || '').toLowerCase().includes(tSearch) || (t.description || '').toLowerCase().includes(tSearch));
                      const tPerPage = 5;
                      const totalTPages = Math.ceil(filteredT.length / tPerPage) || 1;

                      if (totalTPages <= 1) return null;

                      return (
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500 font-semibold">
                            Page {resultsTestsPage} of {totalTPages} ({filteredT.length} Tests)
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={resultsTestsPage === 1}
                              onClick={() => setResultsTestsPage(prev => Math.max(1, prev - 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Prev</span>
                            </button>
                            {[...Array(totalTPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setResultsTestsPage(i + 1)}
                                className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  resultsTestsPage === i + 1 ? 'bg-purple-900 text-white shadow-sm' : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button
                              disabled={resultsTestsPage === totalTPages}
                              onClick={() => setResultsTestsPage(prev => Math.min(totalTPages, prev + 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                /* LEVEL 2: PAGINATED TABLE OF ENROLLED STUDENT USERS FOR SELECTED TEST */
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Top Header Bar with Exit Arrow */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setResultsSelectedTest(null)}
                        className="py-2.5 px-4 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-2xl transition-all cursor-pointer flex items-center gap-2 font-bold text-xs shadow-sm hover:scale-102"
                        title="Back to All Tests Table"
                      >
                        <ArrowLeft className="w-4 h-4 text-purple-800" />
                        <span>Exit to All Tests Overview</span>
                      </button>
                      <div>
                        <h2 className="font-display font-extrabold text-xl text-gray-800">
                          Student Users: {resultsSelectedTest.title}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium">Viewing all enrolled student test submissions in paginated table form.</p>
                      </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search student user..."
                        value={searchStudent}
                        onChange={(e) => { setSearchStudent(e.target.value); setResultsUsersPage(1); }}
                        className="py-2.5 pl-3.5 pr-9 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 w-60 bg-gray-50"
                      />
                      <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Test Summary Banner */}
                  {(() => {
                    const testSubs = studentResults.filter(s => s && (s.testId === resultsSelectedTest.id || (s.testTitle || '').toLowerCase().includes((resultsSelectedTest.title || '').toLowerCase()) || (resultsSelectedTest.title || '').toLowerCase().includes((s.testTitle || '').toLowerCase())));
                    const avgScore = testSubs.length > 0 ? Math.round(testSubs.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / testSubs.length) : 0;

                    return (
                      <div className="bg-purple-50/70 rounded-3xl p-6 border border-purple-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="font-display font-extrabold text-lg text-gray-800">{resultsSelectedTest.title}</h3>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{resultsSelectedTest.description}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="px-4 py-2 bg-white text-purple-900 font-extrabold text-xs rounded-2xl border border-purple-200 shadow-xs">
                            {testSubs.length} Enrolled Users
                          </span>
                          <span className="px-4 py-2 bg-green-50 text-green-800 font-extrabold text-xs rounded-2xl border border-green-200 shadow-xs">
                            Avg Score: {avgScore}%
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* PAGINATED STUDENT USERS TABLE */}
                  <div className="overflow-x-auto bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col gap-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                          <th className="py-3.5 px-4 rounded-l-xl">Student User Name</th>
                          <th className="py-3.5 px-4">Cohort</th>
                          <th className="py-3.5 px-4 text-center">Status</th>
                          <th className="py-3.5 px-4 text-center">Score</th>
                          <th className="py-3.5 px-4 text-center">Percentage</th>
                          <th className="py-3.5 px-4 text-center">Time Taken</th>
                          <th className="py-3.5 px-4 text-center">Completed On</th>
                          <th className="py-3.5 px-4 text-center rounded-r-xl">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                        {(() => {
                          const testSubs = studentResults.filter(s => s && (s.testId === resultsSelectedTest.id || (s.testTitle || '').toLowerCase().includes((resultsSelectedTest.title || '').toLowerCase()) || (resultsSelectedTest.title || '').toLowerCase().includes((s.testTitle || '').toLowerCase())));
                          const uSearch = (searchStudent || '').toLowerCase();
                          const filteredU = testSubs.filter(u => (u.name || '').toLowerCase().includes(uSearch) || (u.cohort || '').toLowerCase().includes(uSearch));
                          const uPerPage = 5;
                          const totalUPages = Math.ceil(filteredU.length / uPerPage) || 1;
                          const safeUPage = Math.min(Math.max(1, resultsUsersPage), totalUPages);
                          const pageUsers = filteredU.slice((safeUPage - 1) * uPerPage, safeUPage * uPerPage);

                          if (pageUsers.length === 0) {
                            return (
                              <tr>
                                <td colSpan="8" className="py-8 text-center text-gray-400 font-medium">
                                  No enrolled student user submissions found matching search.
                                </td>
                              </tr>
                            );
                          }

                          return pageUsers.map(student => (
                            <tr key={student.id} className="hover:bg-purple-50/40 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center border border-purple-200 shadow-inner">
                                    {student.name?.[0] || 'U'}
                                  </div>
                                  <span className="font-bold text-gray-800 text-sm">{student.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-purple-700 font-semibold">{student.cohort}</td>
                              <td className="py-4 px-4 text-center">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold ${
                                  student.status === 'Graded & Corrected' || student.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                                  student.status === 'Needs Correction' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' :
                                  student.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700' :
                                  'bg-red-50 text-red-700'
                                }`}>
                                  {student.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-purple-900 text-sm">
                                {student.status === 'Completed' || student.status === 'Needs Correction' || student.status === 'Graded & Corrected' ? `${student.score} / ${student.totalQs}` : '-'}
                              </td>
                              <td className="py-4 px-4 text-center font-extrabold text-[#e54e73] text-sm">{student.percentage}%</td>
                              <td className="py-4 px-4 text-center text-gray-500">{student.timeTaken || '-'}</td>
                              <td className="py-4 px-4 text-center text-gray-500">{student.completedOn}</td>
                              <td className="py-4 px-4 text-center">
                                <button
                                  onClick={() => {
                                    handleSelectCorrectionSubmission(student);
                                    setActiveMenu('Test Correction');
                                    setShowAllTestsView(false);
                                  }}
                                  className="py-2 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>Evaluate Questions</span>
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>

                    {/* Users Pagination Footer */}
                    {(() => {
                      const testSubs = studentResults.filter(s => s && (s.testId === resultsSelectedTest.id || (s.testTitle || '').toLowerCase().includes((resultsSelectedTest.title || '').toLowerCase()) || (resultsSelectedTest.title || '').toLowerCase().includes((s.testTitle || '').toLowerCase())));
                      const uSearch = (searchStudent || '').toLowerCase();
                      const filteredU = testSubs.filter(u => (u.name || '').toLowerCase().includes(uSearch) || (u.cohort || '').toLowerCase().includes(uSearch));
                      const uPerPage = 5;
                      const totalUPages = Math.ceil(filteredU.length / uPerPage) || 1;

                      if (totalUPages <= 1) return null;

                      return (
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500 font-semibold">
                            Page {resultsUsersPage} of {totalUPages} ({filteredU.length} Student Users)
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={resultsUsersPage === 1}
                              onClick={() => setResultsUsersPage(prev => Math.max(1, prev - 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Prev</span>
                            </button>
                            {[...Array(totalUPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setResultsUsersPage(i + 1)}
                                className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  resultsUsersPage === i + 1 ? 'bg-purple-900 text-white shadow-sm' : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button
                              disabled={resultsUsersPage === totalUPages}
                              onClick={() => setResultsUsersPage(prev => Math.min(totalUPages, prev + 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
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
                  <h2 className="font-display font-extrabold text-xl text-gray-800">Cohort Management</h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Groups of students assigned to tests.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-60">
                    <input
                      type="text"
                      placeholder="Search cohort..."
                      value={searchCohort}
                      onChange={(e) => setSearchCohort(e.target.value)}
                      className="w-full py-2.5 pl-4 pr-10 rounded-full border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all text-gray-700 placeholder-gray-400"
                    />
                    <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-gray-400" />
                  </div>

                  {/* Users Pool Button */}
                  <button
                    onClick={() => {
                      setTargetCohortForPool(null);
                      setShowUsersPoolModal(true);
                    }}
                    className="py-2.5 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-purple-200" />
                    <span>Users Pool ({usersPool.length})</span>
                  </button>

                  {/* Deleted Users History Audit Log Button */}
                  <button
                    onClick={() => setShowDeletedUsersModal(true)}
                    className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all border border-gray-200 flex items-center gap-2 cursor-pointer relative"
                  >
                    <History className="w-4 h-4 text-gray-600" />
                    <span>Deleted History</span>
                    {deletedUsersHistory.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-extrabold rounded-full">
                        {deletedUsersHistory.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setShowCohortModal(true)}
                    className="py-2.5 px-4 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-pink-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Create Cohort</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Cohort Groups</p>
                  <p className="mt-4 text-3xl font-extrabold text-purple-900">{cohorts.length}</p>
                </div>
                <div className="bg-green-50 rounded-3xl p-5 border border-green-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Enrolled Students</p>
                  <p className="mt-4 text-3xl font-extrabold text-green-900">{cohorts.reduce((sum, c) => sum + c.totalStudents, 0)}</p>
                </div>
                <div className="bg-purple-900 text-white rounded-3xl p-5 border border-purple-900 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Available Pool Users</p>
                  <p className="mt-4 text-3xl font-extrabold text-white">{usersPool.length}</p>
                </div>
                <div className="bg-red-50 rounded-3xl p-5 border border-red-100 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Deleted Records Log</p>
                  <p className="mt-4 text-3xl font-extrabold text-red-900">{deletedUsersHistory.length}</p>
                </div>
              </div>

              {/* COHORTS TABLE */}
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
                      <tr 
                        key={cohort.id}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnCohortRow(e, cohort)}
                        className="hover:bg-purple-50/40 transition-colors border-l-4 border-transparent hover:border-purple-600"
                      >
                        <td className="py-3.5 px-4 font-bold text-gray-800">
                          <div className="flex items-center gap-2">
                            <span>{cohort.name}</span>
                            {draggedUser && (
                              <span className="text-[9px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 animate-bounce">
                                Drop user here
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-purple-900">{cohort.totalStudents}</td>
                        <td className="py-3.5 px-4 text-gray-500">{cohort.assignedTests?.[0] || 'Unassigned'}</td>
                        <td className="py-3.5 px-4 text-gray-500">{cohort.createdOn}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold ${cohort.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {cohort.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {/* Eye: View Cohort Members */}
                            <button
                              onClick={() => setShowCohortMembersModal(cohort)}
                              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                              title="View Cohort Members"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* UserPlus: Add Users from Pool to this Cohort */}
                            <button
                              onClick={() => {
                                setTargetCohortForPool(cohort);
                                setShowUsersPoolModal(true);
                              }}
                              className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                              title="Add Users from Pool to Cohort"
                            >
                              <UserPlus className="w-4 h-4 text-purple-700" />
                            </button>

                            {/* Edit */}
                            <button
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors cursor-pointer"
                              title="Edit Cohort"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete cohort "${cohort.name}"?`)) deleteCohort(cohort.id);
                              }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                              title="Delete Cohort"
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
          )}          {/* VIEW: TEST CORRECTION */}
          {activeMenu === 'Test Correction' && (
            <section className="bg-white rounded-3xl p-8 shadow-md border border-purple-100/30 flex flex-col gap-8">
              {/* DEFAULT: ALL TESTS TABLE OVERVIEW WITH PAGINATION */}
              {showAllTestsView ? (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Top Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
                          <Table className="w-5 h-5 text-purple-700" />
                        </span>
                        <h2 className="font-display font-extrabold text-xl text-gray-800">All Tests Correction Hub</h2>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Overview of all active assessments, question counts, and student submission corrections.
                      </p>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search test title..."
                        value={correctionSearch}
                        onChange={(e) => {
                          setCorrectionSearch(e.target.value);
                          setAllTestsPage(1);
                        }}
                        className="py-2.5 pl-3.5 pr-9 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 w-60 bg-gray-50/80"
                      />
                      <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* All Tests Table */}
                  <div className="overflow-x-auto bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                          <th className="py-3.5 px-4 rounded-l-xl">Test Title & Description</th>
                          <th className="py-3.5 px-4 text-center">Duration</th>
                          <th className="py-3.5 px-4 text-center">Total Qs</th>
                          <th className="py-3.5 px-4 text-center">Short Ans Qs</th>
                          <th className="py-3.5 px-4 text-center">Submissions</th>
                          <th className="py-3.5 px-4 text-center">Pending Correction</th>
                          <th className="py-3.5 px-4 text-center rounded-r-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                        {(() => {
                          const searchedTests = tests.filter(t => t && (t.title || '').toLowerCase().includes((correctionSearch || '').toLowerCase()));
                          const perPage = correctionTestsPerPage === 'all' ? (searchedTests.length || 1) : correctionTestsPerPage;
                          const totalPages = Math.ceil(searchedTests.length / perPage) || 1;
                          const safePage = Math.min(Math.max(1, allTestsPage), totalPages);
                          const pageTests = searchedTests.slice((safePage - 1) * perPage, safePage * perPage);

                          if (pageTests.length === 0) {
                            return (
                              <tr>
                                <td colSpan="7" className="py-8 text-center text-gray-400 font-medium">
                                  No assessments match your search query.
                                </td>
                              </tr>
                            );
                          }

                          return pageTests.map(test => {
                            const shortAnsCount = (test.questions || []).filter(q => q && q.type === 'short_ans').length;
                            const testSubs = studentResults.filter(s => s && (s.testId === test.id || (s.testTitle || '').toLowerCase().includes((test.title || '').toLowerCase()) || (test.title || '').toLowerCase().includes((s.testTitle || '').toLowerCase())));
                            const pendingCount = testSubs.filter(s => s.status === 'Needs Correction').length;

                            return (
                              <tr key={test.id} className="hover:bg-purple-50/40 transition-colors">
                                <td className="py-4 px-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-sm">{test.title}</span>
                                    <span className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{test.description}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-center text-gray-500 font-bold">{test.duration} mins</td>
                                <td className="py-4 px-4 text-center font-bold text-purple-700">{test.questions?.length || 0}</td>
                                <td className="py-4 px-4 text-center">
                                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px] border border-blue-100">
                                    {shortAnsCount} Short Ans
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center font-bold text-gray-700">{testSubs.length}</td>
                                <td className="py-4 px-4 text-center">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                    pendingCount > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {pendingCount} Pending
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <button
                                    onClick={() => {
                                      setCorrectionFilterTest(test.id);
                                      setShowAllTestsView(false);
                                    }}
                                    className="py-2 px-4 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1.5 justify-center cursor-pointer mx-auto"
                                  >
                                    <CheckSquare className="w-3.5 h-3.5" />
                                    <span>Evaluate Submissions</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>

                    {/* All Tests Pagination Controls */}
                    {(() => {
                      const searchedTests = tests.filter(t => t && (t.title || '').toLowerCase().includes((correctionSearch || '').toLowerCase()));
                      const perPage = correctionTestsPerPage === 'all' ? (searchedTests.length || 1) : correctionTestsPerPage;
                      const totalPages = Math.ceil(searchedTests.length / perPage) || 1;
                      const safePage = Math.min(Math.max(1, allTestsPage), totalPages);
                      const startIdx = (safePage - 1) * perPage + 1;
                      const endIdx = Math.min(safePage * perPage, searchedTests.length);

                      return (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-gray-100 mt-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 font-semibold">
                              Showing {searchedTests.length > 0 ? `${startIdx}-${endIdx}` : '0'} of {searchedTests.length} Assessments
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-gray-400">Page size:</span>
                              <select
                                value={correctionTestsPerPage}
                                onChange={(e) => {
                                  const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
                                  setCorrectionTestsPerPage(val);
                                  setAllTestsPage(1);
                                }}
                                className="py-1 px-2 rounded-lg border border-purple-200 text-xs font-bold text-purple-900 bg-purple-50 focus:outline-none cursor-pointer"
                              >
                                <option value={5}>5 Tests</option>
                                <option value={10}>10 Tests</option>
                                <option value="all">All Tests</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={safePage === 1}
                              onClick={() => setAllTestsPage(prev => Math.max(1, prev - 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Prev</span>
                            </button>

                            {[...Array(totalPages)].map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setAllTestsPage(idx + 1)}
                                className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  safePage === idx + 1
                                    ? 'bg-purple-900 text-white shadow-sm scale-105'
                                    : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
                                }`}
                              >
                                {idx + 1}
                              </button>
                            ))}

                            <button
                              disabled={safePage === totalPages}
                              onClick={() => setAllTestsPage(prev => Math.min(totalPages, prev + 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : !activeEvaluatingUser ? (
                /* SECTION 1: SUBMISSIONS LIST TABLE ONLY (USERS & PAGING ONLY) */
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Top Header Bar with Exit Arrow */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowAllTestsView(true)}
                        className="py-2.5 px-4 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-2xl transition-all cursor-pointer flex items-center gap-2 font-bold text-xs shadow-sm hover:scale-102"
                        title="Back to All Tests Table"
                      >
                        <ArrowLeft className="w-4 h-4 text-purple-800" />
                        <span>Exit to All Tests Overview</span>
                      </button>
                      <div>
                        <h2 className="font-display font-extrabold text-xl text-gray-800">Student Submissions & Evaluation</h2>
                        <p className="text-xs text-gray-400 font-medium">Select a student user from the table below to open their test questions in a separate section.</p>
                      </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search student or test..."
                        value={correctionSearch}
                        onChange={(e) => setCorrectionSearch(e.target.value)}
                        className="py-2 pl-3.5 pr-8 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 w-52 bg-gray-50"
                      />
                      <Search className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>

                  {/* TABULAR SUBMISSIONS TABLE WITH PAGINATION */}
                  <div className="overflow-x-auto bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
                          Submissions List ({filteredCorrectionSubmissions.length})
                        </span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                          {filteredCorrectionSubmissions.filter(s => s.status === 'Needs Correction').length} Pending
                        </span>
                      </div>

                      {/* Status Filter Pill Tabs */}
                      <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                        {['All', 'Needs Correction', 'Graded & Corrected'].map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              setCorrectionFilterStatus(st);
                              setSubmissionsPage(1);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              correctionFilterStatus === st
                                ? 'bg-purple-900 text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                          <th className="py-3.5 px-4 rounded-l-xl">Student Name</th>
                          <th className="py-3.5 px-4">Assessment Title</th>
                          <th className="py-3.5 px-4 text-center">Score</th>
                          <th className="py-3.5 px-4 text-center">Completion Date</th>
                          <th className="py-3.5 px-4 text-center">Status</th>
                          <th className="py-3.5 px-4 text-center rounded-r-xl">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                        {(() => {
                          const subsPerPage = 5;
                          const totalPages = Math.ceil(filteredCorrectionSubmissions.length / subsPerPage) || 1;
                          const safePage = Math.min(Math.max(1, submissionsPage), totalPages);
                          const pageSubs = filteredCorrectionSubmissions.slice((safePage - 1) * subsPerPage, safePage * subsPerPage);

                          if (pageSubs.length === 0) {
                            return (
                              <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-400 font-medium">
                                  No student submissions found matching the criteria.
                                </td>
                              </tr>
                            );
                          }

                          return pageSubs.map(sub => {
                            const isSelected = selectedSubmission?.id === sub.id;
                            const isNeedsCorrection = sub.status === 'Needs Correction';

                            return (
                              <tr 
                                key={sub.id} 
                                onClick={() => handleSelectCorrectionSubmission(sub)}
                                className={`hover:bg-purple-50/40 transition-colors cursor-pointer ${isSelected ? 'bg-purple-50/80 font-bold' : ''}`}
                              >
                                <td className="py-4 px-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-sm">{sub.name}</span>
                                    <span className="text-[11px] text-purple-700">{sub.cohort}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-gray-700 font-semibold max-w-xs truncate">{sub.testTitle}</td>
                                <td className="py-4 px-4 text-center font-extrabold text-purple-900">
                                  {sub.score} / {sub.totalQs} ({sub.percentage}%)
                                </td>
                                <td className="py-4 px-4 text-center text-gray-500">{sub.completedOn}</td>
                                <td className="py-4 px-4 text-center">
                                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                                    isNeedsCorrection
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                                      : 'bg-green-100 text-green-800 border border-green-200'
                                  }`}>
                                    {isNeedsCorrection ? 'Needs Correction' : 'Graded'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectCorrectionSubmission(sub);
                                    }}
                                    className="py-2 px-4 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer"
                                  >
                                    Evaluate Questions
                                  </button>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>

                    {/* Submissions Pagination Footer */}
                    {(() => {
                      const subsPerPage = 5;
                      const totalPages = Math.ceil(filteredCorrectionSubmissions.length / subsPerPage) || 1;

                      if (totalPages <= 1) return null;

                      return (
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500 font-semibold">
                            Page {submissionsPage} of {totalPages} ({filteredCorrectionSubmissions.length} Submissions)
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={submissionsPage === 1}
                              onClick={() => setSubmissionsPage(prev => Math.max(1, prev - 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Prev</span>
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setSubmissionsPage(i + 1)}
                                className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  submissionsPage === i + 1 ? 'bg-purple-900 text-white shadow-sm' : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button
                              disabled={submissionsPage === totalPages}
                              onClick={() => setSubmissionsPage(prev => Math.min(totalPages, prev + 1))}
                              className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                /* SECTION 2: DEDICATED STUDENT EVALUATION WORKSPACE (SHOWS ONLY TEST QUESTIONS FOR SELECTED STUDENT) */
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Exit to Submissions List Header Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveEvaluatingUser(null)}
                        className="py-2.5 px-4 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-2xl transition-all cursor-pointer flex items-center gap-2 font-bold text-xs shadow-sm hover:scale-102"
                        title="Back to Submissions List"
                      >
                        <ArrowLeft className="w-4 h-4 text-purple-800" />
                        <span>Back to Submissions List</span>
                      </button>
                      <div>
                        <h2 className="font-display font-extrabold text-xl text-gray-800">
                          Evaluation Workspace: {selectedSubmission.name}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium">
                          Reviewing test responses for <span className="font-bold text-gray-700">{selectedSubmission.testTitle}</span> ({selectedSubmission.cohort})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Header info card */}
                  <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display font-extrabold text-xl text-gray-800">{selectedSubmission.name}</h3>
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                          {selectedSubmission.cohort}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        Assessment: <span className="font-bold text-gray-700">{selectedSubmission.testTitle}</span> • Submitted on {selectedSubmission.completedOn}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-purple-50/70 p-4 rounded-2xl border border-purple-100 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Score</span>
                        <span className="text-2xl font-extrabold text-purple-900">{calculatedCurrentScore} / {calculatedMaxScore}</span>
                      </div>
                      <div className="text-right pl-4 border-l border-purple-200">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Percentage</span>
                        <span className="text-2xl font-extrabold text-[#e54e73]">{calculatedCurrentPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls Bar: Question Type Filter & Page Chunk Selector (5 questions/page default) */}
                          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                            {/* Question Type Filter */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-600">Question Filter:</span>
                              <button
                                onClick={() => {
                                  setOnlyShortAns(true);
                                  setQuestionChunkPage(1);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  onlyShortAns 
                                    ? 'bg-purple-900 text-white shadow-xs' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Short Answer Only ({allQuestions.filter(q => q && q.type === 'short_ans').length})
                              </button>
                              <button
                                onClick={() => {
                                  setOnlyShortAns(false);
                                  setQuestionChunkPage(1);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                  !onlyShortAns 
                                    ? 'bg-purple-900 text-white shadow-xs' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                All Questions ({allQuestions.length})
                              </button>
                            </div>

                            {/* Question Card Chunking & View Selector */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-gray-500">Per Card/Page:</span>
                                <select
                                  value={questionsPerPage}
                                  onChange={(e) => {
                                    const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
                                    setQuestionsPerPage(val);
                                    setQuestionChunkPage(1);
                                  }}
                                  className="py-1 px-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-gray-50 focus:outline-none cursor-pointer"
                                >
                                  <option value={5}>5 Questions</option>
                                  <option value={10}>10 Questions</option>
                                  <option value="all">All Questions</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                                <button
                                  onClick={() => setCorrectionViewLayout('table')}
                                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    correctionViewLayout === 'table'
                                      ? 'bg-white text-purple-900 shadow-xs'
                                      : 'text-gray-500 hover:text-gray-800'
                                  }`}
                                >
                                  <Table className="w-3.5 h-3.5" />
                                  <span>Questions Table</span>
                                </button>
                                <button
                                  onClick={() => setCorrectionViewLayout('single')}
                                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    correctionViewLayout === 'single'
                                      ? 'bg-white text-purple-900 shadow-xs'
                                      : 'text-gray-500 hover:text-gray-800'
                                  }`}
                                >
                                  <LayoutList className="w-3.5 h-3.5" />
                                  <span>Single Focus</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* SECTION VIEW MODE 1: TABLE VIEW (PAGINATED IN CHUNKS OF 5 QUESTIONS) */}
                          {correctionViewLayout === 'table' ? (
                            <div className="flex flex-col gap-4">
                              {/* Top Question Pagination Header */}
                              {(() => {
                                const qLimit = questionsPerPage === 'all' ? displayQuestions.length : questionsPerPage;
                                const totalQPages = Math.ceil(displayQuestions.length / qLimit) || 1;

                                if (totalQPages <= 1) return null;

                                const startNum = (questionChunkPage - 1) * qLimit + 1;
                                const endNum = Math.min(displayQuestions.length, questionChunkPage * qLimit);

                                return (
                                  <div className="flex justify-between items-center bg-purple-50/60 p-3 rounded-2xl border border-purple-100">
                                    <span className="text-xs font-bold text-purple-900">
                                      Showing Questions {startNum}-{endNum} of {displayQuestions.length}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        disabled={questionChunkPage === 1}
                                        onClick={() => setQuestionChunkPage(prev => Math.max(1, prev - 1))}
                                        className="p-1 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-lg text-xs font-bold border border-purple-200"
                                      >
                                        <ChevronLeft className="w-3.5 h-3.5 text-purple-900" />
                                      </button>
                                      {[...Array(totalQPages)].map((_, i) => (
                                        <button
                                          key={i}
                                          onClick={() => setQuestionChunkPage(i + 1)}
                                          className={`w-6 h-6 rounded-lg text-[11px] font-bold ${
                                            questionChunkPage === i + 1 ? 'bg-purple-900 text-white' : 'bg-white text-purple-800 border border-purple-200'
                                          }`}
                                        >
                                          {i + 1}
                                        </button>
                                      ))}
                                      <button
                                        disabled={questionChunkPage === totalQPages}
                                        onClick={() => setQuestionChunkPage(prev => Math.min(totalQPages, prev + 1))}
                                        className="p-1 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-lg text-xs font-bold border border-purple-200"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5 text-purple-900" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Questions Table */}
                              <div className="overflow-x-auto bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                                      <th className="py-3 px-3 rounded-l-lg">Q#</th>
                                      <th className="py-3 px-3">Question Prompt & Reference Key</th>
                                      <th className="py-3 px-3">Student Response</th>
                                      <th className="py-3 px-3 text-center">Marks Awarded</th>
                                      <th className="py-3 px-3 rounded-r-lg">Feedback & Remarks</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                                    {(() => {
                                      const qLimit = questionsPerPage === 'all' ? displayQuestions.length : questionsPerPage;
                                      const totalQPages = Math.ceil(displayQuestions.length / qLimit) || 1;
                                      const safeQPage = Math.min(Math.max(1, questionChunkPage), totalQPages);
                                      const chunkedQs = questionsPerPage === 'all' 
                                        ? displayQuestions 
                                        : displayQuestions.slice((safeQPage - 1) * qLimit, safeQPage * qLimit);

                                      if (chunkedQs.length === 0) {
                                        return (
                                          <tr>
                                            <td colSpan="5" className="py-6 text-center text-gray-400 font-medium">
                                              No questions available to evaluate.
                                            </td>
                                          </tr>
                                        );
                                      }

                                      return chunkedQs.map((q, displayIdx) => {
                                        if (!q) return null;
                                        const actualIdx = allQuestions.findIndex(orig => orig.id === q.id || orig.text === q.text);
                                        const qIdx = actualIdx >= 0 ? actualIdx : displayIdx;
                                        const isShortAns = q.type === 'short_ans';
                                        const studentAnswer = selectedSubmission.answers?.[qIdx] ?? selectedSubmission.answers?.[q.id] ?? '';
                                        const correctionState = localCorrections[qIdx] || { mark: 'pending', points: 0, feedback: '' };
                                        const qMax = q.maxMarks || (isShortAns ? 5 : 1);

                                        if (!isShortAns) {
                                          const isCorrect = studentAnswer === q.correctAnswer;
                                          const optionLabel = q.options && typeof studentAnswer === 'number' ? q.options[studentAnswer] : studentAnswer;
                                          return (
                                            <tr key={qIdx} className="hover:bg-gray-50/80 transition-colors opacity-80">
                                              <td className="py-3.5 px-3 font-bold text-gray-500">Q{qIdx + 1}</td>
                                              <td className="py-3.5 px-3">
                                                <span className="font-semibold text-gray-800 block mb-1">{q.text}</span>
                                                <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                                  Auto-Graded MCQ
                                                </span>
                                              </td>
                                              <td className="py-3.5 px-3">
                                                <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                                  {optionLabel || 'No option selected'}
                                                </span>
                                              </td>
                                              <td className="py-3.5 px-3 text-center">
                                                <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                  {isCorrect ? `${qMax}.0 / ${qMax}.0` : `0.0 / ${qMax}.0`}
                                                </span>
                                              </td>
                                              <td className="py-3.5 px-3 text-gray-400 italic text-[11px]">System evaluated MCQ</td>
                                            </tr>
                                          );
                                        }

                                        return (
                                          <tr key={qIdx} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="py-3.5 px-3 font-extrabold text-purple-900">Q{qIdx + 1}</td>
                                            <td className="py-3.5 px-3 max-w-xs">
                                              <span className="font-bold text-gray-800 block mb-1">{q.text}</span>
                                              {q.sampleAnswer && (
                                                <p className="text-[10px] text-purple-800 bg-purple-50 p-2 rounded-lg border border-purple-100 font-medium">
                                                  Key: {q.sampleAnswer}
                                                </p>
                                              )}
                                            </td>
                                            <td className="py-3.5 px-3 max-w-xs">
                                              <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl font-mono text-[11px]">
                                                {typeof studentAnswer === 'string' && studentAnswer.trim().length > 0 ? studentAnswer : '[No answer text]'}
                                              </div>
                                            </td>
                                            <td className="py-3.5 px-3 text-center">
                                              <div className="flex flex-col items-center gap-1.5">
                                                <div className="flex items-center gap-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuestionCorrection(qIdx, 'full', qMax)}
                                                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                                                      correctionState.mark === 'full' ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-300'
                                                    }`}
                                                  >
                                                    Full ({qMax} Pt)
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuestionCorrection(qIdx, 'half', qMax / 2)}
                                                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                                                      correctionState.mark === 'half' ? 'bg-amber-500 text-white' : 'bg-white text-amber-700 border border-amber-300'
                                                    }`}
                                                  >
                                                    Half ({qMax / 2} Pt)
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuestionCorrection(qIdx, 'zero', 0)}
                                                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                                                      correctionState.mark === 'zero' ? 'bg-red-600 text-white' : 'bg-white text-red-700 border border-red-300'
                                                    }`}
                                                  >
                                                    Zero (0)
                                                  </button>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                  <span className="text-[10px] font-bold text-gray-400">Pts:</span>
                                                  <input
                                                    type="number"
                                                    min="0"
                                                    max={qMax}
                                                    step="0.5"
                                                    value={correctionState.points ?? 0}
                                                    onChange={(e) => {
                                                      const val = parseFloat(e.target.value) || 0;
                                                      const mType = val >= qMax ? 'full' : val > 0 ? 'half' : 'zero';
                                                      handleUpdateQuestionCorrection(qIdx, mType, val);
                                                    }}
                                                    className="w-14 py-1 px-1.5 rounded-lg border border-gray-300 text-xs font-bold text-center text-purple-900"
                                                  />
                                                  <span className="text-[10px] font-bold text-gray-500">/ {qMax}</span>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="py-3.5 px-3">
                                              <input
                                                type="text"
                                                placeholder="Write feedback..."
                                                value={correctionState.feedback || ''}
                                                onChange={(e) => handleUpdateFeedback(qIdx, e.target.value)}
                                                className="w-full py-1.5 px-2.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-purple-200"
                                              />
                                            </td>
                                          </tr>
                                        );
                                      });
                                    })()}
                                  </tbody>
                                </table>
                              </div>

                              {/* Bottom Question Pagination Footer */}
                              {(() => {
                                const qLimit = questionsPerPage === 'all' ? displayQuestions.length : questionsPerPage;
                                const totalQPages = Math.ceil(displayQuestions.length / qLimit) || 1;

                                if (totalQPages <= 1) return null;

                                return (
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs text-gray-500 font-medium">
                                      Question Page {questionChunkPage} of {totalQPages}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        disabled={questionChunkPage === 1}
                                        onClick={() => setQuestionChunkPage(prev => Math.max(1, prev - 1))}
                                        className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                                      >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span>Prev</span>
                                      </button>

                                      {[...Array(totalQPages)].map((_, i) => (
                                        <button
                                          key={i}
                                          onClick={() => setQuestionChunkPage(i + 1)}
                                          className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                            questionChunkPage === i + 1
                                              ? 'bg-purple-900 text-white shadow-xs'
                                              : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
                                          }`}
                                        >
                                          {i + 1}
                                        </button>
                                      ))}

                                      <button
                                        disabled={questionChunkPage === totalQPages}
                                        onClick={() => setQuestionChunkPage(prev => Math.min(totalQPages, prev + 1))}
                                        className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                                      >
                                        <span>Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            /* SECTION VIEW MODE 2: SINGLE QUESTION PAGINATED FOCUS VIEW */
                            <div className="flex flex-col gap-6">
                              {/* Pagination Header Bar */}
                              {displayQuestions.length > 0 && (
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-purple-900">
                                      Question {correctionQuestionPage} of {displayQuestions.length}
                                    </span>
                                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-purple-800 border border-purple-200">
                                      {onlyShortAns ? 'Short Answer Focus' : 'All Questions'}
                                    </span>
                                  </div>

                                  {/* Step buttons & prev/next */}
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      disabled={correctionQuestionPage === 1}
                                      onClick={() => setCorrectionQuestionPage(prev => Math.max(1, prev - 1))}
                                      className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                      <span>Prev</span>
                                    </button>

                                    {displayQuestions.map((_, pIdx) => (
                                      <button
                                        key={pIdx}
                                        onClick={() => setCorrectionQuestionPage(pIdx + 1)}
                                        className={`w-7 h-7 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                          correctionQuestionPage === pIdx + 1
                                            ? 'bg-purple-900 text-white shadow-sm scale-105'
                                            : 'bg-white hover:bg-purple-100 text-purple-800 border border-purple-200'
                                        }`}
                                      >
                                        {pIdx + 1}
                                      </button>
                                    ))}

                                    <button
                                      disabled={correctionQuestionPage === displayQuestions.length}
                                      onClick={() => setCorrectionQuestionPage(prev => Math.min(displayQuestions.length, prev + 1))}
                                      className="p-1.5 bg-white hover:bg-purple-100 disabled:opacity-40 rounded-xl border border-purple-200 text-purple-900 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
                                    >
                                      <span>Next</span>
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Focused Question Card */}
                              {(!displayQuestions || displayQuestions.length === 0) ? (
                                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                  <p className="text-xs text-gray-500 font-medium">No short answer questions found in this assessment.</p>
                                </div>
                              ) : (
                                (() => {
                                  const safeIndex = Math.min(Math.max(0, correctionQuestionPage - 1), displayQuestions.length - 1);
                                  const q = displayQuestions[safeIndex];
                                  if (!q) {
                                    return (
                                      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-xs text-gray-500 font-medium">No question selected.</p>
                                      </div>
                                    );
                                  }
                                  const actualIdx = allQuestions.findIndex(orig => orig && (orig.id === q.id || orig.text === q.text));
                                  const qIdx = actualIdx >= 0 ? actualIdx : safeIndex;
                                  const isShortAns = q.type === 'short_ans';
                                  const studentAnswer = selectedSubmission.answers?.[qIdx] ?? selectedSubmission.answers?.[q.id] ?? '';
                                  const correctionState = localCorrections[qIdx] || { mark: 'pending', points: 0, feedback: '' };
                                  const qMax = q.maxMarks || (isShortAns ? 5 : 1);

                                  if (!isShortAns) {
                                    const isCorrect = studentAnswer === q.correctAnswer;
                                    const optionLabel = q.options && typeof studentAnswer === 'number' ? q.options[studentAnswer] : studentAnswer;
                                    const correctOptionLabel = q.options ? q.options[q.correctAnswer] : q.correctAnswer;

                                    return (
                                      <div className="bg-white rounded-2xl p-6 border border-gray-200 opacity-90 relative overflow-hidden flex flex-col gap-4">
                                        <div className="flex justify-between items-start gap-4">
                                          <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center">
                                              Q{qIdx + 1}
                                            </span>
                                            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                              Auto-Graded MCQ
                                            </span>
                                          </div>
                                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                          }`}>
                                            {isCorrect ? `${qMax}.0 / ${qMax}.0 Marks (Correct)` : `0.0 / ${qMax}.0 Marks (Incorrect)`}
                                          </span>
                                        </div>

                                        <p className="font-semibold text-base text-gray-800">{q.text}</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
                                          <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase">Student Selected Answer:</span>
                                            <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                              {optionLabel || 'No option selected'}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-[10px] font-bold text-gray-400 block uppercase">Correct Answer Key:</span>
                                            <span className="font-semibold text-gray-700">{correctOptionLabel}</span>
                                          </div>
                                        </div>

                                        <p className="text-xs text-gray-400 italic">
                                          * MCQ questions are automatically scored based on answer key rules and preserved.
                                        </p>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="bg-white rounded-3xl p-6 border-2 border-purple-300 shadow-md flex flex-col gap-5 relative">
                                      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-100 pb-3.5">
                                        <div className="flex items-center gap-2">
                                          <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                                            Q{qIdx + 1}
                                          </span>
                                          <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                            Short Answer • Manual Correction
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-gray-500">Max Weightage:</span>
                                          <span className="text-xs font-extrabold text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                                            {qMax}.0 Points
                                          </span>
                                        </div>
                                      </div>

                                      {/* Question Prompt */}
                                      <div>
                                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Question Prompt</span>
                                        <p className="font-extrabold text-base text-gray-800 leading-snug">{q.text}</p>
                                      </div>

                                      {/* Model Answer / Reference Key */}
                                      {q.sampleAnswer && (
                                        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 text-xs">
                                          <span className="font-extrabold text-purple-900 block mb-1 flex items-center gap-1.5">
                                            <Sparkles className="w-4 h-4 text-[#e54e73]" />
                                            Expected Model Answer Key / Reference:
                                          </span>
                                          <p className="text-gray-700 leading-relaxed font-medium">{q.sampleAnswer}</p>
                                          {q.keywords && (
                                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                              <span className="text-[10px] font-bold text-purple-800 uppercase">Key Terms:</span>
                                              {Array.isArray(q.keywords) ? q.keywords.map((kw, i) => (
                                                <span key={i} className="text-[10px] font-bold bg-white text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">{kw}</span>
                                              )) : <span className="text-[10px] font-bold bg-white text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">{q.keywords}</span>}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Student Submitted Answer */}
                                      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs shadow-inner leading-relaxed">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-sans">
                                          Student Submitted Answer Text:
                                        </span>
                                        {typeof studentAnswer === 'string' && studentAnswer.trim().length > 0 ? (
                                          <p className="whitespace-pre-wrap font-semibold text-slate-100">{studentAnswer}</p>
                                        ) : (
                                          <span className="text-slate-500 italic">[No text answer submitted by student]</span>
                                        )}
                                      </div>

                                      {/* Choose Number of Marks Section */}
                                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider block">
                                            Award Marks (Max: {qMax}.0 Points):
                                          </span>
                                          <span className="text-xs font-extrabold text-purple-900 bg-white px-3 py-1 rounded-full border border-purple-200 shadow-xs">
                                            Current Award: {correctionState.points || 0} / {qMax}.0 Pts
                                          </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                          {/* Full Marks */}
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateQuestionCorrection(qIdx, 'full', qMax)}
                                            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                                              correctionState.mark === 'full'
                                                ? 'bg-green-600 text-white shadow-md ring-2 ring-green-300 scale-105'
                                                : 'bg-white text-green-700 hover:bg-green-50 border border-green-300'
                                            }`}
                                          >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Full Marks ({qMax}.0 Pts)
                                          </button>

                                          {/* Half Marks */}
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateQuestionCorrection(qIdx, 'half', qMax / 2)}
                                            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                                              correctionState.mark === 'half'
                                                ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300 scale-105'
                                                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-300'
                                            }`}
                                          >
                                            <Award className="w-4 h-4" />
                                            Half Marks ({qMax / 2} Pts)
                                          </button>

                                          {/* Zero Marks */}
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateQuestionCorrection(qIdx, 'zero', 0.0)}
                                            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                                              correctionState.mark === 'zero'
                                                ? 'bg-red-600 text-white shadow-md ring-2 ring-red-300 scale-105'
                                                : 'bg-white text-red-700 hover:bg-red-50 border border-red-300'
                                            }`}
                                          >
                                            <XCircle className="w-4 h-4" />
                                            Zero Marks (0.0 Pts)
                                          </button>

                                          {/* Custom Marks Input */}
                                          <div className="flex items-center gap-2 ml-auto">
                                            <span className="text-xs font-bold text-gray-600">Choose Marks:</span>
                                            <input
                                              type="number"
                                              min="0"
                                              max={qMax}
                                              step="0.5"
                                              value={correctionState.points ?? 0}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                const mType = val >= qMax ? 'full' : val > 0 ? 'half' : 'zero';
                                                handleUpdateQuestionCorrection(qIdx, mType, val);
                                              }}
                                              className="w-20 py-1.5 px-2.5 rounded-xl border border-gray-300 text-xs font-extrabold text-center text-purple-900 focus:ring-2 focus:ring-purple-300 bg-white"
                                            />
                                            <span className="text-xs font-bold text-gray-500">/ {qMax}</span>
                                          </div>
                                        </div>

                                        {/* Feedback Textarea */}
                                        <div className="mt-1">
                                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                            Evaluator Remarks / Student Feedback:
                                          </label>
                                          <textarea
                                            rows={2}
                                            placeholder="Add comments or constructive feedback for the student..."
                                            value={correctionState.feedback || ''}
                                            onChange={(e) => handleUpdateFeedback(qIdx, e.target.value)}
                                            className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-purple-200 text-gray-800 bg-white"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()
                              )}
                            </div>
                          )}

                          {/* Save Action Footer Bar */}
                          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-md flex justify-between items-center gap-4 sticky bottom-4 z-10">
                            <button
                              type="button"
                              onClick={() => handleSelectCorrectionSubmission(selectedSubmission)}
                              className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Reset Changes
                            </button>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={handleSaveCorrection}
                                className="py-2.5 px-6 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-pink-200 flex items-center gap-2 cursor-pointer scale-102 hover:scale-105"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Save & Finalize Correction
                              </button>
                            </div>
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

      </main>      {/* 3. CREATE / EDIT TEST DIALOG MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto py-10 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-extrabold text-xl text-gray-800">
                  {isEditing ? 'Edit Assessment Settings' : 'Create New Assessment'}
                </h3>

                {/* Import Test Trigger Button */}
                <div className="border-l border-gray-200 pl-3 ml-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImportFile} 
                    accept=".json,.csv" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={handleTriggerImport}
                    className="py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Import test from JSON or CSV file"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import Test</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-all cursor-pointer"
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Test Description</label>
                <textarea 
                  rows="2"
                  placeholder="Provide a short description of the test scope..."
                  value={testDesc}
                  onChange={(e) => setTestDesc(e.target.value)}
                  className="py-2.5 px-4 rounded-xl border border-gray-250 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Schedule & Recurrence Category Section */}
              <div className="flex flex-col gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <label className="text-xs font-extrabold text-[#402068] uppercase flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Category & Schedule Recurrence
                  </label>
                  
                  {/* Recurrence Toggle Pills */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                    {[
                      { id: 'one_time', label: 'One-Time' },
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setScheduleType(tab.id)}
                        className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scheduleType === tab.id
                            ? 'bg-[#5e328c] text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekly Days Selector (Mon - Sun) */}
                {scheduleType === 'weekly' && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-purple-100 animate-fade-in">
                    <span className="text-[11px] font-bold text-gray-600">Select Recurring Days (Mon to Sun):</span>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                        const isSelected = selectedWeeklyDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setSelectedWeeklyDays(prev => 
                                isSelected 
                                  ? (prev.length > 1 ? prev.filter(d => d !== day) : prev) 
                                  : [...prev, day]
                              );
                            }}
                            className={`py-1.5 px-3.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#5e328c] text-white border-[#5e328c] shadow-xs scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Monthly Dropdowns (Month, Date, Year) */}
                {scheduleType === 'monthly' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-purple-100 animate-fade-in">
                    {/* Month Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Month</label>
                      <select
                        value={monthlyMonth}
                        onChange={(e) => setMonthlyMonth(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
                      <select
                        value={monthlyDate}
                        onChange={(e) => setMonthlyDate(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                          <option key={d} value={d}>Day {d}</option>
                        ))}
                      </select>
                    </div>

                    {/* Year Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Year</label>
                      <select
                        value={monthlyYear}
                        onChange={(e) => setMonthlyYear(e.target.value)}
                        className="py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        {['2026', '2027', '2028', '2029', '2030'].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
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
                      
                      {/* TYPE 1: MCQ WITH DYNAMIC OPTIONS COUNT */}
                      {q.type === 'mcq' && (
                        <div className="flex flex-col gap-3 mt-1 bg-white p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-[11px] font-extrabold text-gray-600 uppercase">Answer Options</span>
                            
                            {/* Add Option button */}
                            <button
                              type="button"
                              onClick={() => handleAddOption(qIdx)}
                              className="py-1 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Option
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {(q.options || ['', '', '', '']).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 shrink-0 min-w-[55px]">Option {String.fromCharCode(65 + optIdx)}</span>
                                <input 
                                  type="text" 
                                  required
                                  placeholder={`Choice text...`} 
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                  className="w-full py-1.5 px-3 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-purple-600 text-gray-700"
                                />
                                {q.options.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(qIdx, optIdx)}
                                    className="p-1 text-gray-300 hover:text-red-500 rounded cursor-pointer"
                                    title="Remove Option"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Correct Choice:</span>
                            <select 
                              value={q.correctAnswer || 0}
                              onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', parseInt(e.target.value))}
                              className="py-1 px-3 bg-purple-50 border border-purple-200 rounded-lg text-xs font-bold text-purple-900"
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

                  {/* PROMINENT + ADD QUESTION CONTAINER AFTER LATEST QUESTION */}
                  <div className="p-4 border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl bg-purple-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-extrabold shrink-0">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-gray-800">Add Next Question #{testQuestions.length + 1}</span>
                        <p className="text-[10px] text-gray-400">Append a new question prompt to this assessment</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddQuestion('mcq')}
                        className="py-2 px-3.5 bg-[#5e328c] hover:bg-purple-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add MCQ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestion('short_ans')}
                        className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Short Ans
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuestion('embedded')}
                        className="py-2 px-3.5 bg-[#e54e73] hover:bg-[#d03b60] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Embedded
                      </button>
                    </div>
                  </div>

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

      {/* 5. USERS POOL & BULK DRAG-AND-DROP MODAL */}
      {showUsersPoolModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0 bg-purple-50/50 rounded-t-[2rem]">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-800" />
                  <h3 className="font-display font-extrabold text-lg text-gray-800">
                    Users Pool & Bulk Assignment
                  </h3>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {targetCohortForPool ? `Drag or select users to add to "${targetCohortForPool.name}"` : 'Drag user rows directly onto cohort drop targets below or use bulk assign.'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowUsersPoolModal(false);
                  setTargetCohortForPool(null);
                  setSelectedPoolUserIds([]);
                }}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bulk Actions Control Bar */}
            <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedPoolUserIds.length === usersPool.length) {
                      setSelectedPoolUserIds([]);
                    } else {
                      setSelectedPoolUserIds(usersPool.map(u => u.id));
                    }
                  }}
                  className="px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-extrabold border border-gray-200 transition-all cursor-pointer"
                >
                  {selectedPoolUserIds.length === usersPool.length ? 'Deselect All' : 'Select All Users'}
                </button>
                <span className="text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-xl">
                  {selectedPoolUserIds.length} Selected
                </span>
              </div>

              {/* Bulk Assign & Droppable Target Selector */}
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverCohortId('modal-selector');
                }}
                onDragLeave={() => setDragOverCohortId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverCohortId(null);
                  const selEl = document.getElementById('bulkTargetCohortSelect');
                  const targetId = selEl?.value || targetCohortForPool?.id || cohorts[0]?.id;
                  if (targetId) handleDropOnCohortRow(e, cohorts.find(c => c.id === targetId) || cohorts[0]);
                }}
                className={`flex items-center gap-2 p-1 rounded-2xl transition-all ${
                  dragOverCohortId === 'modal-selector' ? 'bg-purple-100 border-2 border-dashed border-purple-600 scale-105' : ''
                }`}
              >
                <select
                  id="bulkTargetCohortSelect"
                  defaultValue={targetCohortForPool?.id || cohorts[0]?.id || ''}
                  className="py-1.5 px-3 rounded-xl border border-gray-250 text-xs font-bold text-gray-700 bg-white focus:outline-none cursor-pointer"
                >
                  {cohorts.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={selectedPoolUserIds.length === 0}
                  onClick={() => {
                    const selEl = document.getElementById('bulkTargetCohortSelect');
                    const targetId = selEl?.value || targetCohortForPool?.id;
                    if (!targetId) {
                      alert('Please choose a target cohort from the dropdown first.');
                      return;
                    }
                    handleBulkAssignPoolUsers(targetId);
                  }}
                  className="py-1.5 px-4 bg-purple-900 hover:bg-purple-800 disabled:opacity-40 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer"
                >
                  Assign Bulk to Cohort
                </button>
              </div>
            </div>

            {/* Users Pool Table */}
            <div className="p-8 overflow-y-auto flex-1">
              {usersPool.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <p className="font-bold text-gray-700 text-sm">All pool users have been assigned to cohorts!</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                      <th className="py-3 px-3 rounded-l-lg w-10 text-center">Select</th>
                      <th className="py-3 px-3">User Name & Email</th>
                      <th className="py-3 px-3">Role / Specialty</th>
                      <th className="py-3 px-3 text-center">Joined Pool</th>
                      <th className="py-3 px-3 text-center rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                    {usersPool.map(userItem => {
                      const isSelected = selectedPoolUserIds.includes(userItem.id);

                      return (
                        <tr 
                          key={userItem.id}
                          draggable
                          onDragStart={(e) => handleDragStartUser(e, userItem)}
                          className={`hover:bg-purple-50/50 transition-colors cursor-grab active:cursor-grabbing ${isSelected ? 'bg-purple-50/80 font-semibold' : ''}`}
                        >
                          <td className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setSelectedPoolUserIds(prev => 
                                  prev.includes(userItem.id) 
                                    ? prev.filter(id => id !== userItem.id)
                                    : [...prev, userItem.id]
                                );
                              }}
                              className="w-4 h-4 rounded text-purple-900 focus:ring-purple-400 cursor-pointer"
                            />
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <GripVertical className="w-4 h-4 text-gray-400 hover:text-purple-700 shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{userItem.name}</span>
                                <span className="text-[11px] text-gray-400">{userItem.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                              {userItem.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center text-gray-500">{userItem.joinedOn}</td>
                          <td className="py-3.5 px-3 text-center">
                            {targetCohortForPool ? (
                              <button
                                type="button"
                                onClick={() => {
                                  addStudentToCohort(targetCohortForPool.id, userItem.name, userItem.email);
                                  setUsersPool(prev => prev.filter(u => u.id !== userItem.id));
                                  showToast(`Added ${userItem.name} to ${targetCohortForPool.name}!`);
                                }}
                                className="py-1.5 px-3 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 mx-auto"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Add to Cohort</span>
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400 italic">Drag to Cohort</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowUsersPoolModal(false);
                  setTargetCohortForPool(null);
                  setSelectedPoolUserIds([]);
                }}
                className="py-2.5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close Users Pool
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. HISTORY OF DELETED PEOPLE AUDIT LOG MODAL */}
      {showDeletedUsersModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0 bg-red-50/50 rounded-t-[2rem]">
              <div>
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-red-700" />
                  <h3 className="font-display font-extrabold text-lg text-gray-800">
                    History of Deleted People (Audit Log)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Complete audit history of removed users with one-click restore capabilities.
                </p>
              </div>
              <button 
                onClick={() => setShowDeletedUsersModal(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {deletedUsersHistory.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <p className="font-bold text-gray-700 text-sm">No deleted users in history audit log.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                      <th className="py-3 px-4 rounded-l-lg">User Name & Email</th>
                      <th className="py-3 px-4">Former Cohort</th>
                      <th className="py-3 px-4 text-center">Date Removed</th>
                      <th className="py-3 px-4 text-center">Removed By</th>
                      <th className="py-3 px-4 text-center rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                    {deletedUsersHistory.map(delUser => (
                      <tr key={delUser.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{delUser.name}</span>
                            <span className="text-[11px] text-gray-400">{delUser.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-purple-800">{delUser.formerCohort}</td>
                        <td className="py-3.5 px-4 text-center text-gray-500">{delUser.deletedOn}</td>
                        <td className="py-3.5 px-4 text-center text-gray-600 font-bold">{delUser.deletedBy}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRestoreDeletedUser(delUser)}
                            className="py-1.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore User</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowDeletedUsersModal(false)}
                className="py-2.5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. COHORT MEMBERS MODAL */}
      {showCohortMembersModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0 bg-purple-50/50 rounded-t-[2rem]">
              <div>
                <h3 className="font-display font-extrabold text-lg text-gray-800">
                  Members in {showCohortMembersModal.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {showCohortMembersModal.students?.length || 0} Total Enrolled Students
                </p>
              </div>
              <button 
                onClick={() => setShowCohortMembersModal(null)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {(!showCohortMembersModal.students || showCohortMembersModal.students.length === 0) ? (
                <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-medium">No students enrolled in this cohort yet.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase bg-gray-50">
                      <th className="py-3 px-4 rounded-l-lg">Student Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Score</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                    {showCohortMembersModal.students.map(studentItem => (
                      <tr key={studentItem.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-800">{studentItem.name}</td>
                        <td className="py-3.5 px-4 text-gray-500">{studentItem.email || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-purple-900">{studentItem.score || '-'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-full text-[10px]">
                            {studentItem.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteStudentFromCohort(showCohortMembersModal, studentItem)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                            title="Remove Student & Log in History"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTargetCohortForPool(showCohortMembersModal);
                  setShowCohortMembersModal(null);
                  setShowUsersPoolModal(true);
                }}
                className="py-2.5 px-4 bg-purple-900 text-white font-extrabold rounded-xl text-xs hover:bg-purple-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-purple-200" />
                <span>Add Users from Pool</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCohortMembersModal(null)}
                className="py-2.5 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close Members
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CreatorDashboard;
