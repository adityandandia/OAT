import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default initial tests
const DEFAULT_TESTS = [
  {
    id: 'js-basics',
    title: 'JavaScript & Web Engineering',
    description: 'Comprehensive test on JavaScript fundamentals, short answer prompts, and code analysis',
    totalQuestions: 4,
    duration: 30, // in minutes
    createdOn: '20 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'Which operator is used to compare both value and type in JavaScript?',
        options: ['==', '===', '=', '!='],
        correctAnswer: 1
      },
      {
        id: 'q2',
        type: 'short_ans',
        text: 'Explain the difference between undefined and null in JavaScript.',
        sampleAnswer: 'undefined means a variable has been declared but not assigned a value, whereas null is an assignment value that represents no value or an empty object.',
        keywords: ['declared', 'unassigned', 'object', 'empty', 'primitive']
      },
      {
        id: 'q3',
        type: 'embedded',
        embedType: 'code',
        codeSnippet: `function calculateTotal(items) {\n  let total = 0;\n  items.forEach(item => {\n    total += item.price;\n  });\n  return total;\n}`,
        text: 'Review the embedded JavaScript function snippet above. What will be returned if items is an empty array []?',
        options: ['0', 'undefined', 'NaN', 'TypeError: Cannot read properties'],
        correctAnswer: 0
      },
      {
        id: 'q4',
        type: 'mcq',
        text: 'Which built-in method returns the length of a string in JavaScript?',
        options: ['length()', 'size()', 'length', 'index()'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals & Component Architecture',
    description: 'React core concepts assessment with code snippets and short answers',
    totalQuestions: 4,
    duration: 45,
    createdOn: '18 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'What hook is used to perform side effects in React functional components?',
        options: ['useState', 'useContext', 'useEffect', 'useMemo'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        type: 'embedded',
        embedType: 'code',
        codeSnippet: `const Counter = () => {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n};`,
        text: 'In the embedded React code block, what happens when the user clicks the button element?',
        options: ['State updates and triggers re-render', 'Component unmounts', 'Page reloads completely', 'Syntax error occurs'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'What is the Virtual DOM in React and why is it beneficial for performance?',
        sampleAnswer: 'The Virtual DOM is an in-memory representation of the real DOM. React computes differences (diffing) and batches updates to update only changed DOM nodes efficiently.',
        keywords: ['in-memory', 'diffing', 'reconciliation', 'batching', 'real DOM']
      },
      {
        id: 'q4',
        type: 'mcq',
        text: 'What is the purpose of the key prop when rendering lists in React?',
        options: ['To uniquely identify elements among siblings for reconciliation', 'To encrypt list items', 'To apply CSS styles to elements', 'To bind state to elements'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS Design System',
    description: 'HTML structure and CSS styling fundamentals',
    totalQuestions: 3,
    duration: 20,
    createdOn: '15 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'What does CSS stand for?',
        options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        type: 'embedded',
        embedType: 'code',
        codeSnippet: `.container {\n  display: flex;\n  align-items: center;\n}`,
        text: 'In the CSS Flexbox rules snippet above, which property controls alignment along the cross axis?',
        options: ['align-items', 'justify-content', 'flex-direction', 'flex-wrap'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'Describe the CSS Box Model components from inside to outside.',
        sampleAnswer: 'Content, Padding, Border, and Margin.',
        keywords: ['Content', 'Padding', 'Border', 'Margin']
      }
    ]
  }
];

const DEFAULT_COURSES = [
  {
    id: 'course-1',
    title: 'JavaScript & Web Engineering',
    description: 'Comprehensive course covering JS fundamentals, DOM, and modern web APIs.',
    duration: 120,
    status: 'Active',
    createdOn: '20 May 2024'
  },
  {
    id: 'course-2',
    title: 'React Fundamentals & Component Architecture',
    description: 'Build interactive UIs using React components, hooks, and state management.',
    duration: 140,
    status: 'Active',
    createdOn: '18 May 2024'
  },
  {
    id: 'course-3',
    title: 'HTML & CSS Design System',
    description: 'Master layout, responsive design, and modern CSS styling patterns.',
    duration: 90,
    status: 'Draft',
    createdOn: '15 May 2024'
  }
];

// Preset employee results matching office dashboard
const DEFAULT_STUDENT_RESULTS = [
  { id: '1', name: 'Arjun Sharma', role: 'Sr. Software Engineer', status: 'Completed', score: 22, totalQs: 25, percentage: 88, highestPercentage: 92, reattempts: 3, completedOn: '20 May 2024', timeTaken: '27 mins', testTitle: 'React Fundamentals', cohort: 'Full-Stack Web Dev 2026-A' },
  { id: '2', name: 'Priya Patel', role: 'Data Specialist', status: 'Completed', score: 20, totalQs: 25, percentage: 80, highestPercentage: 88, reattempts: 2, completedOn: '20 May 2024', timeTaken: '29 mins', testTitle: 'React Fundamentals', cohort: 'Full-Stack Web Dev 2026-A' },
  { id: '3', name: 'Rahul Verma', role: 'UI/UX Developer', status: 'Completed', score: 18, totalQs: 25, percentage: 72, highestPercentage: 80, reattempts: 4, completedOn: '19 May 2024', timeTaken: '25 mins', testTitle: 'React Fundamentals', cohort: 'Full-Stack Web Dev 2026-A' },
  { id: '4', name: 'Sneha Reddy', role: 'QA Automation Lead', status: 'In Progress', score: 15, totalQs: 25, percentage: 60, highestPercentage: 68, reattempts: 1, completedOn: '-', timeTaken: '-', testTitle: 'React Fundamentals', cohort: 'Full-Stack Web Dev 2026-A' },
  { id: '5', name: 'Karan Mehta', role: 'Backend Engineer', status: 'Completed', score: 14, totalQs: 25, percentage: 56, highestPercentage: 64, reattempts: 2, completedOn: '19 May 2024', timeTaken: '38 mins', testTitle: 'React Fundamentals', cohort: 'Data Science & Backend Cohort' },
  { id: '6', name: 'Anjali Singh', role: 'DevOps Specialist', status: 'Not Attempted', score: 0, totalQs: 25, percentage: 0, highestPercentage: 0, reattempts: 0, completedOn: '-', timeTaken: '-', testTitle: 'React Fundamentals', cohort: 'Data Science & Backend Cohort' },
  { id: '7', name: 'Vikram Das', role: 'Data Scientist', status: 'Completed', score: 24, totalQs: 25, percentage: 96, highestPercentage: 96, reattempts: 1, completedOn: '18 May 2024', timeTaken: '22 mins', testTitle: 'Python Basics', cohort: 'Data Science & Backend Cohort' },
  { id: '8', name: 'Meera Kapoor', role: 'Lead Frontend Architect', status: 'Completed', score: 25, totalQs: 25, percentage: 100, highestPercentage: 100, reattempts: 0, completedOn: '17 May 2024', timeTaken: '18 mins', testTitle: 'HTML & CSS Design System', cohort: 'UI/UX & Frontend Mastery' },
  { id: '9', name: 'Rohan Gupta', role: 'Full Stack Engineer', status: 'Completed', score: 21, totalQs: 25, percentage: 84, highestPercentage: 90, reattempts: 3, completedOn: '16 May 2024', timeTaken: '30 mins', testTitle: 'JavaScript & Web Engineering', cohort: 'UI/UX & Frontend Mastery' }
];

// Preset Cohorts List
const DEFAULT_COHORTS = [
  {
    id: 'cohort-1',
    name: 'Full-Stack Web Dev 2026-A',
    description: 'Frontend & React specialization cohort focusing on UI engineering',
    totalStudents: 18,
    avgScore: 84,
    completionRate: 92,
    status: 'Active',
    createdOn: '18 May 2024',
    assignedTests: ['js-basics', 'react-fundamentals'],
    students: [
      { id: 's1', name: 'Arjun Sharma', email: 'arjun@example.com', score: '88%', status: 'Completed' },
      { id: 's2', name: 'Priya Patel', email: 'priya@example.com', score: '80%', status: 'Completed' },
      { id: 's3', name: 'Rahul Verma', email: 'rahul@example.com', score: '72%', status: 'Completed' },
      { id: 's4', name: 'Sneha Reddy', email: 'sneha@example.com', score: '60%', status: 'In Progress' }
    ]
  },
  {
    id: 'cohort-2',
    name: 'Data Science & Backend Batch',
    description: 'Python algorithms, database engineering, and SQL analytics batch',
    totalStudents: 14,
    avgScore: 76,
    completionRate: 85,
    status: 'Active',
    createdOn: '15 May 2024',
    assignedTests: ['js-basics'],
    students: [
      { id: 's5', name: 'Karan Mehta', email: 'karan@example.com', score: '56%', status: 'Completed' },
      { id: 's6', name: 'Anjali Singh', email: 'anjali@example.com', score: '0%', status: 'Not Attempted' },
      { id: 's7', name: 'Vikram Das', email: 'vikram@example.com', score: '92%', status: 'Completed' }
    ]
  },
  {
    id: 'cohort-3',
    name: 'UI/UX & Frontend Mastery',
    description: 'Advanced design systems, Tailwind CSS, and HTML5 layout cohort',
    totalStudents: 12,
    avgScore: 90,
    completionRate: 98,
    status: 'Active',
    createdOn: '12 May 2024',
    assignedTests: ['html-css'],
    students: [
      { id: 's8', name: 'Meera Kapoor', email: 'meera@example.com', score: '94%', status: 'Completed' },
      { id: 's9', name: 'Rohan Gupta', email: 'rohan@example.com', score: '86%', status: 'Completed' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  // Authentication & Users
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shai_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Tests
  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem('shai_tests');
    const initialData = saved ? JSON.parse(saved) : DEFAULT_TESTS;
    return initialData.map(test => ({
      ...test,
      questions: test.questions?.map(q => {
        let type = q.type || 'mcq';
        if (type === 'embedded' && (!q.codeSnippet || q.codeSnippet.trim() === '') && q.options && q.options.length > 0) {
          type = 'mcq';
        }
        return { ...q, type };
      })
    }));
  });

  // Courses
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('shai_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  // Student Results List
  const [studentResults, setStudentResults] = useState(() => {
    const saved = localStorage.getItem('shai_student_results');
    if (!saved) return DEFAULT_STUDENT_RESULTS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((item, idx) => {
        const def = DEFAULT_STUDENT_RESULTS.find(d => d.id === item.id || d.name === item.name) || DEFAULT_STUDENT_RESULTS[idx % DEFAULT_STUDENT_RESULTS.length];
        const randomReattempt = def?.reattempts ?? (item.id === '1' ? 3 : item.id === '2' ? 2 : item.id === '3' ? 4 : item.id === '4' ? 1 : item.id === '5' ? 2 : 0);
        const randomHighest = def?.highestPercentage ?? (item.percentage ? Math.min(100, item.percentage + 4) : 0);
        return {
          ...item,
          reattempts: item.reattempts !== undefined ? item.reattempts : randomReattempt,
          highestPercentage: item.highestPercentage !== undefined ? item.highestPercentage : randomHighest,
          role: item.role || def?.role || 'Employee'
        };
      });
    } catch (e) {
      return DEFAULT_STUDENT_RESULTS;
    }
  });

  // Cohorts List
  const [cohorts, setCohorts] = useState(() => {
    const saved = localStorage.getItem('shai_cohorts');
    return saved ? JSON.parse(saved) : DEFAULT_COHORTS;
  });

  // Completed Tests helper
  const [charanCompletedTests, setCharanCompletedTests] = useState(() => {
    const saved = localStorage.getItem('shai_charan_completed');
    return saved ? JSON.parse(saved) : [
      { id: 'html-css', title: 'HTML & CSS Design System', score: 3, totalQs: 3, percentage: 100, completedOn: '15 May 2024' },
      { id: 'js-basics', title: 'JavaScript & Web Engineering', score: 3, totalQs: 4, percentage: 75, completedOn: '10 May 2024' }
    ];
  });

  const [completedCountOffset] = useState(() => {
    const saved = localStorage.getItem('shai_completed_offset');
    return saved ? parseInt(saved) : 10;
  });

  // LocalStorage Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('shai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shai_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shai_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('shai_student_results', JSON.stringify(studentResults));
  }, [studentResults]);

  useEffect(() => {
    localStorage.setItem('shai_cohorts', JSON.stringify(cohorts));
  }, [cohorts]);

  useEffect(() => {
    localStorage.setItem('shai_charan_completed', JSON.stringify(charanCompletedTests));
  }, [charanCompletedTests]);

  // Auth Login (Connected to FastAPI / Local Fallback)
  const login = async (identifier, password, roleHint) => {
    try {
      // 1. Try hitting the real FastAPI Auth Endpoint
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      if (response.ok) {
        const data = await response.json();
        const serverRole = data.user?.role?.toLowerCase() || 'student';
        const finalRole = roleHint || serverRole;
        const userData = {
          name: data.user?.username || identifier,
          role: finalRole,
          title: finalRole === 'admin' ? 'Administrator' : finalRole === 'creator' ? 'Course Creator' : 'Employee',
          token: data.access_token
        };
        setUser(userData);
        return userData;
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Invalid login credentials.');
      }
    } catch (err) {
      // 2. Local Fallback for Demo Testing
      const lower = identifier ? identifier.toLowerCase().trim() : '';
      let role = roleHint;
      if (!role) {
        if (lower === 'admin') role = 'admin';
        else if (lower === 'creator' || lower === 'teacher') role = 'creator';
        else role = 'student';
      }

      const title = role === 'admin' ? 'Administrator' : role === 'creator' ? 'Course Creator' : 'Employee';
      const defaultName = role === 'admin' ? 'Charan (Admin)' : role === 'creator' ? 'Charan (Course Creator)' : 'Charan';

      const userData = {
        name: (identifier && !['charan', 'admin', 'creator'].includes(lower)) ? identifier : defaultName,
        role: role,
        title: title
      };
      setUser(userData);
      return userData;
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Test Actions
  const createTest = (newTest) => {
    const formattedTest = {
      id: newTest.id || `test-${Date.now()}`,
      title: newTest.title,
      description: newTest.description,
      totalQuestions: newTest.questions ? newTest.questions.length : 0,
      duration: parseInt(newTest.duration) || 30,
      createdOn: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      questions: newTest.questions || []
    };
    setTests(prev => [formattedTest, ...prev]);
  };

  const updateTest = (id, updatedTest) => {
    setTests(prev => prev.map(test => {
      if (test.id === id) {
        return {
          ...test,
          title: updatedTest.title,
          description: updatedTest.description,
          duration: parseInt(updatedTest.duration) || 30,
          totalQuestions: updatedTest.questions ? updatedTest.questions.length : test.totalQuestions,
          questions: updatedTest.questions || test.questions
        };
      }
      return test;
    }));
  };

  const deleteTest = (id) => {
    setTests(prev => prev.filter(test => test.id !== id));
  };

  const createCourse = (newCourse) => {
    const formattedCourse = {
      id: newCourse.id || `course-${Date.now()}`,
      title: newCourse.title,
      description: newCourse.description,
      duration: parseInt(newCourse.duration) || 30,
      status: newCourse.status || 'Draft',
      createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setCourses(prev => [formattedCourse, ...prev]);
  };

  const updateCourse = (id, updatedCourse) => {
    setCourses(prev => prev.map(course => {
      if (course.id === id) {
        return {
          ...course,
          title: updatedCourse.title,
          description: updatedCourse.description,
          duration: parseInt(updatedCourse.duration) || course.duration,
          status: updatedCourse.status || course.status
        };
      }
      return course;
    }));
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  // Cohort Actions
  const createCohort = (newCohort) => {
    const cohortItem = {
      id: `cohort-${Date.now()}`,
      name: newCohort.name,
      description: newCohort.description || 'Custom course cohort group',
      totalStudents: 0,
      avgScore: 0,
      completionRate: 0,
      status: 'Active',
      createdOn: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      assignedTests: newCohort.assignedTests || [],
      students: []
    };
    setCohorts(prev => [cohortItem, ...prev]);
  };

  const deleteCohort = (id) => {
    setCohorts(prev => prev.filter(c => c.id !== id));
  };

  const addStudentToCohort = (cohortId, studentName, studentEmail) => {
    setCohorts(prev => prev.map(c => {
      if (c.id === cohortId) {
        const newStudents = [
          ...c.students,
          { id: `s-${Date.now()}`, name: studentName, email: studentEmail, score: 'Pending', status: 'Not Attempted' }
        ];
        return {
          ...c,
          totalStudents: newStudents.length,
          students: newStudents
        };
      }
      return c;
    }));
  };

  // Submit test results
  const submitTestResult = (testId, answers, score, totalQuestions) => {
    const matchedTest = tests.find(t => t.id === testId);
    if (!matchedTest) return;

    const percentage = Math.round((score / totalQuestions) * 100);
    const completedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const isAlreadyCompleted = charanCompletedTests.some(c => c.id === testId);
    if (!isAlreadyCompleted) {
      setCharanCompletedTests(prev => [
        {
          id: testId,
          title: matchedTest.title,
          score,
          totalQs: totalQuestions,
          percentage,
          completedOn: completedDate
        },
        ...prev
      ]);
    } else {
      setCharanCompletedTests(prev => prev.map(c => 
        c.id === testId 
          ? { ...c, score, percentage, completedOn: completedDate } 
          : c
      ));
    }

    const existingResult = studentResults.find(r => r.name.includes('Charan') && r.testTitle === matchedTest.title);
    const existingAttemptCount = studentResults.filter(r => r.name.includes('Charan') && r.testTitle === matchedTest.title).length;
    const currentHighest = existingResult ? Math.max(existingResult.highestPercentage || 0, percentage) : percentage;

    const charanResultId = `result-charan-${Date.now()}`;
    const newStudentResult = {
      id: charanResultId,
      name: user?.name ? `${user.name} (You)` : 'Charan (You)',
      role: 'Employee / Engineer',
      status: 'Completed',
      score,
      totalQs: totalQuestions,
      percentage,
      highestPercentage: currentHighest,
      reattempts: existingAttemptCount,
      completedOn: completedDate,
      testTitle: matchedTest.title,
      cohort: 'Full-Stack Web Dev 2026-A'
    };

    setStudentResults(prev => [newStudentResult, ...prev]);
  };

  // Stats computation
  const completedIds = charanCompletedTests.map(c => c.id);
  const upcomingTests = tests.filter(test => !completedIds.includes(test.id));
  
  const studentStats = {
    upcomingCount: upcomingTests.length,
    completedCount: completedCountOffset + charanCompletedTests.length,
    resultsCount: completedCountOffset + charanCompletedTests.length
  };

  const creatorStats = {
    totalStudents: 44,
    completed: 38,
    inProgress: 5,
    notAttempted: 1
  };

  const getPerformanceDistribution = () => {
    let excellent = 14;
    let good = 12;
    let average = 8;
    let poor = 4;
    
    const dynamicResults = studentResults.filter(r => !DEFAULT_STUDENT_RESULTS.some(dr => dr.id === r.id));
    dynamicResults.forEach(r => {
      const pct = r.percentage;
      if (pct >= 80) excellent++;
      else if (pct >= 60) good++;
      else if (pct >= 40) average++;
      else poor++;
    });

    const total = excellent + good + average + poor;

    return {
      total,
      categories: [
        { name: 'Excellent (80-100%)', count: excellent, percentage: Math.round((excellent / total) * 1000) / 10, color: '#4ade80' },
        { name: 'Good (60-79%)', count: good, percentage: Math.round((good / total) * 1000) / 10, color: '#60a5fa' },
        { name: 'Average (40-59%)', count: average, percentage: Math.round((average / total) * 1000) / 10, color: '#fbbf24' },
        { name: 'Poor (0-39%)', count: poor, percentage: Math.round((poor / total) * 1000) / 10, color: '#f87171' }
      ]
    };
  };

  const getInfographicAnalytics = () => {
    return {
      questionTypeAccuracy: [
        { type: 'MCQ (Multiple Choice)', accuracy: 88, totalAttempted: 140, color: '#e54e73' },
        { type: 'Short Answer', accuracy: 74, totalAttempted: 95, color: '#5e328c' },
        { type: 'Embedded Code/Media', accuracy: 81, totalAttempted: 110, color: '#28c76f' }
      ],
      topicMastery: [
        { topic: 'JavaScript ES6+', score: 86 },
        { topic: 'React Component State', score: 91 },
        { topic: 'CSS Flexbox & Grid', score: 79 },
        { topic: 'SQL Queries & Joins', score: 83 }
      ],
      leaderboard: [
        { rank: 1, name: 'Meera Kapoor', score: '98%', cohort: 'UI/UX & Frontend Mastery', avatarColor: '#e54e73' },
        { rank: 2, name: 'Vikram Das', score: '95%', cohort: 'Data Science & Backend Batch', avatarColor: '#5e328c' },
        { rank: 3, name: 'Arjun Sharma', score: '88%', cohort: 'Full-Stack Web Dev 2026-A', avatarColor: '#28c76f' },
        { rank: 4, name: 'Rohan Gupta', score: '86%', cohort: 'UI/UX & Frontend Mastery', avatarColor: '#60a5fa' },
        { rank: 5, name: 'Priya Patel', score: '80%', cohort: 'Full-Stack Web Dev 2026-A', avatarColor: '#fbbf24' }
      ]
    };
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      tests,
      createTest,
      updateTest,
      deleteTest,
      studentResults,
      setStudentResults,
      courses,
      createCourse,
      updateCourse,
      deleteCourse,
      cohorts,
      createCohort,
      deleteCohort,
      addStudentToCohort,
      charanCompletedTests,
      submitTestResult,
      studentStats,
      upcomingTests,
      creatorStats,
      getPerformanceDistribution,
      getInfographicAnalytics
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export const useAuth = () => useContext(AppContext);