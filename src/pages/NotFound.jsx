import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FiHome, FiBookOpen, FiArrowLeft } from 'react-icons/fi';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-xs">
        <FiBookOpen className="text-4xl" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        The catalog page or resource you are looking for does not exist or has been moved.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" icon={FiArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Link to="/">
          <Button variant="primary" icon={FiHome}>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
