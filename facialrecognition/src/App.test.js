import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the sign-in screen on first load', () => {
  render(<App />);
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
