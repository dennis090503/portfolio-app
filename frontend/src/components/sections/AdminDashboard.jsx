import React, { useState, useEffect } from 'react';
import { Award, Briefcase, Code, Cpu, FolderGit2, LogOut, Plus, Trash2, Edit3, ArrowLeft, KeyRound, User, AlertCircle, CheckCircle, FileText, Upload, Eye } from 'lucide-react';
import ResumeModal from '../ui/ResumeModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('skills');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Data Lists
  const [skills, setSkills] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Resume State
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Form states for adding/editing items
  const [skillForm, setSkillForm] = useState({ id: null, category: '', items: '' });
  const [techForm, setTechForm] = useState({ id: null, name: '', icon: '' });
  const [expForm, setExpForm] = useState({ id: null, company: '', role: '', period: '', points: '', order: 0 });
  const [projectForm, setProjectForm] = useState({ id: null, title: '', description: '', image: '', github: '', demo: '', stack: '' });
  const [certForm, setCertForm] = useState({ id: null, title: '', issuer: '', url: '' });

  // Temporary message timer helper
  const showFeedback = (msg, isErr = false) => {
    if (isErr) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 4000);
  };

  // Fetch all lists from API
  const fetchData = async () => {
    try {
      const [skillsRes, techRes, expRes, projRes, certRes, configRes] = await Promise.all([
        fetch(`${API_BASE}/skills`),
        fetch(`${API_BASE}/techstack`),
        fetch(`${API_BASE}/experiences`),
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/certifications`),
        fetch(`${API_BASE}/config`)
      ]);

      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (techRes.ok) setTechStack(await techRes.json());
      if (expRes.ok) setExperiences(await expRes.json());
      if (projRes.ok) setProjects(await projRes.json());
      if (certRes.ok) setCertifications(await certRes.json());
      if (configRes.ok) {
        const config = await configRes.json();
        const rawUrl = config?.identity?.resumeUrl || '/uploads/resume.pdf';
        const backendHost = API_BASE.replace('/api', '');
        const finalUrl = rawUrl.startsWith('http') ? rawUrl : `${backendHost}${rawUrl}`;
        setResumeUrl(finalUrl);
      }
    } catch (err) {
      console.error("Error fetching admin data lists:", err);
      showFeedback("Could not connect to the backend server. Please verify it is running on port 5000.", true);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setIsUploadingResume(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const res = await fetch(`${API_BASE}/resume/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload resume PDF');
      }

      const backendHost = API_BASE.replace('/api', '');
      const finalUrl = data.resumeUrl.startsWith('http') ? data.resumeUrl : `${backendHost}${data.resumeUrl}`;
      setResumeUrl(finalUrl);
      setResumeFile(null);
      showFeedback('Resume PDF uploaded and replaced successfully!');
    } catch (err) {
      showFeedback(err.message, true);
    } finally {
      setIsUploadingResume(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Auth Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      showFeedback('Login successful! Welcomed to the portfolio operations grid.');
    } catch (err) {
      showFeedback(err.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    showFeedback('Logged out of operations terminal.');
  };

  // Header authorization helper
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // ================= CRUD Skills =================
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      category: skillForm.category,
      items: skillForm.items.split(',').map(s => s.trim()).filter(Boolean)
    };

    const isEdit = !!skillForm.id;
    const url = isEdit ? `${API_BASE}/skills/${skillForm.id}` : `${API_BASE}/skills`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save skill category');

      showFeedback(`Skill category '${payload.category}' saved successfully.`);
      setSkillForm({ id: null, category: '', items: '' });
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill category?")) return;
    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      showFeedback('Skill category deleted.');
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // ================= CRUD Tech Stack =================
  const handleTechSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!techForm.id;
    const url = isEdit ? `${API_BASE}/techstack/${techForm.id}` : `${API_BASE}/techstack`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ name: techForm.name, icon: techForm.icon })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save tech item');

      showFeedback(`Tech item '${techForm.name}' saved successfully.`);
      setTechForm({ id: null, name: '', icon: '' });
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const deleteTech = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tech icon?")) return;
    try {
      const res = await fetch(`${API_BASE}/techstack/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      showFeedback('Tech item deleted.');
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // ================= CRUD Experience =================
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      company: expForm.company,
      role: expForm.role,
      period: expForm.period,
      points: expForm.points.split('\n').map(p => p.trim()).filter(Boolean),
      order: Number(expForm.order) || 0
    };

    const isEdit = !!expForm.id;
    const url = isEdit ? `${API_BASE}/experiences/${expForm.id}` : `${API_BASE}/experiences`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save experience');

      showFeedback(`Experience at '${payload.company}' saved successfully.`);
      setExpForm({ id: null, company: '', role: '', period: '', points: '', order: 0 });
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const deleteExp = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      const res = await fetch(`${API_BASE}/experiences/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      showFeedback('Experience entry deleted.');
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // ================= CRUD Projects =================
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      image: projectForm.image,
      github: projectForm.github,
      demo: projectForm.demo,
      stack: projectForm.stack.split(',').map(s => s.trim()).filter(Boolean)
    };

    const isEdit = !!projectForm.id;
    const url = isEdit ? `${API_BASE}/projects/${projectForm.id}` : `${API_BASE}/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save project');

      showFeedback(`Project '${payload.title}' saved successfully.`);
      setProjectForm({ id: null, title: '', description: '', image: '', github: '', demo: '', stack: '' });
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      showFeedback('Project deleted.');
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // ================= CRUD Certifications =================
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!certForm.id;
    const url = isEdit ? `${API_BASE}/certifications/${certForm.id}` : `${API_BASE}/certifications`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ title: certForm.title, issuer: certForm.issuer, url: certForm.url })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save certification');

      showFeedback(`Certification '${certForm.title}' saved successfully.`);
      setCertForm({ id: null, title: '', issuer: '', url: '' });
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  const deleteCert = async (id) => {
    if (!window.confirm("Delete this certification?")) return;
    try {
      const res = await fetch(`${API_BASE}/certifications/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Delete failed');
      showFeedback('Certification deleted.');
      fetchData();
    } catch (err) {
      showFeedback(err.message, true);
    }
  };

  // Return to homepage trigger
  const goHome = () => {
    window.history.pushState({}, '', '/');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  // Render Login state if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-6 relative overflow-hidden noise">
        {/* Glow Decorators */}
        <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-accent/[0.05] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 w-96 h-96 bg-[#00F0FF]/[0.05] rounded-full blur-[100px]" />

        <div className="glass rounded-3xl p-8 md:p-10 w-full max-w-md border border-line/60 shadow-2xl relative">
          <button 
            onClick={goHome} 
            className="absolute top-6 left-6 text-xs text-text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Site
          </button>

          <div className="text-center mt-6 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Secure Decrypt Terminal</h2>
            <p className="text-xs text-text-muted mt-2">Enter credentials to modify portfolio records</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2.5 items-start">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="cyber_admin"
                  className="w-full bg-background border border-line rounded-xl pl-11 pr-4 py-3.5 text-sm text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent dark:focus:border-[#00F0FF] focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/60">
                  <KeyRound size={16} />
                </span>
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-background border border-line rounded-xl pl-11 pr-4 py-3.5 text-sm text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent dark:focus:border-[#00F0FF] focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-primary text-background dark:bg-accent dark:text-neutral-950 font-bold py-3.5 px-6 rounded-xl hover:opacity-90 disabled:opacity-50 shadow-[0_4px_20px_rgba(0,240,255,0.2)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Decrypting authorization...' : 'Decrypt and Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className="min-h-screen bg-background text-text py-16 md:py-24 noise">
      {/* Decors */}
      <div className="absolute top-10 left-10 -z-10 w-96 h-96 bg-accent/[0.02] rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-10 -z-10 w-96 h-96 bg-[#00F0FF]/[0.02] rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-line pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={goHome}
                className="text-xs text-text-muted hover:text-accent flex items-center gap-1 transition-colors bg-surface border border-line/60 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft size={12} /> Return Home
              </button>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                Authorized Admin Session
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-primary">Operations Center</h1>
            <p className="text-sm text-text-muted mt-1">Configure and manipulate your live portfolio databases</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold self-start sm:self-center"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2.5 items-start">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex gap-2.5 items-start">
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* TAB SIDEBAR SELECTORS */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-thin">
            {[
              { id: 'skills', label: 'Tools I work with', icon: Code },
              { id: 'techstack', label: 'Tech Stack', icon: Cpu },
              { id: 'experiences', label: 'Where I\'ve worked', icon: Briefcase },
              { id: 'projects', label: 'Things I\'ve built', icon: FolderGit2 },
              { id: 'certifications', label: 'Certifications', icon: Award },
              { id: 'resume', label: 'Resume Document', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold border transition-all whitespace-nowrap lg:whitespace-normal ${
                    isActive 
                      ? 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(0,240,255,0.08)]' 
                      : 'bg-surface border-line/60 hover:border-accent/40 text-text-muted hover:text-primary'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-accent' : 'text-text-muted'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CRITICAL TAB WORKSPACES */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* WORKSPACE 1: TOOLS I WORK WITH */}
            {activeTab === 'skills' && (
              <div className="glass border border-line/60 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-line pb-4 flex items-center gap-2">
                  <Code size={20} className="text-accent" /> Manage Tools Category
                </h2>

                <form onSubmit={handleSkillSubmit} className="grid md:grid-cols-12 gap-5 mb-8 items-end">
                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Category Name</label>
                    <input
                      type="text"
                      required
                      value={skillForm.category}
                      onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                      placeholder="e.g. Frontend"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-6 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      required
                      value={skillForm.items}
                      onChange={(e) => setSkillForm({ ...skillForm, items: e.target.value })}
                      placeholder="React, HTML, CSS"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-accent text-neutral-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1 hover:opacity-95 transition-opacity text-sm"
                    >
                      {skillForm.id ? <Edit3 size={16} /> : <Plus size={16} />}
                      {skillForm.id ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>

                {skillForm.id && (
                  <button 
                    onClick={() => setSkillForm({ id: null, category: '', items: '' })}
                    className="text-xs text-accent underline mb-6 block"
                  >
                    Cancel Editing (Create New instead)
                  </button>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Existing Skill Categories</h3>
                  {skills.length === 0 ? (
                    <p className="text-sm text-text-muted italic">No skill categories in database.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {skills.map(s => (
                        <div key={s._id} className="bg-background border border-line/60 rounded-2xl p-4 flex flex-col justify-between gap-4">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-accent">{s.category}</span>
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {s.items.map(item => (
                                <span key={item} className="text-xs px-2 py-0.5 rounded-md bg-surface border border-line text-text-muted">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-line/40">
                            <button
                              onClick={() => setSkillForm({ id: s._id || s.id, category: s.category, items: s.items.join(', ') })}
                              className="p-2 rounded-lg bg-surface hover:text-accent border border-line/40 transition-colors"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => deleteSkill(s._id)}
                              className="p-2 rounded-lg bg-surface hover:text-red-400 border border-line/40 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WORKSPACE 2: TECH STACK ICONS */}
            {activeTab === 'techstack' && (
              <div className="glass border border-line/60 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-line pb-4 flex items-center gap-2">
                  <Cpu size={20} className="text-accent" /> Manage Tech Stack
                </h2>

                <form onSubmit={handleTechSubmit} className="grid md:grid-cols-12 gap-5 mb-8 items-end">
                  <div className="md:col-span-5 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Technology Name</label>
                    <input
                      type="text"
                      required
                      value={techForm.name}
                      onChange={(e) => setTechForm({ ...techForm, name: e.target.value })}
                      placeholder="e.g. React"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-5 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Icon Asset URL (Optional)</label>
                    <input
                      type="text"
                      value={techForm.icon}
                      onChange={(e) => setTechForm({ ...techForm, icon: e.target.value })}
                      placeholder="https://cdn.example.com/react.svg"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-accent text-neutral-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1 hover:opacity-95 transition-opacity text-sm"
                    >
                      {techForm.id ? <Edit3 size={16} /> : <Plus size={16} />}
                      {techForm.id ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>

                {techForm.id && (
                  <button 
                    onClick={() => setTechForm({ id: null, name: '', icon: '' })}
                    className="text-xs text-accent underline mb-6 block"
                  >
                    Cancel Editing (Create New instead)
                  </button>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Existing Tech Icons</h3>
                  {techStack.length === 0 ? (
                    <p className="text-sm text-text-muted italic">No tech stack items in database.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {techStack.map(t => (
                        <div key={t._id} className="bg-background border border-line/60 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-3">
                          <div className="flex flex-col items-center gap-2">
                            {t.icon ? (
                              <img src={t.icon} alt={t.name} className="w-10 h-10 object-contain" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                                {t.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm font-semibold">{t.name}</span>
                          </div>
                          <div className="flex justify-center gap-1 w-full pt-2 border-t border-line/40">
                            <button
                              onClick={() => setTechForm({ id: t._id || t.id, name: t.name, icon: t.icon })}
                              className="p-1.5 rounded-lg bg-surface hover:text-accent border border-line/40 transition-colors text-xs"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => deleteTech(t._id)}
                              className="p-1.5 rounded-lg bg-surface hover:text-red-400 border border-line/40 transition-colors text-xs"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WORKSPACE 3: WHERE I'VE WORKED */}
            {activeTab === 'experiences' && (
              <div className="glass border border-line/60 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-line pb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-accent" /> Manage Experience
                </h2>

                <form onSubmit={handleExpSubmit} className="space-y-4 mb-8">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Company</label>
                      <input
                        type="text"
                        required
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        placeholder="e.g. XByte"
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Role</label>
                      <input
                        type="text"
                        required
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        placeholder="e.g. Junior Python Developer"
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Duration (Period)</label>
                      <input
                        type="text"
                        required
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        placeholder="e.g. Internship or Full-time (2024-2025)"
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Sort Order</label>
                      <input
                        type="number"
                        value={expForm.order}
                        onChange={(e) => setExpForm({ ...expForm, order: e.target.value })}
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Bullet Points (One per line)</label>
                    <textarea
                      required
                      rows={4}
                      value={expForm.points}
                      onChange={(e) => setExpForm({ ...expForm, points: e.target.value })}
                      placeholder="ETL Pipelines created&#10;APIs developed and consumed&#10;Error handling rules implemented"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-neutral-950 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity text-sm"
                  >
                    {expForm.id ? <Edit3 size={16} /> : <Plus size={16} />}
                    {expForm.id ? 'Save Experience Changes' : 'Add Experience'}
                  </button>
                </form>

                {expForm.id && (
                  <button 
                    onClick={() => setExpForm({ id: null, company: '', role: '', period: '', points: '', order: 0 })}
                    className="text-xs text-accent underline mb-6 block"
                  >
                    Cancel Editing (Create New instead)
                  </button>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Existing Experience History</h3>
                  {experiences.length === 0 ? (
                    <p className="text-sm text-text-muted italic">No experience records in database.</p>
                  ) : (
                    <div className="space-y-4">
                      {experiences.map(e => (
                        <div key={e._id} className="bg-background border border-line/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-lg text-primary">{e.role}</h4>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface border border-line text-text-muted">
                                Order: {e.order}
                              </span>
                            </div>
                            <p className="text-accent text-sm font-semibold mt-1">{e.company} ({e.period})</p>
                            <ul className="list-disc pl-5 text-sm text-text-muted mt-3 space-y-1">
                              {e.points.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>
                          <div className="flex sm:flex-col justify-end gap-2 border-t sm:border-t-0 sm:border-l border-line/40 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0">
                            <button
                              onClick={() => setExpForm({ id: e._id || e.id, company: e.company, role: e.role, period: e.period, points: e.points.join('\n'), order: e.order })}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface hover:text-accent border border-line/40 transition-colors text-xs font-semibold"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => deleteExp(e._id)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface hover:text-red-400 border border-line/40 transition-colors text-xs font-semibold"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WORKSPACE 4: THINGS I'VE BUILT */}
            {activeTab === 'projects' && (
              <div className="glass border border-line/60 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-line pb-4 flex items-center gap-2">
                  <FolderGit2 size={20} className="text-accent" /> Manage Projects
                </h2>

                <form onSubmit={handleProjectSubmit} className="space-y-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Project Title</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="Real-Time Chat App"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Write a clear summary of the project..."
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Image URL (Optional)</label>
                      <input
                        type="text"
                        value={projectForm.image}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="https://cdn.example.com/project.png"
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Tech Stack (Comma-separated)</label>
                      <input
                        type="text"
                        value={projectForm.stack}
                        onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
                        placeholder="React, Express, MongoDB, Socket.io"
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">GitHub Repository Link</label>
                      <input
                        type="text"
                        value={projectForm.github}
                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Live Demo Link</label>
                      <input
                        type="text"
                        value={projectForm.demo}
                        onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                        placeholder="https://demo.example.com"
                        className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-neutral-950 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity text-sm"
                  >
                    {projectForm.id ? <Edit3 size={16} /> : <Plus size={16} />}
                    {projectForm.id ? 'Save Project Changes' : 'Add Project'}
                  </button>
                </form>

                {projectForm.id && (
                  <button 
                    onClick={() => setProjectForm({ id: null, title: '', description: '', image: '', github: '', demo: '', stack: '' })}
                    className="text-xs text-accent underline mb-6 block"
                  >
                    Cancel Editing (Create New instead)
                  </button>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Existing Projects</h3>
                  {projects.length === 0 ? (
                    <p className="text-sm text-text-muted italic">No projects in database.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-5">
                      {projects.map(p => (
                        <div key={p._id} className="bg-background border border-line/60 rounded-2xl overflow-hidden flex flex-col justify-between border-b hover:border-accent/30 transition-all duration-300">
                          {p.image && (
                            <img src={p.image} alt={p.title} className="w-full h-32 object-cover border-b border-line" />
                          )}
                          <div className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-base text-primary">{p.title}</h4>
                              <p className="text-xs text-text-muted mt-1 line-clamp-2">{p.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2.5">
                                {p.stack?.map(tech => (
                                  <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-line text-text-muted">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-line/40 mt-4">
                              <button
                                onClick={() => setProjectForm({ id: p._id || p.id, title: p.title, description: p.description, image: p.image || '', github: p.github || '', demo: p.demo || '', stack: p.stack?.join(', ') || '' })}
                                className="p-1.5 rounded-lg bg-surface hover:text-accent border border-line/40 transition-colors text-xs"
                                title="Edit"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => deleteProject(p._id)}
                                className="p-1.5 rounded-lg bg-surface hover:text-red-400 border border-line/40 transition-colors text-xs"
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WORKSPACE 5: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="glass border border-line/60 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-line pb-4 flex items-center gap-2">
                  <Award size={20} className="text-accent" /> Manage Certifications
                </h2>

                <form onSubmit={handleCertSubmit} className="grid md:grid-cols-12 gap-4 mb-8 items-end">
                  <div className="md:col-span-4 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Title (Name)</label>
                    <input
                      type="text"
                      required
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      placeholder="e.g. Machine Learning"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Issuer (Optional)</label>
                    <input
                      type="text"
                      value={certForm.issuer}
                      onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                      placeholder="e.g. Coursera"
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Verification URL (Optional)</label>
                    <input
                      type="text"
                      value={certForm.url}
                      onChange={(e) => setCertForm({ ...certForm, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-accent text-neutral-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1 hover:opacity-95 transition-opacity text-sm"
                    >
                      {certForm.id ? <Edit3 size={16} /> : <Plus size={16} />}
                      {certForm.id ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>

                {certForm.id && (
                  <button 
                    onClick={() => setCertForm({ id: null, title: '', issuer: '', url: '' })}
                    className="text-xs text-accent underline mb-6 block"
                  >
                    Cancel Editing (Create New instead)
                  </button>
                )}

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Existing Accomplishments</h3>
                  {certifications.length === 0 ? (
                    <p className="text-sm text-text-muted italic">No certifications in database.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {certifications.map(c => (
                        <div key={c._id} className="bg-background border border-line/60 rounded-2xl p-4 flex flex-col justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-sm text-primary">{c.title}</h4>
                            {c.issuer && <p className="text-xs text-accent mt-0.5">{c.issuer}</p>}
                            {c.url && (
                              <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-text-muted underline mt-2 block truncate">
                                {c.url}
                              </a>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 pt-2 border-t border-line/40">
                            <button
                              onClick={() => setCertForm({ id: c._id || c.id, title: c.title, issuer: c.issuer || '', url: c.url || '' })}
                              className="p-1.5 rounded-lg bg-surface hover:text-accent border border-line/40 transition-colors text-xs"
                              title="Edit"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={() => deleteCert(c._id)}
                              className="p-1.5 rounded-lg bg-surface hover:text-red-400 border border-line/40 transition-colors text-xs"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WORKSPACE 6: RESUME MANAGEMENT */}
            {activeTab === 'resume' && (
              <div className="glass border border-line/60 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-primary border-b border-line pb-4 flex items-center gap-2">
                  <FileText size={20} className="text-accent" /> Manage Resume Document
                </h2>

                <div className="space-y-6">
                  {/* Active Resume Status */}
                  <div className="bg-background border border-line/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">Active Resume URL</span>
                      <p className="text-sm font-semibold text-primary mt-1 truncate max-w-md">
                        {resumeUrl ? resumeUrl : 'No custom resume PDF uploaded yet.'}
                      </p>
                    </div>
                    {resumeUrl && (
                      <button
                        type="button"
                        onClick={() => setIsResumeOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent font-semibold text-xs hover:bg-accent/20 transition-all self-start sm:self-auto"
                      >
                        <Eye size={15} /> Preview PDF
                      </button>
                    )}
                  </div>

                  {/* Upload / Replace Form */}
                  <form onSubmit={handleResumeUpload} className="bg-surface/50 border border-line/60 rounded-2xl p-6 space-y-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                      <Upload size={16} className="text-accent" /> Upload / Replace PDF Document
                    </h3>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-text-muted">Select New PDF File (Max 10MB)</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        required
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="block w-full text-sm text-text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-neutral-950 hover:file:opacity-90 transition-all bg-background border border-line rounded-xl p-2"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isUploadingResume || !resumeFile}
                      className="w-full bg-accent text-neutral-950 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-opacity text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                    >
                      <Upload size={16} />
                      {isUploadingResume ? 'Uploading PDF...' : 'Upload & Replace Resume'}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Resume PDF Viewer Modal */}
      <ResumeModal 
        isOpen={isResumeOpen} 
        onClose={() => setIsResumeOpen(false)} 
        resumeUrl={resumeUrl} 
      />
    </div>
  );
}