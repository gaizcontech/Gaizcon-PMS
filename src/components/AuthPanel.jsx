import { useState } from 'react';

export default function AuthPanel({ mode, onSubmit, onToggleMode, error }) {
  const [values, setValues] = useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo-mark">PH</span>
          <div>
            <p className="brand-label">Project Hub</p>
            <p className="brand-copy">Fast delivery planning, defect tracking, and team reporting.</p>
          </div>
        </div>

        <div className="auth-copy">
          <h2>{mode === 'login' ? 'Sign in to access your dashboard' : 'Create your team workspace'}</h2>
          <p>Use your email to keep your workspace state in local browser storage.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Name
              <input
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="primary-button" type="submit">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>
              <span>Don’t have an account?</span>
              <button className="ghost-button" onClick={onToggleMode} type="button">
                Create account
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button className="ghost-button" onClick={onToggleMode} type="button">
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
