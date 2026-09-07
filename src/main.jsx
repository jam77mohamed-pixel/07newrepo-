import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { BookProvider } from './context/BookContext';
import { MemberProvider } from './context/MemberContext';
import { BorrowProvider } from './context/BorrowContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <BookProvider>
              <MemberProvider>
                <BorrowProvider>
                  <App />
                </BorrowProvider>
              </MemberProvider>
            </BookProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
