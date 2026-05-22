export default function Navbar({ navItems, currentView, onSelect, onToggleDark, darkMode, onExport, onReset, notifications }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <span className="navbar-mark">GZ</span>
          <div>
            <p className="navbar-title">GAIZCON Portal</p>
            <p className="navbar-copy">Enterprise work management with rich dashboards and reports.</p>
          </div>
        </div>
      </div>

      <div className="navbar-links">
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className={currentView === item ? 'navbar-link active' : 'navbar-link'}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <div className="navbar-badge">{notifications} alerts</div>
        <button className="ghost-button" type="button" onClick={onToggleDark}>
          {darkMode ? 'Light' : 'Dark'} mode
        </button>
        <button className="ghost-button" type="button" onClick={onExport}>
          Export CSV
        </button>
        <button className="ghost-button" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </nav>
  );
}
