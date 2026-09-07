import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ErrorBoundary>
  );
}

export default App;
