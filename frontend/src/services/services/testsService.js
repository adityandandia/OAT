// src/services/testsService.js
//
// HOW THIS WORKS:
// - Every function below is what your React pages call.
// - Right now they return fake data (with a fake network delay) so you can
//   build the UI without DB access.
// - Later, delete the "MOCK MODE" block inside each function and uncomment
//   the real fetch() call. The page components never change.

const MOCK_DELAY = 400;
const mockWait = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));

const buildAuditFields = (prefix = "created") => ({
  is_valid: true,
  created_by: 1,
  created_on: "2026-08-22T10:00:00.000Z",
  created_from_system: "OneTest-Web",
  created_from_system_account: "system",
  created_from_mac_address: "00:00:00:00:00:00",
  created_from_ip_lan: "127.0.0.1",
  created_from_ip_wan: "0.0.0.0",
  last_modified_by: 1,
  last_modified_on: "2026-08-22T10:00:00.000Z",
  modified_from_system: "OneTest-Web",
  modified_from_system_account: "system",
  modified_from_mac_address: "00:00:00:00:00:00",
  modified_from_ip_lan: "127.0.0.1",
  modified_from_ip_wan: "0.0.0.0",
});

// ---- Fake in-memory data, shaped like the real tables ----
let MOCK_TESTS = [
  {
    test_id: 1,
    test_title: "JavaScript Basics",
    description: "Test on basic JavaScript concepts",
    duration_minutes: 30,
    question_count: 4,
    type_mix: ["MCQ", "SHORT"],
    ...buildAuditFields(),
  },
  {
    test_id: 2,
    test_title: "React Fundamentals",
    description: "React core concepts assessment",
    duration_minutes: 45,
    question_count: 4,
    type_mix: ["MCQ", "SHORT"],
    ...buildAuditFields(),
  },
];

let MOCK_COURSES = [
  {
    course_id: 1,
    course_title: "Full Stack Web Development 2026",
    category_name: "Web Engineering",
    instructor: "Dr. Ramesh Kumar",
    progress_percent: 75,
    up_next_module: "Redux Toolkit Async Thunks",
    ...buildAuditFields(),
  },
];

// =====================================================================
// ALL TESTS PAGE  (Image 2)
// =====================================================================
export async function getAllTests() {
  // MOCK MODE
  return mockWait(MOCK_TESTS);

  // REAL MODE (uncomment once DB access is live):
  // const res = await fetch("/api/tests");
  // if (!res.ok) throw new Error("Failed to load tests");
  // return res.json();
}

export async function deleteTest(test_id) {
  MOCK_TESTS = MOCK_TESTS.filter((t) => t.test_id !== test_id);
  return mockWait({ success: true });

  // REAL MODE:
  // const res = await fetch(`/api/tests/${test_id}`, { method: "DELETE" });
  // return res.json();
}

// =====================================================================
// CREATE NEW ASSESSMENT MODAL  (Image 1)
// =====================================================================
export async function createTest(payload) {
  // payload shape the form should send:
  // {
  //   test_title: string,
  //   duration_minutes: number,
  //   description: string,
  //   test_freq: "One-Time" | "Weekly" | "Monthly",
  //   questions: [
  //     {
  //       question_type: "MCQ" | "Short Ans" | "Embedded",
  //       question: string,
  //       max_marks: number,
  //       options: [{ option_text: string, is_correct: boolean }]
  //     }
  //   ]
  // }

  const newTest = {
    test_id: Date.now(),
    test_title: payload.test_title,
    description: payload.description,
    duration_minutes: payload.duration_minutes,
    question_count: payload.questions?.length ?? 0,
    type_mix: [...new Set((payload.questions || []).map((q) => q.question_type))],
    ...buildAuditFields(),
  };
  MOCK_TESTS = [...MOCK_TESTS, newTest];
  return mockWait(newTest);

  // REAL MODE:
  // const res = await fetch("/api/tests", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error("Failed to create test");
  // return res.json();
}

// =====================================================================
// ENROLLED COURSES PAGE  (Image 3)
// =====================================================================
export async function getEnrolledCourses() {
  // NOTE: progress_percent / up_next_module aren't in the finalized
  // schema yet (no Enrollment/progress table) — this is a placeholder
  // shape until that table is added. Flag this to your DB owner.
  return mockWait(MOCK_COURSES);

  // REAL MODE:
  // const res = await fetch("/api/courses/enrolled");
  // return res.json();
}
