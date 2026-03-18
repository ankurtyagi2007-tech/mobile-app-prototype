import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter initialEntries={['/login']}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>
  </StrictMode>
);
