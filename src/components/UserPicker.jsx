import React from 'react';

export default function UserPicker({ users = [], team = [], value = '', onChange }) {
  const names = Array.from(new Set([...users.map(u => u.name), ...team.map(m => m.name)]));
  return (
    <select value={value} onChange={(e) => onChange && onChange(e.target.value)}>
      <option value="">Unassigned</option>
      {names.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  );
}
