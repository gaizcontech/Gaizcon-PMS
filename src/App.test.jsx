import { beforeEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders sign in screen when not authenticated', () => {
  render(<App />);
  expect(screen.getByText(/sign in to access your dashboard/i)).toBeDefined();
});
