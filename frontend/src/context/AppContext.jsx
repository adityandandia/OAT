import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default initial tests with full questions list
const DEFAULT_TESTS = [
  {
    id: 'js-basics',
    title: 'JavaScript Basics',
    description: 'Test on basic JavaScript concepts',
    totalQuestions: 5,
    duration: 30, // in minutes
    createdOn: '20 May 2024',
    questions: [
      {
        id: 'q1',
        text: 'Which operator is used to compare both value and type in JavaScript?',
        options: ['==', '===', '=', '!='],
        correctAnswer: 1 // index 1 = ===
      },
      {
        id: 'q2',
        text: 'How do you write a comment in JavaScript?',
        options: ['<!-- comment -->', '// comment', '/* comment */', 'Both // and /* */ comment styles'],
        correctAnswer: 3
      },
      {
        id: 'q3',
        text: 'Which built-in method returns the length of a string in JavaScript?',
        options: ['length()', 'size()', 'length', 'index()'],
        correctAnswer: 2 // index 2 = length
      },
      {
        id: 'q4',
        text: 'How do you declare a block-scoped local variable in JavaScript?',
        options: ['var', 'let', 'const', 'Both let and const'],
        correctAnswer: 3
      },
      {
        id: 'q5',
        text: 'Which array method adds one or more elements to the end of an array and returns the new length?',
        options: ['pop()', 'push()', 'shift()', 'unshift()'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'React core concepts assessment',
    totalQuestions: 5,
    duration: 45,
    createdOn: '18 May 2024',
    questions: [
      {
        id: 'q1',
        text: 'What hook is used to perform side effects in React functional components?',
        options: ['useState', 'useContext', 'useEffect', 'useMemo'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        text: 'How are props passed to a child component in React?',
        options: ['Using HTML attributes', 'Through class constructors', 'Using state setters', 'Via URL parameters'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        text: 'Which hook returns a stateful value and a function to update it?',
        options: ['useEffect', 'useReducer', 'useRef', 'useState'],
        correctAnswer: 3
      },
      {
        id: 'q4',
        text: 'What is the correct way to handle a click event in a React component?',
        options: ['onclick={handleClick}', 'onClick={handleClick}', 'onClick="handleClick()"', 'click={handleClick}'],
        correctAnswer: 1
      },
      {
        id: 'q5',
        text: 'What is the purpose of the key prop when rendering lists in React?',
        options: ['To uniquely identify elements among siblings for reconciliation', 'To encrypt list items', 'To apply CSS styles to elements', 'To bind state to elements'],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    description: 'HTML and CSS fundamentals',
    totalQuestions: 5,
    duration: 20,
    createdOn: '15 May 2024',
    questions: [
      {
        id: 'q1',
        text: 'What does CSS stand for?',
        options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'Which HTML element is used to define the title of a document?',
        options: ['<head>', '<title>', '<meta>', '<header>'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        text: 'Which CSS property controls the spacing inside an element border?',
        options: ['margin', 'border-spacing', 'padding', 'width'],
        correctAnswer: 2
      },
      {
        id: 'q4',
        text: 'What is the correct HTML element for inserting a line break?',
        options: ['<break>', '<br>', '<lb>', '<newline>'],
        correctAnswer: 1
      },
      {
        id: 'q5',
        text: 'Which CSS selector styles elements when the user mouse hovers over them?',
        options: [':active', ':focus', ':hover', ':visited'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'db-basics',
    title: 'Database Basics',
    description: 'SQL and database fundamentals',
    totalQuestions: 5,
    duration: 30,
    createdOn: '10 May 2024',
    questions: [
      {
        id: 'q1',
        text: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Strong Question Language', 'Structured Question List', 'System Query Log'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        text: 'Which SQL statement is used to extract data from a database?',
        options: ['GET', 'EXTRACT', 'SELECT', 'OPEN'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        text: 'Which constraint uniquely identifies each record in a database table?',
        options: ['FOREIGN KEY', 'PRIMARY KEY', 'UNIQUE', 'NOT NULL'],
        correctAnswer: 1
      },
      {
        id: 'q4',
        text: 'Which SQL keyword is used to sort the result-set?',
        options: ['ORDER BY', 'SORT BY', 'GROUP BY', 'ALIGN BY'],
        correctAnswer: 0
      },
      {
        id: 'q5',
        text: 'What does a JOIN clause do in SQL?',
        options: ['Splits tables', 'Deletes duplicate rows', 'Combines rows from two or more tables based on a related column', 'Creates a backup table'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Python programming basics',
    totalQuestions: 5,
    duration: 40,
    createdOn: '05 May 2024',
    questions: [
      {
        id: 'q1',
        text: 'What is the correct file extension for Python files?',
        options: ['.pyt', '.py', '.pyw', '.python'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'How do you output text in Python?',
        options: ['console.log("text")', 'print("text")', 'System.out.println("text")', 'echo("text")'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        text: 'Which collections are ordered and mutable in Python?',
        options: ['List', 'Tuple', 'Set', 'Dictionary'],
        correctAnswer: 0
      },
      {
        id: 'q4',
        text: 'How do you create a function in Python?',
        options: ['function myFunc():', 'void myFunc():', 'def myFunc():', 'create myFunc():'],
        correctAnswer: 2
      },
      {
        id: 'q5',
        text: 'Which keyword is used to handle exceptions in Python?',
        options: ['catch', 'except', 'try', 'finally'],
        correctAnswer: 1
      }
    ]
  }
];

// Preset student results matching screenshot 3
const DEFAULT_STUDENT_RESULTS = [
  { id: '1', name: 'Arjun Sharma', status: 'Completed', score: 22, totalQs: 25, percentage: 88, completedOn: '20 May 2024', testTitle: 'React Fundamentals' },
  { id: '2', name: 'Priya Patel', status: 'Completed', score: 20, totalQs: 25, percentage: 80, completedOn: '20 May 2024', testTitle: 'React Fundamentals' },
  { id: '3', name: 'Rahul Verma', status: 'Completed', score: 18, totalQs: 25, percentage: 72, completedOn: '19 May 2024', testTitle: 'React Fundamentals' },
  { id: '4', name: 'Sneha Reddy', status: 'In Progress', score: 15, totalQs: 25, percentage: 60, completedOn: '-', testTitle: 'React Fundamentals' },
  { id: '5', name: 'Karan Mehta', status: 'Completed', score: 14, totalQs: 25, percentage: 56, completedOn: '19 May 2024', testTitle: 'React Fundamentals' },
  { id: '6', name: 'Anjali Singh', status: 'Not Attempted', score: 0, totalQs: 25, percentage: 0, completedOn: '-', testTitle: 'React Fundamentals' }
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
    return saved ? JSON.parse(saved) : DEFAULT_TESTS;
  });

  // Student Results List (Visible to Creator)
  const [studentResults, setStudentResults] = useState(() => {
    const saved = localStorage.getItem('shai_student_results');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT_RESULTS;
  });

  // Charan's Completed Tests (Employee dashboard data helper)
  // Let's assume Charan completed "HTML & CSS" and "Database Basics" initially, out of 12 total.
  // We can track the specific tests Charan has completed.
  const [charanCompletedTests, setCharanCompletedTests] = useState(() => {
    const saved = localStorage.getItem('shai_charan_completed');
    return saved ? JSON.parse(saved) : [
      { id: 'html-css', title: 'HTML & CSS', score: 4, totalQs: 5, percentage: 80, completedOn: '15 May 2024' },
      { id: 'db-basics', title: 'Database Basics', score: 5, totalQs: 5, percentage: 100, completedOn: '10 May 2024' }
    ];
  });

  // Total Completed Tests Count = 12 (Charan's historical completed tests count)
  const [completedCountOffset, setCompletedCountOffset] = useState(() => {
    const saved = localStorage.getItem('shai_completed_offset');
    return saved ? parseInt(saved) : 10; // 10 historical + list size
  });

  // Save state updates to LocalStorage
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
    localStorage.setItem('shai_charan_completed', JSON.stringify(charanCompletedTests));
  }, [charanCompletedTests]);

  useEffect(() => {
    localStorage.setItem('shai_completed_offset', completedCountOffset.toString());
  }, [completedCountOffset]);

  // Actions
  const login = (role) => {
    let userData = null;
    if (role === 'student') {
      userData = { name: 'Charan', role: 'student', title: 'Employee' };
    } else if (role === 'creator') {
      userData = { name: 'Charan', role: 'creator', title: 'Course Creator' };
    }
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
  };

  // Create a new test
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

  // Update existing test
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

  // Delete test
  const deleteTest = (id) => {
    setTests(prev => prev.filter(test => test.id !== id));
    // If the test is in completed list for Charan, we can filter it or keep it.
  };

  // Submit test results (When Charan finishes a test)
  const submitTestResult = (testId, answers, score, totalQuestions) => {
    const matchedTest = tests.find(t => t.id === testId);
    if (!matchedTest) return;

    const percentage = Math.round((score / totalQuestions) * 100);
    const completedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // 1. Add to Charan's completed list
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
      // update it
      setCharanCompletedTests(prev => prev.map(c => 
        c.id === testId 
          ? { ...c, score, percentage, completedOn: completedDate } 
          : c
      ));
    }

    // 2. Add to Creator's Student Results list (So Charan's score displays under Creator dashboard)
    const charanResultId = `result-charan-${Date.now()}`;
    const newStudentResult = {
      id: charanResultId,
      name: 'Charan (You)',
      status: 'Completed',
      score,
      totalQs: totalQuestions,
      percentage,
      completedOn: completedDate,
      testTitle: matchedTest.title
    };

    setStudentResults(prev => [newStudentResult, ...prev]);
  };

  // Get Charan's stats (Upcoming, Completed, Results counts)
  // Let's filter out what's completed from the total tests.
  // There are standard active tests. Let's see which ones are not completed by Charan yet.
  const completedIds = charanCompletedTests.map(c => c.id);
  const upcomingTests = tests.filter(test => !completedIds.includes(test.id));
  
  // Stats for Charan
  const studentStats = {
    upcomingCount: upcomingTests.length,
    completedCount: completedCountOffset + charanCompletedTests.length, // historical count + active session completions
    resultsCount: completedCountOffset + charanCompletedTests.length
  };

  // Creator Stats / Test Overview (Summary metrics for chart display)
  // We can calculate this dynamically from the student results table
  const creatorStats = {
    totalStudents: 32, // constant base + any new submissions
    completed: 28,
    inProgress: 4,
    notAttempted: 0
  };

  // Calculate distributions for the donut chart
  // Base numbers: Excellent: 12, Good: 10, Average: 6, Poor: 4. Total = 32.
  // When a new result comes in, categorize it:
  // - Excellent: 80 - 100%
  // - Good: 60 - 79%
  // - Average: 40 - 59%
  // - Poor: 0 - 39%
  const getPerformanceDistribution = () => {
    let excellent = 12;
    let good = 10;
    let average = 6;
    let poor = 4;
    
    // Add dynamically submitted results beyond the default ones
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
        { name: 'Excellent (80-100%)', count: excellent, percentage: Math.round((excellent / total) * 1000) / 10, color: '#4ade80' }, // Green
        { name: 'Good (60-79%)', count: good, percentage: Math.round((good / total) * 1000) / 10, color: '#60a5fa' }, // Blue
        { name: 'Average (40-59%)', count: average, percentage: Math.round((average / total) * 1000) / 10, color: '#fbbf24' }, // Yellow/Orange
        { name: 'Poor (0-39%)', count: poor, percentage: Math.round((poor / total) * 1000) / 10, color: '#f87171' } // Red
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
      charanCompletedTests,
      submitTestResult,
      studentStats,
      upcomingTests,
      creatorStats,
      getPerformanceDistribution
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
