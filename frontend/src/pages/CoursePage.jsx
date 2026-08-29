import { useEffect, useState } from "react";
import { getEnrolledCourses } from "../services/testsService";

const categoryStyles = {
  "Web Engineering": "bg-violet-100 text-violet-700",
  "Data Science": "bg-cyan-100 text-cyan-700",
  "Product Design": "bg-amber-100 text-amber-700",
  "Business": "bg-emerald-100 text-emerald-700",
  default: "bg-slate-100 text-slate-700",
};

function CoursePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getEnrolledCourses().then((data) => {
      console.log("Got enrolled courses:", data);
      setCourses(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Course</h1>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200">
              🔔
            </button>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-semibold text-white">
                JS
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Jane Smith</div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Enrolled Courses &amp; Curriculum</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track modules, watch lecture recordings, and access study materials.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const badgeClass = categoryStyles[course.category_name] || categoryStyles.default;
            const progress = Math.min(Math.max(Number(course.progress_percent) || 0, 0), 100);

            return (
              <div key={course.course_id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
                    {course.category_name}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-slate-900">{course.course_title}</h3>

                <p className="mb-5 text-sm text-slate-600">
                  Instructor: <span className="font-medium text-slate-700">{course.instructor}</span>
                </p>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Course Progress</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="mb-5 rounded-xl bg-slate-50 p-3">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    UP NEXT
                  </div>
                  <div className="text-sm font-medium text-slate-700">{course.up_next_module}</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    alert(`Continue Learning clicked: ${course.course_title}`);
                    console.log("Continue Learning:", course.course_title);
                  }}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Continue Learning
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
