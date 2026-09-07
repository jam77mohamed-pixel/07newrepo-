import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBookOpen,
  FiCheck,
  FiArrowRight,
  FiBookmark,
  FiClock,
  FiSearch,
  FiShield,
  FiUser
} from 'react-icons/fi';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' or 'member'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'admin@library.com',
      password: 'password123'
    }
  });

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/books');
      }
    } catch (error) {
      // Toast notification automatically handles errors
    }
  };

  const handlePickRole = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setValue('email', 'admin@library.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
    } else {
      setValue('email', 'member@library.com', { shouldValidate: true });
      setValue('password', 'password123', { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#faf7f2] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-stone-300/50 border border-stone-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* LEFT COLUMN: Brand Story & Features */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#1c1917] text-white p-10 flex-col justify-between relative overflow-hidden border-r border-stone-800">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200')`
            }}
          />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-600/30">
              <FiBookOpen className="text-2xl" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">City Central</span>
              <span className="block text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                Public Library System
              </span>
            </div>
          </div>

          {/* Middle Story */}
          <div className="relative z-10 my-auto py-8 space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-md border border-white/10">
                📚 Warm Editorial Library Portal
              </span>
              <h2 className="text-3xl font-black leading-tight text-white m-0">
                Discover, borrow, and explore the library collection.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                Access catalog holdings, search titles via Google Books API, and manage your reading history.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <FiSearch className="text-base" />
                </div>
                <span>Google Books discovery & auto-fill cataloging</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <FiClock className="text-base" />
                </div>
                <span>Automated due-date tracking & overdue fines</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-200">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <FiShield className="text-base" />
                </div>
                <span>Staff and reader role-based access</span>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="relative z-10 pt-4 border-t border-stone-800 text-xs text-stone-400">
            <p className="italic">“A library is not a luxury but one of the necessities of life.” — Henry Ward Beecher</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Login Form with 1-Click Role Switcher */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-6">
            
            {/* Form Header */}
            <div>
              <div className="lg:hidden flex items-center gap-2.5 mb-3 text-amber-700">
                <FiBookOpen className="text-2xl" />
                <span className="text-xl font-black text-stone-900">City Central Library</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight m-0">
                Account Sign In
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Choose a demo role below or enter your credentials to continue.
              </p>
            </div>

            {/* 1-Click Role Selector */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Quick Demo Role Selector
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handlePickRole('admin')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedRole === 'admin'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-amber-600 text-white flex items-center justify-center text-sm shadow-xs">
                      <FiShield />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">👨‍💼 Librarian</p>
                      <p className="text-[10px] text-stone-400">Admin Account</p>
                    </div>
                  </div>
                  {selectedRole === 'admin' && <FiCheck className="text-amber-600 text-sm font-bold" />}
                </button>

                <button
                  type="button"
                  onClick={() => handlePickRole('member')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedRole === 'member'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-xs">
                      <FiUser />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">📖 Reader</p>
                      <p className="text-[10px] text-stone-400">Member Account</p>
                    </div>
                  </div>
                  {selectedRole === 'member' && <FiCheck className="text-amber-600 text-sm font-bold" />}
                </button>
              </div>
            </div>

            {/* Login Inputs */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              <div>
                <Input
                  label="Email Address"
                  placeholder="admin@library.com or member@library.com"
                  icon={FiMail}
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>

              <div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter password"
                  icon={FiLock}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                    </button>
                  }
                  {...register('password')}
                  error={errors.password?.message}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5 text-stone-600">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <span className="text-stone-400 text-xs">
                  Protected System
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2"
              >
                <span>Sign In to Library Portal</span>
                <FiArrowRight className="text-base" />
              </Button>
            </form>

            {/* Register Footer */}
            <div className="pt-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-500">
                New to the library?{' '}
                <Link
                  to="/register"
                  className="font-bold text-amber-700 hover:text-amber-800 underline underline-offset-4"
                >
                  Create Member Account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
