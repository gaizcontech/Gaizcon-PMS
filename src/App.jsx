import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AuthPanel from './components/AuthPanel';
import SideNavigation from './components/SideNavigation';
import Navbar from './components/Navbar';
import UserPicker from './components/UserPicker';

const STORAGE_KEY = 'project-defect-manager:v1';
const AUTH_KEY = 'project-defect-manager:auth';

const sampleState = {
  users: [
    {
      id: 'user-1',
      name: 'Avery Patel',
      email: 'avery@projecthub.com',
      password: 'demo123',
      role: 'Product Lead',
    },
    {
      id: 'user-2',
      name: 'Jordan Lee',
      email: 'jordan@projecthub.com',
      password: 'tracker',
      role: 'Engineering Manager',
    },
  ],
  projects: [
    {
      id: 'project-1',
      name: 'Customer Portal Redesign',
      description: 'Modernize the portal UI, workflows, and release plan.',
      status: 'Active',
      owner: 'Avery Patel',
      dueDate: '2026-07-15',
      type: 'Design',
      priority: 'High',
    },
    {
      id: 'project-2',
      name: 'Mobile Defect Tracker',
      description: 'Build a mobile-friendly defect logging flow.',
      status: 'Planning',
      owner: 'Jordan Lee',
      dueDate: '2026-08-05',
      type: 'Development',
      priority: 'Medium',
    },
  ],
  defects: [
    {
      id: 'defect-1',
      title: 'Login flow freezes after invalid MFA',
      description: 'The login experience halts when an invalid MFA code is entered, blocking access to the app.',
      projectId: 'project-1',
      status: 'Open',
      priority: 'Critical',
      type: 'Bug',
      assignee: 'Sam Morgan',
      createdAt: '2026-05-01',
      labels: ['Authentication', 'Frontend'],
      estimate: 8,
    },
    {
      id: 'defect-2',
      title: 'Missing validation on phone input',
      description: 'Phone number field bypasses formatting checks on mobile devices.',
      projectId: 'project-2',
        estimate: 8,
        comments: [
          { id: 'comment-1', author: 'Jordan Lee', message: 'This needs a quick fix before the next release.', time: '09:30 AM' },
        ],
      status: 'In Progress',
      priority: 'High',
      type: 'Task',
      assignee: 'Riley Quin',
      createdAt: '2026-05-08',
      labels: ['Validation', 'Mobile'],
      estimate: 5,
    },
    {
      id: 'defect-3',
      title: 'Export report dropdown overlap',
      description: 'Dropdown menu overlaps export action buttons on smaller screens.',
        estimate: 5,
        comments: [
          { id: 'comment-2', author: 'Mina Torres', message: 'Need to agree on phone mask before next sprint.', time: '11:12 AM' },
        ],
      projectId: 'project-1',
      status: 'Resolved',
      priority: 'Medium',
      type: 'Improvement',
      assignee: 'Mina Torres',
      createdAt: '2026-05-14',
      labels: ['Reports', 'UI'],
      estimate: 3,
    },
  ],
  team: [
    {
        estimate: 3,
        comments: [
          { id: 'comment-3', author: 'Sam Morgan', message: 'Verified layout fix in mobile preview.', time: 'Yesterday' },
        ],
      id: 'team-1',
      name: 'Avery Patel',
      email: 'avery@projecthub.com',
      role: 'Product Lead',
      status: 'Available',
      focus: 'Strategy',
      capacity: 12,
    },
    {
      id: 'team-2',
      name: 'Jordan Lee',
      email: 'jordan@projecthub.com',
      role: 'Engineering Manager',
      status: 'Busy',
      focus: 'Release enablement',
      capacity: 10,
    },
    {
      id: 'team-3',
      name: 'Mina Torres',
      email: 'mina@projecthub.com',
      role: 'QA Lead',
      status: 'Available',
      focus: 'Regression testing',
      capacity: 8,
    },
    {
      id: 'team-4',
      name: 'Sam Morgan',
      email: 'sam@projecthub.com',
      role: 'Frontend Engineer',
      status: 'Busy',
      focus: 'UI fixes',
      capacity: 7,
    },
  ],
  notifications: [
    {
      id: 'note-1',
      title: 'Design review scheduled',
      description: 'UI review for the portal redesign happens at 11:00 AM.',
      type: 'Planning',
    },
    {
      id: 'note-2',
      title: 'Critical defect created',
      description: 'A blocker was reported on the login flow.',
      type: 'Alert',
    },
    {
      id: 'note-3',
      title: 'New team member added',
      description: 'Mina has joined the QA team for release testing.',
      type: 'Team',
    },
  ],
  activity: [
    {
      id: 'activity-1',
      message: 'Project Portal Redesign moved to Active.',
      time: '09:03 AM',
    },
    {
      id: 'activity-2',
      message: 'New defect logged for export reports.',
      time: '08:42 AM',
    },
    {
      id: 'activity-3',
      message: 'Jordan updated the mobile tracker roadmap.',
      time: 'Yesterday',
    },
  ],
};

