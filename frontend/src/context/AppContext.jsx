import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default initial tests (Hybrid / Short Answer Focus for evaluation)
const DEFAULT_TESTS = [
  {
    id: 'js-basics',
    title: 'JavaScript & Web Engineering',
    category: 'Software Engineering',
    frequencyType: 'one_time',
    attemptsAllowed: 3,
    shuffleQuestions: true,
    randomizeQuestions: true,
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
        correctAnswer: 1,
        maxMarks: 1
      },
      {
        id: 'q2',
        type: 'short_ans',
        text: 'Explain the difference between undefined and null in JavaScript.',
        sampleAnswer: 'undefined means a variable has been declared but not assigned a value, whereas null is an assignment value that represents no value or an empty object.',
        keywords: ['declared', 'unassigned', 'object', 'empty', 'primitive'],
        maxMarks: 5
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'What is event delegation in JavaScript and why is it beneficial for DOM management?',
        sampleAnswer: 'Event delegation is a technique of using event bubbling to handle events at a higher level in the DOM tree (parent) rather than attaching listeners to multiple child elements.',
        keywords: ['event bubbling', 'parent', 'listeners', 'performance', 'DOM'],
        maxMarks: 5
      },
      {
        id: 'q4',
        type: 'mcq',
        text: 'Which built-in property returns the length of a string in JavaScript?',
        options: ['length()', 'size()', 'length', 'index()'],
        correctAnswer: 2,
        maxMarks: 1
      }
    ]
  },
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals & Component Architecture',
    category: 'Web Development',
    frequencyType: 'weekly',
    attemptsAllowed: 2,
    shuffleQuestions: true,
    randomizeQuestions: true,
    description: 'React core concepts assessment with code snippets and short answer evaluations',
    totalQuestions: 4,
    duration: 45,
    createdOn: '18 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'What hook is used to perform side effects in React functional components?',
        options: ['useState', 'useContext', 'useEffect', 'useMemo'],
        correctAnswer: 2,
        maxMarks: 1
      },
      {
        id: 'q2',
        type: 'short_ans',
        text: 'What is the Virtual DOM in React and why is it beneficial for performance?',
        sampleAnswer: 'The Virtual DOM is an in-memory representation of the real DOM. React computes differences (diffing) and batches updates to update only changed DOM nodes efficiently.',
        keywords: ['in-memory', 'diffing', 'reconciliation', 'batching', 'real DOM'],
        maxMarks: 5
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'Explain the key differences between props and state in React components.',
        sampleAnswer: 'Props are read-only immutable inputs passed from parent to child components, whereas state is internal, mutable data managed within the component.',
        keywords: ['immutable', 'parent to child', 'mutable', 'internal', 'state'],
        maxMarks: 5
      },
      {
        id: 'q4',
        type: 'mcq',
        text: 'What is the purpose of the key prop when rendering lists in React?',
        options: ['To uniquely identify elements among siblings for reconciliation', 'To encrypt list items', 'To apply CSS styles to elements', 'To bind state to elements'],
        correctAnswer: 0,
        maxMarks: 1
      }
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS Design System',
    category: 'UI/UX Design',
    frequencyType: 'one_time',
    attemptsAllowed: 1,
    shuffleQuestions: false,
    randomizeQuestions: false,
    description: 'HTML structure, CSS Flexbox/Grid, and box model short answer evaluation',
    totalQuestions: 3,
    duration: 20,
    createdOn: '15 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'What does CSS stand for?',
        options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        maxMarks: 1
      },
      {
        id: 'q2',
        type: 'short_ans',
        text: 'Describe the CSS Box Model components from inside to outside.',
        sampleAnswer: 'Content, Padding, Border, and Margin.',
        keywords: ['Content', 'Padding', 'Border', 'Margin'],
        maxMarks: 5
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'Explain the primary difference between CSS Flexbox and CSS Grid layout systems.',
        sampleAnswer: 'Flexbox is designed for one-dimensional layouts (row OR column), while CSS Grid is designed for two-dimensional layouts (rows AND columns simultaneously).',
        keywords: ['one-dimensional', 'two-dimensional', 'row', 'column', 'grid'],
        maxMarks: 5
      }
    ]
  },
  {
    id: 'db-basics',
    title: 'Database & SQL Engineering',
    category: 'Database Systems',
    frequencyType: 'monthly',
    attemptsAllowed: 3,
    shuffleQuestions: true,
    randomizeQuestions: false,
    description: 'Relational database concepts, SQL joins, and key indexing evaluation',
    totalQuestions: 3,
    duration: 30,
    createdOn: '12 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Logic', 'Sequential Question List', 'System Query Layer'],
        correctAnswer: 0,
        maxMarks: 1
      },
      {
        id: 'q2',
        type: 'short_ans',
        text: 'Explain the difference between INNER JOIN and LEFT JOIN in SQL.',
        sampleAnswer: 'INNER JOIN returns only matching records from both tables. LEFT JOIN returns all records from the left table and matched records from the right table.',
        keywords: ['matching', 'both tables', 'left table', 'all records', 'nulls'],
        maxMarks: 5
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'What is the difference between a Primary Key and a Foreign Key in relational databases?',
        sampleAnswer: 'A Primary Key uniquely identifies each row in a table. A Foreign Key is a column that refers to the Primary Key of another table to establish relationships.',
        keywords: ['unique', 'identifies', 'referential integrity', 'relationship', 'another table'],
        maxMarks: 5
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python Programming & Data Structures',
    category: 'Data Science',
    frequencyType: 'weekly',
    attemptsAllowed: 5,
    shuffleQuestions: true,
    randomizeQuestions: true,
    description: 'Python syntax, list comprehensions, and data structures evaluation',
    totalQuestions: 3,
    duration: 40,
    createdOn: '10 May 2024',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        text: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correctAnswer: 1,
        maxMarks: 1
      },
      {
        id: 'q2',
        type: 'short_ans',
        text: 'Explain the key differences between Python lists and tuples.',
        sampleAnswer: 'Lists are mutable (modifiable) and defined with square brackets []. Tuples are immutable (read-only) and defined with parentheses ().',
        keywords: ['mutable', 'immutable', 'brackets', 'parentheses', 'tuple'],
        maxMarks: 5
      },
      {
        id: 'q3',
        type: 'short_ans',
        text: 'What is a list comprehension in Python and why is it used?',
        sampleAnswer: 'List comprehension provides a concise, readable syntax for creating new lists based on existing iterables, e.g., [x*2 for x in range(5)].',
        keywords: ['concise', 'syntax', 'iterable', 'new list', 'expression'],
        maxMarks: 5
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
  { 
    id: '1', 
    name: 'Arjun Sharma', 
    role: 'Sr. Software Engineer', 
    status: 'Needs Correction', 
    score: 3.5, 
    totalQs: 4, 
    percentage: 88, 
    highestPercentage: 92, 
    reattempts: 3, 
    completedOn: '20 May 2024', 
    timeTaken: '27 mins', 
    testId: 'react-fundamentals',
    testTitle: 'React Fundamentals & Component Architecture', 
    cohort: 'Full-Stack Web Dev 2026-A',
    answers: {
      0: 2, // q1 useEffect
      1: 0, // q2 state updates
      2: 'The Virtual DOM is an in-memory light copy of the real DOM tree. React computes diffs and updates only modified elements.', // q3 short answer
      3: 0  // q4 key prop
    },
    corrections: {
      2: { mark: 'half', points: 0.5, feedback: 'Good explanation of in-memory structure and diffing, but missed details on batching DOM updates.' }
    }
  },
  { 
    id: '2', 
    name: 'Priya Patel', 
    role: 'Data Specialist', 
    status: 'Graded & Corrected', 
    score: 4, 
    totalQs: 4, 
    percentage: 100, 
    highestPercentage: 100, 
    reattempts: 2, 
    completedOn: '20 May 2024', 
    timeTaken: '29 mins', 
    testId: 'react-fundamentals',
    testTitle: 'React Fundamentals & Component Architecture', 
    cohort: 'Full-Stack Web Dev 2026-A',
    answers: {
      0: 2,
      1: 0,
      2: 'Virtual DOM is a virtual representation of UI kept in memory and synced with real DOM by React DOM via reconciliation. It minimizes expensive direct DOM manipulations.',
      3: 0
    },
    corrections: {
      2: { mark: 'full', points: 1.0, feedback: 'Excellent full explanation covering reconciliation and performance benefits!' }
    }
  },
  { 
    id: '3', 
    name: 'Rahul Verma', 
    role: 'UI/UX Developer', 
    status: 'Needs Correction', 
    score: 2.5, 
    totalQs: 4, 
    percentage: 63, 
    highestPercentage: 80, 
    reattempts: 4, 
    completedOn: '19 May 2024', 
    timeTaken: '25 mins', 
    testId: 'js-basics',
    testTitle: 'JavaScript & Web Engineering', 
    cohort: 'Full-Stack Web Dev 2026-A',
    answers: {
      0: 1, // ===
      1: 'Undefined means variable is empty and unassigned. Null means null object created intentionally.',
      2: 0, // 0
      3: 0  // wrong
    },
    corrections: {
      1: { mark: 'half', points: 0.5, feedback: 'Basic definition provided, but clarify that undefined is default unassigned state.' }
    }
  },
  { 
    id: '4', 
    name: 'Sneha Reddy', 
    role: 'QA Automation Lead', 
    status: 'In Progress', 
    score: 2, 
    totalQs: 4, 
    percentage: 50, 
    highestPercentage: 68, 
    reattempts: 1, 
    completedOn: '-', 
    timeTaken: '-', 
    testId: 'react-fundamentals',
    testTitle: 'React Fundamentals & Component Architecture', 
    cohort: 'Full-Stack Web Dev 2026-A' 
  },
  { 
    id: '5', 
    name: 'Karan Mehta', 
    role: 'Backend Engineer', 
    status: 'Needs Correction', 
    score: 2, 
    totalQs: 4, 
    percentage: 50, 
    highestPercentage: 64, 
    reattempts: 2, 
    completedOn: '19 May 2024', 
    timeTaken: '38 mins', 
    testId: 'js-basics',
    testTitle: 'JavaScript & Web Engineering', 
    cohort: 'Data Science & Backend Cohort',
    answers: {
      0: 1,
      1: 'Undefined means variable is declared but not initialized with a value. Null is explicit assignment representing no object value.',
      2: 1,
      3: 2
    },
    corrections: {
      1: { mark: 'pending', points: 0.0, feedback: '' }
    }
  },
  { 
    id: '6', 
    name: 'Anjali Singh', 
    role: 'DevOps Specialist', 
    status: 'Not Attempted', 
    score: 0, 
    totalQs: 4, 
    percentage: 0, 
    highestPercentage: 0, 
    reattempts: 0, 
    completedOn: '-', 
    timeTaken: '-', 
    testId: 'react-fundamentals',
    testTitle: 'React Fundamentals & Component Architecture', 
    cohort: 'Data Science & Backend Cohort' 
  },
  { 
    id: '7', 
    name: 'Vikram Das', 
    role: 'Data Scientist', 
    status: 'Needs Correction', 
    score: 3, 
    totalQs: 4, 
    percentage: 75, 
    highestPercentage: 96, 
    reattempts: 1, 
    completedOn: '18 May 2024', 
    timeTaken: '22 mins', 
    testId: 'react-fundamentals',
    testTitle: 'React Fundamentals & Component Architecture', 
    cohort: 'Data Science & Backend Cohort',
    answers: {
      0: 2,
      1: 0,
      2: 'It is a shadow DOM used to speed up browser renders by buffering changes in memory before painting.',
      3: 0
    },
    corrections: {
      2: { mark: 'pending', points: 0.0, feedback: '' }
    }
  },
  { 
    id: '8', 
    name: 'Meera Kapoor', 
    role: 'Lead Frontend Architect', 
    status: 'Graded & Corrected', 
    score: 3, 
    totalQs: 3, 
    percentage: 100, 
    highestPercentage: 100, 
    reattempts: 0, 
    completedOn: '17 May 2024', 
    timeTaken: '18 mins', 
    testId: 'html-css',
    testTitle: 'HTML & CSS Design System', 
    cohort: 'UI/UX & Frontend Mastery',
    answers: {
      0: 1,
      1: 0,
      2: 'Content, Padding, Border, and Margin from inside out.'
    },
    corrections: {
      2: { mark: 'full', points: 1.0, feedback: 'Spot-on order of box model components!' }
    }
  },
  { 
    id: '9', 
    name: 'Rohan Gupta', 
    role: 'Full Stack Engineer', 
    status: 'Needs Correction', 
    score: 3, 
    totalQs: 4, 
    percentage: 75, 
    highestPercentage: 90, 
    reattempts: 3, 
    completedOn: '16 May 2024', 
    timeTaken: '30 mins', 
    testId: 'js-basics',
    testTitle: 'JavaScript & Web Engineering', 
    cohort: 'UI/UX & Frontend Mastery',
    answers: {
      0: 1,
      1: 'Undefined means uninitialized variable. Null is an object assigned to denote clear absence of value.',
      2: 0,
      3: 2
    },
    corrections: {
      1: { mark: 'pending', points: 0.0, feedback: '' }
    }
  },
  { 
    id: '10', 
    name: 'Charan (You)', 
    role: 'Software Architect', 
    status: 'Needs Correction', 
    score: 6, 
    totalQs: 3, 
    percentage: 55, 
    highestPercentage: 75, 
    reattempts: 2, 
    completedOn: '28 Jul 2026', 
    timeTaken: '22 mins', 
    testId: 'db-basics',
    testTitle: 'Database & SQL Engineering', 
    cohort: 'Data Science & Backend Cohort',
    answers: {
      0: 0,
      1: 'INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from left table and matched rows from right table.',
      2: 'Primary key uniquely identifies a row in a table. Foreign key links to primary key of another table.'
    },
    corrections: {
      1: { mark: 'pending', points: 0.0, feedback: '' },
      2: { mark: 'pending', points: 0.0, feedback: '' }
    }
  },
  { 
    id: '11', 
    name: 'Siddharth Rao', 
    role: 'Data Engineer', 
    status: 'Needs Correction', 
    score: 5, 
    totalQs: 3, 
    percentage: 45, 
    highestPercentage: 60, 
    reattempts: 1, 
    completedOn: '25 Jul 2026', 
    timeTaken: '31 mins', 
    testId: 'python-basics',
    testTitle: 'Python Programming & Data Structures', 
    cohort: 'Data Science & Backend Cohort',
    answers: {
      0: 1,
      1: 'Lists use square brackets and are mutable. Tuples use parentheses and cannot be modified.',
      2: 'List comprehension is a single line for loop syntax to build a list.'
    },
    corrections: {
      1: { mark: 'pending', points: 0.0, feedback: '' },
      2: { mark: 'pending', points: 0.0, feedback: '' }
    }
  },
  { 
    id: '12', 
    name: 'Neha Roy', 
    role: 'Frontend Developer', 
    status: 'Needs Correction', 
    score: 6, 
    totalQs: 3, 
    percentage: 55, 
    highestPercentage: 80, 
    reattempts: 1, 
    completedOn: '24 Jul 2026', 
    timeTaken: '15 mins', 
    testId: 'html-css',
    testTitle: 'HTML & CSS Design System', 
    cohort: 'UI/UX & Frontend Mastery',
    answers: {
      0: 1,
      1: 'Content, Padding, Border, Margin from inside out.',
      2: 'Flexbox is 1D row or column layout. Grid is 2D rows and columns layout.'
    },
    corrections: {
      1: { mark: 'pending', points: 0.0, feedback: '' },
      2: { mark: 'pending', points: 0.0, feedback: '' }
    }
  }
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

// Default System Users with multi-role assignment and active/inactive status
const DEFAULT_SYSTEM_USERS = [
  { id: 'u1', name: 'Arjun Sharma', email: 'arjun.sharma@example.com', roles: ['Student', 'Instructor'], userStatus: 'Active', addedOn: '20 May 2024' },
  { id: 'u2', name: 'Priya Patel', email: 'priya.patel@example.com', roles: ['Test Creator', 'Instructor'], userStatus: 'Active', addedOn: '20 May 2024' },
  { id: 'u3', name: 'Rahul Verma', email: 'rahul.verma@example.com', roles: ['Student'], userStatus: 'Active', addedOn: '19 May 2024' },
  { id: 'u4', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', roles: ['Test Creator', 'Student'], userStatus: 'Active', addedOn: '19 May 2024' },
  { id: 'u5', name: 'Karan Mehta', email: 'karan.mehta@example.com', roles: ['Instructor'], userStatus: 'Inactive', addedOn: '19 May 2024' },
  { id: 'u6', name: 'Anjali Singh', email: 'anjali.singh@example.com', roles: ['Student'], userStatus: 'Inactive', addedOn: '18 May 2024' },
  { id: 'u7', name: 'Vikram Das', email: 'vikram.das@example.com', roles: ['Test Creator', 'Admin'], userStatus: 'Active', addedOn: '18 May 2024' },
  { id: 'u8', name: 'Meera Kapoor', email: 'meera.kapoor@example.com', roles: ['Test Creator', 'Instructor'], userStatus: 'Active', addedOn: '17 May 2024' },
  { id: 'u9', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', roles: ['Student'], userStatus: 'Active', addedOn: '16 May 2024' },
  { id: 'u10', name: 'Charan (Admin)', email: 'charan.admin@example.com', roles: ['Admin', 'Test Creator'], userStatus: 'Active', addedOn: '01 May 2024' }
];

export const AppProvider = ({ children }) => {
  // System Users state
  const [systemUsers, setSystemUsers] = useState(() => {
    const saved = localStorage.getItem('shai_system_users');
    return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_USERS;
  });
  // Authentication & Users
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shai_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Tests
  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem('shai_tests');
    let loadedData = saved ? JSON.parse(saved) : DEFAULT_TESTS;
    
    // Merge/enrich with DEFAULT_TESTS so every assessment has hybrid/short answer questions with model answer keys
    return DEFAULT_TESTS.map(defTest => {
      const match = (loadedData || []).find(t => t.id === defTest.id || t.title === defTest.title) || defTest;
      const hasShortAns = match.questions?.some(q => q.type === 'short_ans');
      const questions = hasShortAns ? match.questions : defTest.questions;

      return {
        ...defTest,
        ...match,
        questions: (questions || defTest.questions).map(q => {
          let type = q?.type || 'mcq';
          if (type === 'embedded' && (!q?.codeSnippet || q.codeSnippet.trim() === '') && q?.options && q.options.length > 0) {
            type = 'mcq';
          }
          return { ...q, type, maxMarks: q?.maxMarks || (type === 'short_ans' ? 5 : 1) };
        })
      };
    });
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
      const combined = Array.isArray(parsed) ? [...parsed] : [...DEFAULT_STUDENT_RESULTS];
      DEFAULT_STUDENT_RESULTS.forEach(def => {
        if (!combined.some(c => c.id === def.id || (c.name === def.name && c.testId === def.testId))) {
          combined.push(def);
        }
      });

      return combined.map((item, idx) => {
        const def = DEFAULT_STUDENT_RESULTS.find(d => d.id === item.id || d.name === item.name) || DEFAULT_STUDENT_RESULTS[idx % DEFAULT_STUDENT_RESULTS.length];
        const randomReattempt = def?.reattempts ?? (item.id === '1' ? 3 : item.id === '2' ? 2 : item.id === '3' ? 4 : item.id === '4' ? 1 : item.id === '5' ? 2 : 0);
        const randomHighest = def?.highestPercentage ?? (item.percentage ? Math.min(100, item.percentage + 4) : 0);
        return {
          ...def,
          ...item,
          answers: item.answers || def?.answers || {},
          corrections: item.corrections || def?.corrections || {},
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

  // Auth Login (Mock mode enabled for frontend-only testing)
  const login = async (identifier, password, roleHint) => {
    const MOCK_LOGIN_ENABLED = true;
    const mockWait = (data) =>
      new Promise((resolve) => setTimeout(() => resolve(data), 400));

    // MOCK MODE: return a fake successful login response so the UI works
    // without the backend. To switch back to the real API later, set this to
    // false and uncomment the real fetch block below.
    if (MOCK_LOGIN_ENABLED) {
      const finalRole = (roleHint || 'student').toLowerCase();
      const userData = {
        user_id: 1,
        full_name: 'Test User',
        email: identifier || 'test@x.com',
        role: finalRole,
        name: 'Test User',
        title: finalRole === 'admin' ? 'Administrator' : finalRole === 'creator' ? 'Course Creator' : 'Employee',
        token: 'fake-token-123'
      };

      await mockWait(userData);
      setUser(userData);
      return userData;
    }

    // REAL MODE (uncomment once the backend is running):
    // try {
    //   const response = await fetch('http://localhost:8000/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ identifier, password })
    //   });
    //
    //   if (response.ok) {
    //     const data = await response.json();
    //     const serverRole = data.user?.role?.toLowerCase() || 'student';
    //     const finalRole = roleHint || serverRole;
    //     const userData = {
    //       name: data.user?.username || identifier,
    //       role: finalRole,
    //       title: finalRole === 'admin' ? 'Administrator' : finalRole === 'creator' ? 'Course Creator' : 'Employee',
    //       token: data.access_token
    //     };
    //     setUser(userData);
    //     return userData;
    //   } else {
    //     const errData = await response.json().catch(() => ({}));
    //     throw new Error(errData.detail || 'Invalid login credentials.');
    //   }
    // } catch (err) {
    //   const lower = identifier ? identifier.toLowerCase().trim() : '';
    //   let role = roleHint;
    //   if (!role) {
    //     if (lower === 'admin') role = 'admin';
    //     else if (lower === 'creator' || lower === 'teacher') role = 'creator';
    //     else role = 'student';
    //   }
    //
    //   const title = role === 'admin' ? 'Administrator' : role === 'creator' ? 'Course Creator' : 'Employee';
    //   const defaultName = role === 'admin' ? 'Charan (Admin)' : role === 'creator' ? 'Charan (Course Creator)' : 'Charan';
    //
    //   const userData = {
    //     name: (identifier && !['charan', 'admin', 'creator'].includes(lower)) ? identifier : defaultName,
    //     role: role,
    //     title: title
    //   };
    //   setUser(userData);
    //   return userData;
    // }
  };

  const logout = () => {
    setUser(null);
  };

  // Test Actions
  const createTest = (newTest) => {
    const formattedTest = {
      id: newTest.id || `test-${Date.now()}`,
      title: newTest.title,
      category: newTest.category || 'General',
      frequencyType: newTest.frequencyType || 'one_time',
      attemptsAllowed: newTest.attemptsAllowed !== undefined ? newTest.attemptsAllowed : 1,
      shuffleQuestions: !!newTest.shuffleQuestions,
      randomizeQuestions: !!newTest.randomizeQuestions,
      description: newTest.description,
      totalQuestions: newTest.questions ? newTest.questions.length : 0,
      duration: parseInt(newTest.duration) || 30,
      createdOn: newTest.createdOn || new Date().toLocaleDateString('en-GB', {
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
          category: updatedTest.category !== undefined ? updatedTest.category : test.category,
          frequencyType: updatedTest.frequencyType !== undefined ? updatedTest.frequencyType : test.frequencyType,
          attemptsAllowed: updatedTest.attemptsAllowed !== undefined ? updatedTest.attemptsAllowed : test.attemptsAllowed,
          shuffleQuestions: updatedTest.shuffleQuestions !== undefined ? updatedTest.shuffleQuestions : test.shuffleQuestions,
          randomizeQuestions: updatedTest.randomizeQuestions !== undefined ? updatedTest.randomizeQuestions : test.randomizeQuestions,
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

    const hasShortAns = matchedTest.questions?.some(q => q.type === 'short_ans');
    const initialStatus = hasShortAns ? 'Needs Correction' : 'Completed';

    const charanResultId = `result-charan-${Date.now()}`;
    const newStudentResult = {
      id: charanResultId,
      name: user?.name ? `${user.name} (You)` : 'Charan (You)',
      role: 'Employee / Engineer',
      status: initialStatus,
      score,
      totalQs: totalQuestions,
      percentage,
      highestPercentage: currentHighest,
      reattempts: existingAttemptCount,
      completedOn: completedDate,
      testId: matchedTest.id,
      testTitle: matchedTest.title,
      cohort: 'Full-Stack Web Dev 2026-A',
      answers: answers || {},
      corrections: {}
    };

    setStudentResults(prev => [newStudentResult, ...prev]);
  };

  // Grade Student Submission (manual correction for short answer questions)
  const gradeStudentSubmission = (resultId, updatedCorrections, finalScore, finalPercentage, newStatus = 'Graded & Corrected') => {
    setStudentResults(prev => prev.map(item => {
      if (item.id === resultId) {
        return {
          ...item,
          corrections: { ...(item.corrections || {}), ...updatedCorrections },
          score: finalScore,
          percentage: finalPercentage,
          status: newStatus
        };
      }
      return item;
    }));
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

  // System Users LocalStorage Persistence
  useEffect(() => {
    localStorage.setItem('shai_system_users', JSON.stringify(systemUsers));
  }, [systemUsers]);

  // System Users Actions
  const addSystemUser = (newUser) => {
    const userObj = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email || `${newUser.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      roles: Array.isArray(newUser.roles) && newUser.roles.length > 0 ? newUser.roles : ['Student'],
      userStatus: newUser.userStatus || 'Active',
      addedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setSystemUsers(prev => [userObj, ...prev]);
  };

  const updateSystemUser = (id, updatedData) => {
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
  };

  const toggleUserStatus = (id) => {
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, userStatus: u.userStatus === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const deleteSystemUser = (id) => {
    setSystemUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
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
      setStudentResults,
      gradeStudentSubmission,
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