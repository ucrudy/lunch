import { render, screen } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';
import AppContext from '../components/AppContext';
import { providerValues } from './providerValues';

test('shows app', () => {
  render(
    <AppContext.Provider value={providerValues}>
      <App />
    </AppContext.Provider>
  );
  expect(screen.getByText(/info/i)).toBeInTheDocument();
  expect(screen.getByText(/demo location/i)).toBeInTheDocument();
});
