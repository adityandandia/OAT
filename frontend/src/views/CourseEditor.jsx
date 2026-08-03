import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Edit2, Trash2 } from 'lucide-react';

const CourseEditor = () => {
  const { courses, createCourse, updateCourse, deleteCourse } = useApp();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [status, setStatus] = useState('Active');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (courseId) {
      const course = courses.find((item) => item.id === courseId);
      if (course) {
        setTitle(course.title);
        setDescription(course.description);
        setDuration(course.duration.toString());
        setStatus(course.status || 'Active');
        setIsEditing(true);
      }
    }
  }, [courseId, courses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      duration: parseInt(duration, 10) || 30,
      status,
    };

    if (isEditing) {
      updateCourse(courseId, payload);
    } else {
      createCourse(payload);
    }
    navigate('/creator');
  };

  const handleDelete = () => {
    if (!courseId) return;
    if (window.confirm('Delete this course permanently?')) {
      deleteCourse(courseId);
      navigate('/creator');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2ff] p-10 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#8b4bd4] via-[#b668d4] to-[#e54e73] px-8 py-8 text-white">
          <button onClick={() => navigate('/creator')} className="flex items-center gap-2 text-sm text-white/85 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Creator
          </button>
          <h1 className="font-display text-3xl font-extrabold">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>
          <p className="mt-2 text-sm text-white/80">Add or update course metadata, duration, and description.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid gap-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Course Title
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="e.g. Full Stack Foundations"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
              Estimated Duration (mins)
              <input
                required
                type="number"
                min="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
                placeholder="30"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Course Description
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              className="rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
              placeholder="Describe the course goals, details, and learning outcomes."
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-3xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </label>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-500">
              {isEditing ? 'Make changes and save the course.' : 'Create a new course to assign to cohorts.'}
            </div>
            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-3xl border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  <Trash2 className="inline w-4 h-4 mr-2" /> Delete
                </button>
              )}
              <button
                type="submit"
                className="rounded-3xl bg-[#e54e73] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:bg-[#d03b60] flex items-center gap-2"
              >
                {isEditing ? 'Save Course' : 'Create Course'}
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
