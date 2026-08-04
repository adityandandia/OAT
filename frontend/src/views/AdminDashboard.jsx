import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LayoutDashboard, FileText, Users, Settings as SettingsIcon, LogOut, Search, Plus, Eye, Edit2, Trash2, ShieldCheck, Key, ShieldAlert, BarChart3, Award, UserPlus, FolderPlus, ArrowRight, CheckCircle2, RotateCcw, X } from 'lucide-react';

const DEFAULT_PERMISSIONS = [
  {
    role: 'Admin',
    icon: 'A',
    description: 'Full system & platform access',
    color: 'bg-purple-100 text-purple-700',
    rights: { read: true, write: true, execute: true, create: true, delete: true }
  },
  {
    role: 'Course Creator',
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

const AdminDashboard = () => {
  const { user, logout, studentResults, cohorts } = useApp();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [searchUser, setSearchUser] = useState('');
  const [rolePermissions, setRolePermissions] = useState(DEFAULT_PERMISSIONS);
  const [saveToast, setSaveToast] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTogglePermission = (roleName, permKey) => {
    setRolePermissions(prev =>
      prev.map(r => {
        if (r.role === roleName) {
          return {
            ...r,
            rights: {
              ...r.rights,
              [permKey]: !r.rights[permKey]
            }
          };
        }
        return r;
      })
    );
  };

  const handleToggleRow = (roleName) => {
    setRolePermissions(prev =>
      prev.map(r => {
        if (r.role === roleName) {
          const allChecked = Object.values(r.rights).every(Boolean);
          const newRights = {};
          Object.keys(r.rights).forEach(k => { newRights[k] = !allChecked; });
          return { ...r, rights: newRights };
        }
        return r;
      })
    );
  };

  const handleSavePermissions = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetPermissions = () => {
    setRolePermissions(DEFAULT_PERMISSIONS);
    setSaveToast(false);
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
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in">
            {saveToast && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Roles & Permissions matrix updated and saved successfully!</span>
                </div>
                <button onClick={() => setSaveToast(false)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900">Roles & Permissions Matrix</h3>
                <p className="text-sm text-gray-500 mt-1">Control role access across the application using interactive checkboxes.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleResetPermissions}
                  className="rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button 
                  onClick={handleSavePermissions}
                  className="rounded-2xl bg-purple-900 hover:bg-purple-950 text-white px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-900/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs bg-white">
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

            {/* Bottom Legend */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800">Matrix Legend:</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span> Checked = Enabled</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Unchecked = Disabled</span>
              </div>
              <div className="text-gray-500 font-medium">
                Permissions configured in matrix format affect all user groups dynamically.
              </div>
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