const navItems = ['Dashboard', 'Projects', 'Sprint', 'Defects', 'Reports', 'Team'];
const statusOptions = ['All', 'Backlog', 'Planning', 'Active', 'Completed'];
const defectStatuses = ['Open', 'In Progress', 'Review', 'Resolved'];
const priorityOptions = ['All', 'Critical', 'High', 'Medium', 'Low'];
const issueTypeOptions = ['All', 'Bug', 'Task', 'Story', 'Improvement'];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleState;
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : sampleState.users,
      projects: Array.isArray(parsed.projects) ? parsed.projects : sampleState.projects,
      defects: Array.isArray(parsed.defects) ? parsed.defects : sampleState.defects,
      team: Array.isArray(parsed.team) ? parsed.team : sampleState.team,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : sampleState.notifications,
      activity: Array.isArray(parsed.activity) ? parsed.activity : sampleState.activity,
      ...parsed,
    };
  } catch (error) {
    return sampleState;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadAuthId() {
  try {
    return localStorage.getItem(AUTH_KEY);
  } catch (error) {
    return null;
  }
}

function saveAuthId(userId) {
  if (userId) {
    localStorage.setItem(AUTH_KEY, userId);
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

function App() {
  const [data, setData] = useState(loadState);
  const [currentUserId, setCurrentUserId] = useState(loadAuthId);
  const [authMode, setAuthMode] = useState('login');
  const [view, setView] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [defectTypeFilter, setDefectTypeFilter] = useState('All');
  const [selectedDefectId, setSelectedDefectId] = useState(null);
  const [viewMode, setViewMode] = useState('board');
  const [selectedDefectIds, setSelectedDefectIds] = useState([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkModalAction, setBulkModalAction] = useState('assign');
  const [commentText, setCommentText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [projectForm, setProjectForm] = useState(null);
  const [defectForm, setDefectForm] = useState(null);
  const [teamForm, setTeamForm] = useState(null);
  const [authError, setAuthError] = useState('');

  const currentUser = useMemo(
    () => data.users.find((user) => user.id === currentUserId) || null,
    [currentUserId, data.users]
  );

  useEffect(() => {
    saveState(data);
  }, [data]);

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    saveAuthId(currentUserId);
  }, [currentUserId]);

  const summary = useMemo(() => {
    const totalProjects = data.projects.length;
    const activeProjects = data.projects.filter((project) => project.status === 'Active').length;
    const totalDefects = data.defects.length;
    const openDefects = data.defects.filter((defect) => defect.status === 'Open').length;
    const criticalDefects = data.defects.filter((defect) => defect.priority === 'Critical').length;
    const unresolvedRatio = totalDefects ? Math.round((openDefects / totalDefects) * 100) : 0;
    return { totalProjects, activeProjects, totalDefects, openDefects, criticalDefects, unresolvedRatio };
  }, [data]);

  const defectSeverityCounts = useMemo(() => {
    return priorityOptions.slice(1).map((priority) => ({
      label: priority,
      count: data.defects.filter((defect) => defect.priority === priority).length,
    }));
  }, [data.defects]);

  const teamInsights = useMemo(() => ({
    available: data.team.filter((member) => member.status === 'Available').length,
    busy: data.team.filter((member) => member.status === 'Busy').length,
    totalWorkload: data.team.reduce(
      (sum, member) => sum + data.defects.filter((defect) => defect.assignee === member.name).length,
      0
    ),
  }), [data.team, data.defects]);

  const filteredProjects = data.projects.filter((project) => {
    const lowerSearch = search.toLowerCase();
    const matchesSearch = project.name.toLowerCase().includes(lowerSearch) ||
      project.description.toLowerCase().includes(lowerSearch) ||
      project.owner.toLowerCase().includes(lowerSearch) ||
      project.type.toLowerCase().includes(lowerSearch);
    const matchesStatus = projectFilter === 'All' || project.status === projectFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDefects = data.defects.filter((defect) => {
    // support simple token search like "assignee:Jordan priority:High"
    const tokens = search.split(/\s+/).filter(Boolean);
    let remaining = tokens.slice();
    const matchesTokens = () => {
      for (const t of tokens) {
        const [k, ...rest] = t.split(':');
        if (rest.length === 0) continue;
        const v = rest.join(':').toLowerCase();
        if (k === 'assignee' && !defect.assignee.toLowerCase().includes(v)) return false;
        if (k === 'priority' && defect.priority.toLowerCase() !== v) return false;
        if (k === 'project' && !defectProject(defect.projectId).toLowerCase().includes(v)) return false;
        if (k === 'label' && !(defect.labels || []).some(l => l.toLowerCase() === v)) return false;
        // remove token from remaining
      }
      return true;
    };
    const lowerSearch = search.toLowerCase();
    const matchesSearch = defect.title.toLowerCase().includes(lowerSearch) ||
      defect.description.toLowerCase().includes(lowerSearch) ||
      defect.type.toLowerCase().includes(lowerSearch) ||
      defect.assignee.toLowerCase().includes(lowerSearch) ||
      defectProject(defect.projectId).toLowerCase().includes(lowerSearch);
    if (search.includes(':')) {
      return matchesTokens() && matchesPriority && matchesType;
    }
    const matchesPriority = priorityFilter === 'All' || defect.priority === priorityFilter;
    const matchesType = defectTypeFilter === 'All' || defect.type === defectTypeFilter;
    return matchesSearch && matchesPriority && matchesType;
  });

  const projectsByStatus = statusOptions.slice(1).map((status) => ({
    status,
    items: filteredProjects.filter((project) => project.status === status),
  }));

  const defectsByStatus = defectStatuses.map((status) => ({
    status,
    items: filteredDefects.filter((defect) => defect.status === status),
  }));

  const selectedDefect = useMemo(
    () => data.defects.find((defect) => defect.id === selectedDefectId) || null,
    [selectedDefectId, data.defects]
  );

  const canEditField = (field) => {
    if (!currentUser) return false;
    const role = currentUser.role || '';
    if (role === 'Product Lead') return true;
    if (role === 'Engineering Manager') {
      if (['assignee', 'status', 'estimate'].includes(field)) return true;
      if (field === 'description' || field === 'title') return true;
      return false;
    }
    // assignees can edit description and add comments
    if (field === 'description' || field === 'comments') return true;
    return false;
  };

  useEffect(() => {
    if (!selectedDefectId) {
      setCommentText('');
    }
  }, [selectedDefectId]);

  const handleAddComment = (event) => {
    event.preventDefault();
    if (!commentText.trim() || !selectedDefect) return;

    const comment = {
      id: `comment-${Date.now()}`,
      author: currentUser?.name || 'You',
      message: commentText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setData((prev) => ({
      ...prev,
      defects: prev.defects.map((defect) =>
        defect.id === selectedDefect.id
          ? { ...defect, comments: [...(defect.comments || []), comment] }
          : defect
      ),
    }));

    setCommentText('');
  };

  const currentSprintName = 'Sprint 7: Growth Pulse';
  const sprintBacklog = data.defects.filter((defect) => defect.status === 'Open' || defect.status === 'In Progress');
  const backlogProjects = data.projects.filter((project) => project.status === 'Backlog' || project.status === 'Planning');
  const totalSprintEstimate = sprintBacklog.reduce((sum, item) => sum + (Number(item.estimate) || 0), 0);

  const defectsByPriority = priorityOptions.slice(1).map((priority) => ({
    label: priority,
    count: data.defects.filter((defect) => defect.priority === priority).length,
  }));

  const completedRate = data.projects.length
    ? Math.round((data.projects.filter((project) => project.status === 'Completed').length / data.projects.length) * 100)
    : 0;

  const defectVelocity = Math.max(1, Math.round(data.defects.length / 3));

  const dueThisWeek = data.projects.filter((project) => {
    const due = new Date(project.dueDate);
    const now = new Date();
    const diff = Math.round((due - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;

  const teamAssignments = data.team.map((member) => ({
    ...member,
    workload: data.defects.filter((defect) => defect.assignee === member.name).length,
  }));

  const recentActivity = [...data.activity].reverse().slice(0, 6);

  function defectProject(projectId) {
    return data.projects.find((project) => project.id === projectId)?.name || 'Unassigned';
  }

  const logActivity = (message) => {
    setData((prev) => ({
      ...prev,
      activity: [
        ...prev.activity,
        { id: `activity-${Date.now()}`, message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ],
    }));
  };

  const normalizeOrders = () => {
    setData((prev) => {
      const byStatus = {};
      prev.defects.forEach((d) => {
        const s = d.status || 'Open';
        if (!byStatus[s]) byStatus[s] = [];
        byStatus[s].push(d);
      });
      const updated = prev.defects.map((d) => ({ ...d }));
      Object.keys(byStatus).forEach((status) => {
        const list = byStatus[status].sort((a, b) => (b.order || 0) - (a.order || 0));
        list.forEach((item, idx) => {
          const found = updated.find((u) => u.id === item.id);
          if (found) found.order = list.length - idx;
        });
      });
      return { ...prev, defects: updated };
    });
  };

  const toggleSelectDefect = (id) => {
    setSelectedDefectIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAllVisible = () => {
    const ids = filteredDefects.map((d) => d.id);
    setSelectedDefectIds(ids);
  };

  const clearSelection = () => setSelectedDefectIds([]);

  const bulkUpdate = (updates) => {
    setData((prev) => ({
      ...prev,
      defects: prev.defects.map((defect) => (selectedDefectIds.includes(defect.id) ? { ...defect, ...updates } : defect)),
    }));
    logActivity(`Bulk updated ${selectedDefectIds.length} items.`);
    clearSelection();
  };

  const bulkAssign = () => {
    setBulkModalAction('assign');
    setBulkModalOpen(true);
  };

  const bulkChangeStatus = () => {
    setBulkModalAction('status');
    setBulkModalOpen(true);
  };

  const bulkAddLabel = () => {
    setBulkModalAction('label');
    setBulkModalOpen(true);
  };

  // Drag and drop handlers for board columns
  const onDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOverColumn = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDropOnColumn = (event, status) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    if (!id) return;
    // if dropped onto same column as reordering, ignore here
    const defect = data.defects.find((d) => d.id === id);
    if (!defect) return;
    if (defect.status === status) {
      // reorder to end
      const maxOrder = Math.max(0, ...data.defects.filter(d => d.status === status).map(d => d.order || 0));
      updateDefect({ id, order: maxOrder + 1 });
    } else {
      updateDefect({ id, status, order: Date.now() });
    }
    logActivity(`Moved ${id} to ${status}.`);
  };

  // handle reordering within column via drag to specific position
  const onDropReorder = (event, targetId) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    if (!id || id === targetId) return;
    const target = data.defects.find((d) => d.id === targetId);
    const dragged = data.defects.find((d) => d.id === id);
    if (!target || !dragged) return;
    if (target.status !== dragged.status) return;
    // set dragged order slightly before target
    const newOrder = (target.order || 0) - 1;
    updateDefect({ id, order: newOrder });
    logActivity(`Reordered ${id} before ${targetId}`);
  };

  const handleLogin = (values) => {
    const user = data.users.find((current) => current.email === values.email && current.password === values.password);
    if (!user) {
      setAuthError('Email or password is incorrect.');
      return;
    }

    setCurrentUserId(user.id);
    setAuthError('');
    setView('Dashboard');
  };

  const handleSignup = (values) => {
    if (data.users.some((user) => user.email === values.email)) {
      setAuthError('An account already exists for this email.');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: values.name,
      email: values.email,
      password: values.password,
      role: 'Contributor',
    };

    setData((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    setCurrentUserId(newUser.id);
    setAuthError('');
    setView('Dashboard');
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    setAuthMode('login');
    setView('Dashboard');
  };

  const resetWorkspace = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(AUTH_KEY);
    setData(JSON.parse(JSON.stringify(sampleState)));
    setCurrentUserId(null);
    setAuthMode('login');
    setView('Dashboard');
    setSearch('');
    setProjectFilter('All');
    setPriorityFilter('All');
    setProjectForm(null);
    setDefectForm(null);
    setAuthError('');
  };

  const updateProject = (updates) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => (project.id === updates.id ? { ...project, ...updates } : project)),
    }));
    logActivity(`Project “${updates.name}” was updated.`);
  };

  const removeProject = (projectId) => {
    const project = data.projects.find((item) => item.id === projectId);
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId),
      defects: prev.defects.filter((defect) => defect.projectId !== projectId),
    }));
    logActivity(`Project “${project?.name || 'unknown'}” was deleted.`);
  };

  const addProject = (project) => {
    const created = { ...project, id: `project-${Date.now()}` };
    setData((prev) => ({ ...prev, projects: [...prev.projects, created] }));
    logActivity(`Project “${created.name}” was created.`);
  };

  const addDefect = (defect) => {
    const created = {
      ...defect,
      id: `defect-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      estimate: Number(defect.estimate) || 1,
      comments: defect.comments || [],
      order: Date.now(),
    };
    setData((prev) => ({ ...prev, defects: [...prev.defects, created] }));
    logActivity(`Defect “${created.title}” was reported.`);
  };

  const updateDefect = (updates) => {
    setData((prev) => ({
      ...prev,
      defects: prev.defects.map((defect) => (defect.id === updates.id ? { ...defect, ...updates } : defect)),
    }));
    logActivity(`Defect “${updates.title}” status changed to ${updates.status}.`);
  };

  const removeDefect = (defectId) => {
    const defect = data.defects.find((item) => item.id === defectId);
    setData((prev) => ({ ...prev, defects: prev.defects.filter((defect) => defect.id !== defectId) }));
    logActivity(`Defect “${defect?.title || 'unknown'}” was deleted.`);
  };

  const handleProjectSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = {
      id: projectForm?.id,
      name: form.get('name').trim(),
      description: form.get('description').trim(),
      status: form.get('status'),
      owner: form.get('owner').trim(),
      dueDate: form.get('dueDate'),
      type: form.get('type'),
      priority: form.get('priority'),
    };

    if (!payload.name || !payload.owner || !payload.type) return;

    if (projectForm?.mode === 'edit') {
      updateProject(payload);
    } else {
      addProject(payload);
    }

    setProjectForm(null);
  };

  const handleDefectSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = {
      id: defectForm?.id,
      title: form.get('title').trim(),
      description: form.get('description').trim(),
      type: form.get('type'),
      priority: form.get('priority'),
      status: form.get('status'),
      assignee: form.get('assignee').trim(),
      projectId: form.get('projectId'),
      labels: form.get('labels') ? form.get('labels').split(',').map((label) => label.trim()).filter(Boolean) : [],
      estimate: Number(form.get('estimate')) || 1,
    };

    if (!payload.title || !payload.assignee || !payload.projectId) return;

    if (defectForm?.mode === 'edit') {
      updateDefect(payload);
    } else {
      addDefect(payload);
    }

    setDefectForm(null);
  };

  const projectActions = (mode) => {
    if (mode === 'Projects') {
      setProjectForm({
        mode: 'create',
        name: '',
        description: '',
        status: 'Planning',
        owner: currentUser?.name || '',
        dueDate: '',
        type: 'Development',
        priority: 'Medium',
      });
      return;
    }

    if (mode === 'Defects') {
      setDefectForm({
        mode: 'create',
        title: '',
        description: '',
        type: 'Bug',
        priority: 'High',
        status: 'Open',
        assignee: currentUser?.name || '',
        projectId: data.projects[0]?.id || '',
        labels: [],
        estimate: 3,
      });
      return;
    }

    if (mode === 'Team') {
      setTeamForm({
        mode: 'create',
        name: '',
        email: '',
        role: '',
        status: 'Available',
        focus: '',
        capacity: 8,
      });
      return;
    }
  };

  const exportCsv = () => {
    const rows = [
      ['Type', 'ID', 'Title', 'Status', 'Priority', 'Owner / Assignee', 'Project', 'Due / Created'],
      ...data.projects.map((project) => [
        'Project',
        project.id,
        project.name,
        project.status,
        '',
        project.owner,
        '',
        project.dueDate,
      ]),
      ...data.defects.map((defect) => [
        'Defect',
        defect.id,
        defect.title,
        defect.status,
        defect.priority,
        defect.assignee,
        defectProject(defect.projectId),
        defect.createdAt,
      ]),
    ];

    const csvContent = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'enterprise-portfolio-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFilteredCsv = () => {
    const rows = [
      ['ID', 'Title', 'Status', 'Priority', 'Assignee', 'Project', 'Labels', 'Estimate', 'Created'],
      ...filteredDefects.map((defect) => [
        defect.id,
        defect.title,
        defect.status,
        defect.priority,
        defect.assignee,
        defectProject(defect.projectId),
        (defect.labels || []).join('; '),
        defect.estimate,
        defect.createdAt,
      ]),
    ];

    const csvContent = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered-defects-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const bulkResolveOpenDefects = () => {
    setData((prev) => ({
      ...prev,
      defects: prev.defects.map((defect) =>
        defect.status === 'Open' ? { ...defect, status: 'Resolved' } : defect
      ),
    }));
    logActivity('Bulk resolved all open defects.');
  };

  const addTeamMember = (member) => {
    const created = { ...member, id: `team-${Date.now()}` };
    setData((prev) => ({ ...prev, team: [...prev.team, created] }));
    logActivity(`Team member “${created.name}” was added.`);
  };

  const updateTeamMember = (member) => {
    setData((prev) => ({
      ...prev,
      team: prev.team.map((item) => (item.id === member.id ? { ...item, ...member } : item)),
    }));
    logActivity(`Team member “${member.name}” was updated.`);
  };

  const removeTeamMember = (memberId) => {
    const member = data.team.find((item) => item.id === memberId);
    setData((prev) => ({ ...prev, team: prev.team.filter((item) => item.id !== memberId) }));
    logActivity(`Team member “${member?.name || 'untitled'}” was removed.`);
  };

  const handleTeamSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const payload = {
      id: teamForm?.id,
      name: form.get('name').trim(),
      email: form.get('email').trim(),
      role: form.get('role').trim(),
      status: form.get('status'),
      focus: form.get('focus').trim(),
      capacity: Number(form.get('capacity')) || 0,
    };

    if (!payload.name || !payload.role || !payload.email) return;

    if (teamForm?.mode === 'edit') {
      updateTeamMember(payload);
    } else {
      addTeamMember(payload);
    }

    setTeamForm(null);
  };

  const renderDashboard = () => (
    <section className="dashboard-view">
      <div className="stats-grid">
        <article className="report-card">
          <p className="card-label">Active projects</p>
          <h3>{summary.activeProjects}</h3>
          <p>{summary.totalProjects} total projects in progress.</p>
        </article>
        <article className="report-card">
          <p className="card-label">Open defects</p>
          <h3>{summary.openDefects}</h3>
          <p>{summary.totalDefects} defects are tracked across the workspace.</p>
        </article>
        <article className="report-card">
          <p className="card-label">Completion rate</p>
          <h3>{completedRate}%</h3>
          <p>{completedRate}% of projects are complete.</p>
        </article>
        <article className="report-card">
          <p className="card-label">Velocity</p>
          <h3>{defectVelocity} items/week</h3>
          <p>Estimated throughput based on recent activity.</p>
        </article>
      </div>

      <div className="enterprise-panel">
        <div className="panel-heading">
          <h2>Executive summary</h2>
          <span>Real-time portfolio health</span>
        </div>
        <div className="summary-grid">
          <div className="summary-card">
            <strong>{summary.criticalDefects}</strong>
            <span>Critical defects</span>
          </div>
          <div className="summary-card">
            <strong>{summary.unresolvedRatio}%</strong>
            <span>Unresolved ratio</span>
          </div>
          <div className="summary-card">
            <strong>{teamInsights.totalWorkload}</strong>
            <span>Open work items</span>
          </div>
          <div className="summary-card">
            <strong>{teamInsights.available}</strong>
            <span>Available team members</span>
          </div>
        </div>
        <div className="risk-matrix">
          {defectSeverityCounts.map((item) => (
            <div key={item.label} className="risk-row">
              <span>{item.label}</span>
              <div className="heat-bar">
                <div className="heat-fill" style={{ width: `${Math.min(100, item.count * 18)}%` }} />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="section-grid">
        <div className="panel notifications-panel">
          <div className="panel-heading">
            <h2>Notifications</h2>
            <span>{data.notifications.length} alerts</span>
          </div>
          <div className="notification-list">
            {data.notifications.map((note) => (
              <div key={note.id} className="notification-item">
                <span className="badge status-active">{note.type}</span>
                <div>
                  <p>{note.title}</p>
                  <span>{note.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-heading">
            <h2>Recent activity</h2>
            <span>{recentActivity.length} events</span>
          </div>
          <div className="activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <p>{item.message}</p>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className="project-view">
      <div className="panel project-board">
        <div className="panel-heading">
          <h2>Project backlog board</h2>
          <span>{filteredProjects.length} filtered items</span>
        </div>
        <div className="board-grid">
          {projectsByStatus.map(({ status, items }) => (
            <div key={status} className="board-column">
              <div className="board-column-header">
                <h3>{status}</h3>
                <span>{items.length}</span>
              </div>
              {items.length === 0 ? (
                <div className="empty-state">No projects in {status.toLowerCase()}.</div>
              ) : (
                items.map((project) => (
                  <article key={project.id} className="project-card project-board-card">
                    <div className="project-card-header">
                      <h3>{project.name}</h3>
                      <span className={`badge status-${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </div>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      <span>Owner: {project.owner}</span>
                      <span>Due: {project.dueDate || 'TBD'}</span>
                    </div>
                    <div className="project-meta">
                      <span>{project.type}</span>
                      <span>{project.priority} priority</span>
                    </div>
                    <div className="card-actions">
                      <select
                        value={project.status}
                        onChange={(event) => updateProject({ ...project, status: event.target.value })}
                      >
                        {statusOptions.slice(1).map((statusOption) => (
                          <option key={statusOption} value={statusOption}>{statusOption}</option>
                        ))}
                      </select>
                      <button onClick={() => setProjectForm({ mode: 'edit', ...project })}>Edit</button>
                      <button className="danger" onClick={() => removeProject(project.id)}>Delete</button>
                    </div>
                  </article>
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      <aside className="panel summary-panel">
        <h2>Project health</h2>
        <p>Track planning, active work, and upcoming due dates for the release wave.</p>
        <div className="summary-grid project-summary-grid">
          <div>
            <strong>{data.projects.filter((project) => project.status === 'Backlog').length}</strong>
            <span>Backlog</span>
          </div>
          <div>
            <strong>{data.projects.filter((project) => project.status === 'Planning').length}</strong>
            <span>Planning</span>
          </div>
          <div>
            <strong>{data.projects.filter((project) => project.status === 'Active').length}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{data.projects.filter((project) => project.status === 'Completed').length}</strong>
            <span>Completed</span>
          </div>
          <div>
            <strong>{dueThisWeek}</strong>
            <span>Due this week</span>
          </div>
        </div>
      </aside>
    </section>
  );

  const renderSprint = () => viewMode === 'board' ? (
    <section className="sprint-view">
      <div className="panel sprint-summary">
        <div className="panel-heading">
          <h2>{currentSprintName}</h2>
          <span>{sprintBacklog.length} active issues</span>
        </div>
        <div className="summary-grid report-summary-grid">
          <div>
            <strong>{sprintBacklog.length}</strong>
            <span>Active issues</span>
          </div>
          <div>
            <strong>{totalSprintEstimate}</strong>
            <span>Total estimate</span>
          </div>
          <div>
            <strong>{backlogProjects.length}</strong>
            <span>Backlog projects</span>
          </div>
          <div>
            <strong>{data.projects.filter((project) => project.status === 'Active').length}</strong>
            <span>Active projects</span>
          </div>
        </div>
      </div>

      <div className="panel sprint-board">
        <div className="panel-heading">
          <h2>Sprint backlog</h2>
          <span>Prioritized work for the current sprint</span>
        </div>
        <div className="board-grid">
          {defectStatuses.map((status) => ({
            status,
            items: sprintBacklog.filter((defect) => defect.status === status),
          })).map((column) => (
            <div key={column.status} className="board-column" onDragOver={onDragOverColumn} onDrop={(e) => onDropOnColumn(e, column.status)}>
              <div className="board-column-header">
                <h3>{column.status}</h3>
                <span>{column.items.length}</span>
              </div>
              {column.items.length === 0 ? (
                <div className="empty-state">No issues in {column.status.toLowerCase()}.</div>
              ) : (
                column.items.sort((a,b)=> (b.order||0)-(a.order||0)).map((defect) => (
                  <article key={defect.id} className="defect-card sprint-card" draggable onDragStart={(e) => onDragStart(e, defect.id)} onClick={() => setSelectedDefectId(defect.id)} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDropReorder(e, defect.id)}>
                    <div className="defect-card-header">
                      <h3>{defect.title}</h3>
                      <span className={`badge priority-${defect.priority.toLowerCase()}`}>{defect.priority}</span>
                    </div>
                    <input type="checkbox" className="card-select" checked={selectedDefectIds.includes(defect.id)} onChange={() => toggleSelectDefect(defect.id)} />
                    <div className="defect-meta">
                      <span>{defectProject(defect.projectId)}</span>
                      <span>{defect.type}</span>
                    </div>
                    <div className="defect-meta">
                      <span>{defect.assignee}</span>
                      <strong>{defect.estimate} pts</strong>
                    </div>
                  </article>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  ) : renderSprintList();

  const renderSprintList = () => (
    <section className="sprint-view sprint-list-view">
      <div className="panel sprint-summary">
        <div className="panel-heading">
          <h2>{currentSprintName}</h2>
          <span>{sprintBacklog.length} active issues</span>
        </div>
        <div className="summary-grid report-summary-grid">
          <div>
            <strong>{sprintBacklog.length}</strong>
            <span>Active issues</span>
          </div>
          <div>
            <strong>{totalSprintEstimate}</strong>
            <span>Total estimate</span>
          </div>
          <div>
            <strong>{backlogProjects.length}</strong>
            <span>Backlog projects</span>
          </div>
          <div>
            <strong>{data.projects.filter((project) => project.status === 'Active').length}</strong>
            <span>Active projects</span>
          </div>
        </div>
      </div>

      <div className="panel sprint-list-panel">
        <div className="panel-heading">
          <h2>Sprint backlog list</h2>
          <span>Flat view of sprint work items</span>
        </div>
        <div className="sprint-list">
          {sprintBacklog.length === 0 ? (
            <div className="empty-state">No sprint work items available yet.</div>
          ) : (
            sprintBacklog.map((defect) => (
              <article key={defect.id} className="defect-row sprint-list-card" onClick={() => setSelectedDefectId(defect.id)}>
                <div className="defect-row-main">
                  <h3>{defect.title}</h3>
                  <span>{defectProject(defect.projectId)}</span>
                </div>
                <div className="defect-row-meta">
                  <span>{defect.status}</span>
                  <span>{defect.priority}</span>
                  <span>{defect.assignee}</span>
                  <span>{defect.estimate} pts</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );

  const renderDefects = () => viewMode === 'board' ? (
    <section className="defect-view">
            {defectsByStatus.map(({ status, items }) => (
        <div key={status} className="status-column" onDragOver={onDragOverColumn} onDrop={(e) => onDropOnColumn(e, status)}>
          <div className="panel-heading">
            <h2>{status}</h2>
            <span>{items.length}</span>
          </div>
          {items.length === 0 ? (
            <div className="empty-state">No defects in this status.</div>
          ) : (
                items.sort((a,b)=> (b.order||0)-(a.order||0)).map((defect) => (
              <article key={defect.id} className="defect-card" draggable onDragStart={(e) => onDragStart(e, defect.id)} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDropReorder(e, defect.id)}>
                <input type="checkbox" className="card-select" checked={selectedDefectIds.includes(defect.id)} onChange={() => toggleSelectDefect(defect.id)} />
                <div className="defect-card-header">
                  <h3>{defect.title}</h3>
                  <span className={`badge priority-${defect.priority.toLowerCase()}`}>{defect.priority}</span>
                </div>
                <p>{defect.description}</p>
                <div className="defect-meta">
                  <span>{defectProject(defect.projectId)}</span>
                  <span>{defect.type}</span>
                </div>
                <div className="defect-meta">
                  <span>{defect.assignee}</span>
                  <span>{defect.createdAt}</span>
                </div>
                <div className="label-list">
                  {defect.labels?.map((label) => (
                    <span key={label} className="issue-label">{label}</span>
                  ))}
                </div>
                <div className="defect-footer">
                  <select
                    value={defect.status}
                    onChange={(event) => updateDefect({ ...defect, status: event.target.value })}
                  >
                    {defectStatuses.map((nextStatus) => (
                      <option key={nextStatus} value={nextStatus}>{nextStatus}</option>
                    ))}
                  </select>
                  <button className="ghost-button compact" type="button" onClick={() => setSelectedDefectId(defect.id)}>
                    Details
                  </button>
                  <button onClick={() => setDefectForm({ mode: 'edit', ...defect })}>Edit</button>
                </div>
                <div className="card-actions">
                  <button className="danger" onClick={() => removeDefect(defect.id)}>Delete</button>
                </div>
              </article>
            ))
          )}
        </div>
      ))}
    </section>
  ) : (
    <section className="defect-view defect-list-view">
      <div className="panel-heading">
        <h2>Defect list</h2>
        <span>{filteredDefects.length} results</span>
      </div>
      <div className="defect-list">
        {filteredDefects.length === 0 ? (
          <div className="empty-state">No defects match the current filters.</div>
        ) : (
          filteredDefects.map((defect) => (
            <article key={defect.id} className="defect-row" onClick={() => setSelectedDefectId(defect.id)}>
              <div className="defect-row-main">
                <div>
                  <strong>{defect.title}</strong>
                  <p>{defect.description}</p>
                </div>
                <span className={`badge priority-${defect.priority.toLowerCase()}`}>{defect.priority}</span>
              </div>
              <div className="defect-row-meta">
                <span>{defectProject(defect.projectId)}</span>
                <span>{defect.type}</span>
                <span>{defect.assignee}</span>
                <span>{defect.status}</span>
                <span>{defect.estimate} pts</span>
              </div>
              <div className="card-actions">
                <button className="ghost-button compact" type="button" onClick={() => setSelectedDefectId(defect.id)}>
                  Details
                </button>
                <button onClick={(event) => { event.stopPropagation(); setDefectForm({ mode: 'edit', ...defect }); }}>Edit</button>
                <button className="danger" onClick={(event) => { event.stopPropagation(); removeDefect(defect.id); }}>Delete</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );

  const renderReports = () => (
    <section className="reports-view">
      <div className="stats-grid">
        <article className="report-card">
          <p className="card-label">Unresolved defects</p>
          <h3>{summary.openDefects}</h3>
          <p>Issues still active across the current release.</p>
        </article>
        <article className="report-card">
          <p className="card-label">Sprint velocity</p>
          <h3>{defectVelocity} items/week</h3>
          <p>Expected delivery pace based on current flow.</p>
        </article>
        <article className="report-card">
          <p className="card-label">Backlog size</p>
          <h3>{data.projects.filter((project) => project.status === 'Backlog').length}</h3>
          <p>Planned work waiting for sprint planning.</p>
        </article>
        <article className="report-card">
          <p className="card-label">Team capacity</p>
          <h3>{teamInsights.available} available</h3>
          <p>Team members ready to take on new issues.</p>
        </article>
      </div>

      <div className="report-panel">
        <div className="panel-heading">
          <h2>Priority distribution</h2>
          <span>Defects across the workspace</span>
        </div>
        <div className="report-bars">
          {defectsByPriority.map((item) => (
            <div key={item.label} className="report-bar">
              <div className="report-bar-label">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.min(100, item.count * 18)}%` }} />
              </div>
              <div className="report-bar-meta">
                <small>{Math.round((item.count / Math.max(1, data.defects.length)) * 100)}% of defects</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel insights-panel">
        <div className="panel-heading">
          <h2>Sprint health</h2>
          <span>Quality and delivery readiness</span>
        </div>
        <div className="summary-grid report-summary-grid">
          <div>
            <strong>{summary.criticalDefects}</strong>
            <span>Critical issues</span>
          </div>
          <div>
            <strong>{summary.unresolvedRatio}%</strong>
            <span>Unresolved rate</span>
          </div>
          <div>
            <strong>{dueThisWeek}</strong>
            <span>Due this week</span>
          </div>
          <div>
            <strong>{teamAssignments.reduce((sum, member) => sum + member.workload, 0)}</strong>
            <span>Total assigned</span>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTeam = () => (
    <section className="team-view">
      <div className="panel team-panel">
        <div className="panel-heading">
          <h2>Team capacity</h2>
          <span>{teamAssignments.length} members</span>
        </div>
        <div className="team-list">
          {teamAssignments.map((member) => (
            <article key={member.id} className="team-card">
              <div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
              <div className="team-meta">
                <span>{member.status}</span>
                <strong>{member.workload} tasks</strong>
              </div>
              <div className="team-meta">
                <span>{member.email}</span>
                <strong>{member.capacity} cap</strong>
              </div>
              <p className="member-focus">{member.focus}</p>
              <div className="card-actions">
                <button onClick={() => setTeamForm({ mode: 'edit', ...member })}>Edit</button>
                <button className="danger" onClick={() => removeTeamMember(member.id)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="panel insights-panel">
        <h2>Team insights</h2>
        <p>Track how work is distributed across the team and where capacity exists for new initiatives.</p>
        <div className="summary-grid">
          <div>
            <strong>{teamAssignments.filter((member) => member.status === 'Available').length}</strong>
            <span>Available</span>
          </div>
          <div>
            <strong>{teamAssignments.filter((member) => member.status === 'Busy').length}</strong>
            <span>Busy</span>
          </div>
          <div>
            <strong>{Math.max(0, teamAssignments.reduce((sum, member) => sum + member.workload, 0))}</strong>
            <span>Total assignments</span>
          </div>
        </div>
      </div>
    </section>
  );

  if (!currentUser) {
    return (
      <AuthPanel
        mode={authMode}
        onSubmit={authMode === 'login' ? handleLogin : handleSignup}
        onToggleMode={() => {
          setAuthMode((current) => (current === 'login' ? 'signup' : 'login'));
          setAuthError('');
        }}
        error={authError}
      />
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        navItems={navItems}
        currentView={view}
        onSelect={setView}
        onToggleDark={() => setDarkMode((value) => !value)}
        darkMode={darkMode}
        onExport={exportCsv}
        onReset={resetWorkspace}
        notifications={data.notifications.length}
      />

      <div className="page-grid">
        <SideNavigation
          navItems={navItems}
          currentView={view}
          onSelect={setView}
          currentUser={currentUser}
          onLogout={handleLogout}
          summary={summary}
        />

        <div className="page-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">GAIZCON Technologies Enterprise Hub</p>
              <h1>GAIZCON {view}</h1>
                <p className="subtitle">A single place to manage work, quality, reports, and delivery operations.</p>
                <div className="user-badge">
                  <strong>{currentUser.name}</strong>
                  <span className="role-pill">{currentUser.role}</span>
                </div>
            </div>
            <div className="topbar-actions">
              <button className="ghost-button" onClick={() => setDarkMode((value) => !value)}>
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
              <button className="ghost-button" onClick={exportCsv}>
                Export CSV
              </button>
              {view === 'Defects' && (
                <button className="ghost-button" onClick={exportFilteredCsv}>
                  Export filtered CSV
                </button>
              )}
              {(view === 'Defects' || view === 'Sprint') && (
                <button className="ghost-button" onClick={() => setViewMode((mode) => (mode === 'board' ? 'list' : 'board'))}>
                  {viewMode === 'board' ? 'List view' : 'Kanban view'}
                </button>
              )}
              {view === 'Defects' && selectedDefectIds.length > 0 && (
                <div className="bulk-actions">
                  <button className="ghost-button" onClick={bulkAssign}>Bulk assign</button>
                  <button className="ghost-button" onClick={bulkChangeStatus}>Bulk status</button>
                  <button className="ghost-button" onClick={bulkAddLabel}>Add label</button>
                  <button className="ghost-button" onClick={clearSelection}>Clear selection</button>
                </div>
              )}
              {view === 'Defects' && (
                <button className="ghost-button" onClick={bulkResolveOpenDefects}>
                  Resolve all open
                </button>
              )}
              {view === 'Team' && (
                <button className="ghost-button" onClick={() => setTeamForm({ mode: 'create', name: '', email: '', role: '', status: 'Available', focus: '', capacity: 8 })}>
                  Add member
                </button>
              )}
              <button className="ghost-button" onClick={resetWorkspace}>
                Reset workspace
              </button>
              {(view === 'Projects' || view === 'Defects' || view === 'Team') && (
                <button className="primary-button" onClick={() => projectActions(view)}>
                  New {view === 'Projects' ? 'Project' : view === 'Defects' ? 'Defect' : 'Member'}
                </button>
              )}
            </div>
          </header>

          <section className="action-bar">
            <div className="search-field">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by project, defect, or owner"
                aria-label="Search"
              />
            </div>
            <div className="filters">
              {view === 'Projects' ? (
                <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : view === 'Defects' ? (
                <>
                  <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <select value={defectTypeFilter} onChange={(event) => setDefectTypeFilter(event.target.value)}>
                    {issueTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </>
              ) : null}
            </div>
          </section>

          <main className="page-main">
            {view === 'Dashboard' && renderDashboard()}
            {view === 'Projects' && renderProjects()}
            {view === 'Sprint' && renderSprint()}
            {view === 'Defects' && renderDefects()}
            {view === 'Reports' && renderReports()}
            {view === 'Team' && renderTeam()}
          </main>
        </div>
      </div>

      {(projectForm || defectForm || teamForm) && (
        <div className="modal-backdrop" onClick={() => { setProjectForm(null); setDefectForm(null); setTeamForm(null); }}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            {projectForm && (
              <form className="form-panel" onSubmit={handleProjectSubmit}>
                <div className="form-header">
                  <h2>{projectForm.mode === 'edit' ? 'Edit Project' : 'New Project'}</h2>
                  <button type="button" className="ghost-button" onClick={() => setProjectForm(null)}>Close</button>
                </div>
                <label>
                  Name
                  <input name="name" defaultValue={projectForm.name} required />
                </label>
                <label>
                  Description
                  <textarea name="description" defaultValue={projectForm.description} rows="3" />
                </label>
                <label>
                  Owner
                  <input name="owner" defaultValue={projectForm.owner} required />
                </label>
                <div className="form-grid">
                  <label>
                    Type
                    <select name="type" defaultValue={projectForm.type || 'Development'}>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Research">Research</option>
                      <option value="Release">Release</option>
                    </select>
                  </label>
                  <label>
                    Priority
                    <select name="priority" defaultValue={projectForm.priority || 'Medium'}>
                      {priorityOptions.slice(1).map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-grid">
                  <label>
                    Status
                    <select name="status" defaultValue={projectForm.status}>
                      {statusOptions.slice(1).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Due date
                    <input type="date" name="dueDate" defaultValue={projectForm.dueDate} />
                  </label>
                </div>
                <button className="primary-button" type="submit">Save project</button>
              </form>
            )}

        {bulkModalOpen && (
          <div className="modal-backdrop" onClick={() => setBulkModalOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>Bulk action: {bulkModalAction}</h2>
                <button type="button" className="ghost-button" onClick={() => setBulkModalOpen(false)}>Close</button>
              </div>
              {bulkModalAction === 'assign' && (
                <form onSubmit={(e) => { e.preventDefault(); const assignee = e.target.assigneeValue.value.trim(); if (!assignee) return; bulkUpdate({ assignee }); setBulkModalOpen(false); }}>
                  <label>Assign to
                    <UserPicker users={data.users} team={data.team} value={''} onChange={(val)=>{document.getElementById('assigneeValue').value = val}} />
                    <input id="assigneeValue" name="assigneeValue" type="hidden" />
                  </label>
                  <div className="form-actions">
                    <button className="primary-button" type="submit">Assign</button>
                  </div>
                </form>
              )}
              {bulkModalAction === 'status' && (
                <form onSubmit={(e) => { e.preventDefault(); const status = e.target.status.value; if (!status) return; bulkUpdate({ status }); setBulkModalOpen(false); }}>
                  <label>Status
                    <select name="status">
                      {defectStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <div className="form-actions">
                    <button className="primary-button" type="submit">Apply</button>
                  </div>
                </form>
              )}
              {bulkModalAction === 'label' && (
                <form onSubmit={(e) => { e.preventDefault(); const label = e.target.label.value.trim(); if (!label) return; setData((prev) => ({ ...prev, defects: prev.defects.map((defect) => selectedDefectIds.includes(defect.id) ? { ...defect, labels: Array.from(new Set([...(defect.labels || []), label])) } : defect) })); logActivity(`Added label “${label}” to ${selectedDefectIds.length} items.`); setBulkModalOpen(false); clearSelection(); }}>
                  <label>Label
                    <input name="label" placeholder="Label text" />
                  </label>
                  <div className="form-actions">
                    <button className="primary-button" type="submit">Add label</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
            {defectForm && (
              <form className="form-panel" onSubmit={handleDefectSubmit}>
                <div className="form-header">
                  <h2>{defectForm.mode === 'edit' ? 'Edit Defect' : 'New Defect'}</h2>
                  <button type="button" className="ghost-button" onClick={() => setDefectForm(null)}>Close</button>
                </div>
                <label>
                  Title
                  <input name="title" defaultValue={defectForm.title} required />
                </label>
                <label>
                  Project
                  <select name="projectId" defaultValue={defectForm.projectId} required>
                    {data.projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Description
                  <textarea name="description" defaultValue={defectForm.description} rows="3" />
                </label>
                <div className="form-grid">
                  <label>
                    Severity
                    <select name="priority" defaultValue={defectForm.priority}>
                      {priorityOptions.slice(1).map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Status
                    <select name="status" defaultValue={defectForm.status}>
                      {defectStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Assignee
                  <input name="assignee" defaultValue={defectForm.assignee} required />
                </label>
                <label>
                  Labels
                  <input name="labels" defaultValue={defectForm.labels?.join(', ')} placeholder="UI, Backend, QA" />
                </label>
                <label>
                  Estimate
                  <input name="estimate" type="number" min="1" defaultValue={defectForm.estimate || 1} />
                </label>
                <label>
                  Type
                  <select name="type" defaultValue={defectForm.type || 'Bug'}>
                    {issueTypeOptions.slice(1).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <button className="primary-button" type="submit">Save defect</button>
              </form>
            )}
            {teamForm && (
              <form className="form-panel" onSubmit={handleTeamSubmit}>
                <div className="form-header">
                  <h2>{teamForm.mode === 'edit' ? 'Edit Team Member' : 'New Team Member'}</h2>
                  <button type="button" className="ghost-button" onClick={() => setTeamForm(null)}>Close</button>
                </div>
                <label>
                  Name
                  <input name="name" defaultValue={teamForm.name} required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" defaultValue={teamForm.email} required />
                </label>
                <label>
                  Role
                  <input name="role" defaultValue={teamForm.role} required />
                </label>
                <div className="form-grid">
                  <label>
                    Status
                    <select name="status" defaultValue={teamForm.status}>
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </label>
                  <label>
                    Capacity
                    <input name="capacity" type="number" min="0" defaultValue={teamForm.capacity} />
                  </label>
                </div>
                <label>
                  Focus
                  <input name="focus" defaultValue={teamForm.focus} />
                </label>
                <button className="primary-button" type="submit">Save member</button>
              </form>
            )}
          </div>
        </div>
      )}

      {selectedDefect && (
        <div className="drawer-backdrop" onClick={() => setSelectedDefectId(null)}>
          <aside className="issue-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Issue details</p>
                <h2>{selectedDefect.title}</h2>
                <span className="drawer-subtitle">{defectProject(selectedDefect.projectId)}</span>
              </div>
              <button className="ghost-button" type="button" onClick={() => setSelectedDefectId(null)}>Close</button>
            </div>
            <div className="drawer-grid">
                <div className="drawer-card">
                  <label>
                    Title
                    <input
                      value={selectedDefect.title}
                      onChange={(e) => updateDefect({ ...selectedDefect, title: e.target.value })}
                      readOnly={!canEditField('title')}
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      rows="4"
                      value={selectedDefect.description}
                      onChange={(e) => updateDefect({ ...selectedDefect, description: e.target.value })}
                      readOnly={!canEditField('description')}
                    />
                  </label>

                  <div className="drawer-meta">
                    <label>
                      Type
                      <select value={selectedDefect.type} onChange={(e) => updateDefect({ ...selectedDefect, type: e.target.value })} disabled={!canEditField('type')}>
                        {issueTypeOptions.slice(1).map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Priority
                      <select value={selectedDefect.priority} onChange={(e) => updateDefect({ ...selectedDefect, priority: e.target.value })} disabled={!canEditField('priority')}>
                        {priorityOptions.slice(1).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Estimate
                      <input type="number" min="0" value={selectedDefect.estimate || 0} onChange={(e) => updateDefect({ ...selectedDefect, estimate: Number(e.target.value) || 0 })} readOnly={!canEditField('estimate')} />
                    </label>
                  </div>

                  <div className="drawer-meta">
                    <label>
                      Assignee
                      <select value={selectedDefect.assignee} onChange={(e) => updateDefect({ ...selectedDefect, assignee: e.target.value })} disabled={!canEditField('assignee')}>
                        <option value="">Unassigned</option>
                        {Array.from(new Set([...data.users.map(u => u.name), ...data.team.map(m => m.name)])).map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </label>
                    <div>
                      <small>Created: {selectedDefect.createdAt}</small>
                    </div>
                  </div>

                  <label>
                    Labels (comma separated)
                    <input
                      value={(selectedDefect.labels || []).join(', ')}
                      onChange={(e) => updateDefect({ ...selectedDefect, labels: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </label>

                  <div className="card-actions">
                    <button className="ghost-button" type="button" onClick={() => updateDefect({ ...selectedDefect, status: 'In Progress' })}>
                      Move to In Progress
                    </button>
                    <button className="ghost-button" type="button" onClick={() => updateDefect({ ...selectedDefect, status: 'Resolved' })}>
                      Mark resolved
                    </button>
                    <button className="primary-button" type="button" onClick={() => { setDefectForm({ mode: 'edit', ...selectedDefect }); setSelectedDefectId(null); }}>
                      Open full editor
                    </button>
                  </div>
                </div>
                <div className="drawer-actions">
                  <div className="comments-panel">
                    <h3>Comments</h3>
                    <div className="comments-list">
                      {(selectedDefect.comments || []).map((c) => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-meta">
                            <strong>{c.author}</strong>
                            <span className="muted">{c.time}</span>
                          </div>
                          <p>{c.message}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddComment} className="comment-form">
                      <textarea placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} rows="3" />
                      <div className="comment-actions">
                        <button type="submit" className="primary-button">Add comment</button>
                        <button type="button" className="ghost-button" onClick={() => setCommentText('')}>Clear</button>
                      </div>
                    </form>
                  </div>
                </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
