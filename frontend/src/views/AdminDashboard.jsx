import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LayoutDashboard, FileText, Users, Settings as SettingsIcon, LogOut, Search, Plus, Eye, Edit2, Trash2, ShieldCheck, Key, ShieldAlert, BarChart3, Award, UserPlus, FolderPlus, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout, studentResults, cohorts } = useApp();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchUser, setSearchUser] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredStudents = studentResults.filter(student =>
    student.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    student.cohort.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#f8f2ff] text-slate-900">
      <aside className="w-72 bg-white border-r border-gray-150 px-6 py-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-3xl bg-[#e54e73] text-white grid place-items-center text-xl font-bold">A</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">Admin Portal</p>
              <h1 className="font-display font-black text-lg text-slate-900">CourseHub</h1>
            </div>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Users', icon: Users },
              { name: 'Roles & Permissions', icon: ShieldCheck },
              { name: 'Create Test', icon: Plus },
              { name: 'All Tests', icon: FileText },
              { name: 'Cohort', icon: FolderPlus },
              { name: 'Results', icon: BarChart3 },
              { name: 'Settings', icon: SettingsIcon }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full text-left rounded-2xl px-4 py-3 flex items-center gap-3 transition ${isActive ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="bg-[#f4efff] rounded-3xl p-5 border border-purple-100">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Message</p>
          <p className="mt-3 text-sm text-slate-800 font-semibold">Users, roles, and permissions in one place.</p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full py-3 rounded-2xl bg-purple-900 text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2">Manage users, roles, tests, and course assignments.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
            <Bell className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-slate-700">{user?.name || 'Admin'}</span>
          </div>
        </header>

        {activeMenu === 'Dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Total Students</p>
              <p className="mt-4 text-3xl font-extrabold text-purple-900">{studentResults.length}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Active Cohorts</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{cohorts.filter(c => c.status === 'Active').length}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Pending Reviews</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{Math.max(0, 12 - studentResults.length)}</p>
            </div>
          </div>
        )}

        {activeMenu === 'Users' && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Users</h3>
                <p className="text-sm text-gray-500 mt-1">Add, edit, or remove people and assign roles.</p>
              </div>
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full rounded-full border border-gray-200 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
                <Search className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.3em] text-gray-400 bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Added On</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {filteredStudents.slice(0, 8).map((student) => (
                    <tr key={student.id || student.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-semibold">{student.name}</td>
                      <td className="py-4 px-4">{student.role || 'Student'}</td>
                      <td className="py-4 px-4">{student.status}</td>
                      <td className="py-4 px-4">{student.completedOn || '—'}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500"><Eye className="w-4 h-4" /></button>
                          <button className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeMenu === 'Roles & Permissions' && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Roles & Permissions</h3>
                <p className="text-sm text-gray-500 mt-1">Control role access across the app.</p>
              </div>
              <button className="rounded-2xl bg-purple-900 text-white px-5 py-3 text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: 'Admin', description: 'Full system access', settings: ['Read', 'Write', 'Execute', 'Create'] },
                { label: 'Course Creator', description: 'Builds and manages tests', settings: ['Read', 'Write', 'Create'] },
                { label: 'Instructor', description: 'Reviews cohorts and results', settings: ['Read', 'Execute'] },
                { label: 'Student', description: 'Takes assigned tests', settings: ['Read', 'Execute'] }
              ].map((role) => (
                <div key={role.label} className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-3xl bg-purple-100 grid place-items-center text-purple-700 font-bold">{role.label[0]}</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{role.label}</h4>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">
                    {['Read', 'Write', 'Execute', 'Create'].map((perm) => (
                      <span key={perm} className={role.settings.includes(perm) ? 'text-purple-700' : 'text-gray-300'}>{perm}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {['Create Test', 'All Tests', 'Cohort', 'Results', 'Settings'].includes(activeMenu) && (
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">{activeMenu}</h3>
                <p className="text-sm text-gray-500 mt-1">{activeMenu === 'Create Test' ? 'Build and assign a new assessment.' : activeMenu === 'All Tests' ? 'Review all existing tests.' : activeMenu === 'Cohort' ? 'Manage student groups and batches.' : activeMenu === 'Results' ? 'View aggregated outcomes.' : 'Update platform-wide settings.'}</p>
              </div>
              {activeMenu === 'Create Test' && (
                <button className="rounded-2xl bg-purple-900 text-white px-5 py-3 text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Test
                </button>
              )}
            </header>
            <div className="rounded-3xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
              {activeMenu} panel content goes here.
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
