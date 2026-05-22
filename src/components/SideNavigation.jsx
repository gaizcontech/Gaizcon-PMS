export default function SideNavigation({ navItems, currentView, onSelect, currentUser, onLogout, summary }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">GZ</div>
        <div>
          <p className="brand-title">GAIZCON Technologies</p>
          <p className="brand-subtitle">Enterprise portfolio management</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item}
            className={currentView === item ? 'nav-item active' : 'nav-item'}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-panel">
        <p className="section-label">Quick overview</p>
        <div className="sidebar-metrics">
          <div>
            <span>{summary.activeProjects}</span>
            <p>Active projects</p>
          </div>
          <div>
            <span>{summary.openDefects}</span>
            <p>Open defects</p>
          </div>
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="profile-card">
          <span className="profile-avatar">{currentUser?.name?.slice(0, 2).toUpperCase()}</span>
          <div>
            <p>{currentUser?.name}</p>
            <span>{currentUser?.role}</span>
          </div>
        </div>
        <button className="ghost-button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
