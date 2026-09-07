import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBookOpen,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';

export const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Member'
    }
  });

  const onSubmit = async (data) => {
    try {
      const user = await registerUser(data);
      if (user.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/books');
      }
    } catch (error) {
      // Toast notification automatically handles errors
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#faf7f2] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-stone-300/50 border border-stone-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* LEFT COLUMN: Warm Editorial Brand Story */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#1c1917] text-white p-10 flex-col justify-between relative overflow-hidden border-r border-stone-800">
          <div
            className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507842229451-79b1be8d62ee?auto=format&fit=crop&q=80&w=1200')`
            }}
          />

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

          <div className="relative z-10 my-auto py-8 space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-md border border-white/10">
                📚 Warm Editorial Library
              </span>
              <h2 className="text-3xl font-black leading-tight text-white m-0">
                Start your journey with City Central Library.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                Register in less than a minute to borrow books, check active borrows, and reserve your favorites.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-200">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                <span>Instant access to digital library catalog</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                <span>Search millions of titles via Google Books</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-amber-400 text-base shrink-0" />
                <span>Track return dates and personal reading lists</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-stone-800 text-xs text-stone-400">
            <p className="italic">“Today a reader, tomorrow a leader.” — Margaret Fuller</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full space-y-5">
            
            {/* Header */}
            <div>
              <div className="lg:hidden flex items-center gap-2.5 mb-3 text-amber-700">
                <FiBookOpen className="text-2xl" />
                <span className="text-xl font-black text-stone-900">City Central Library</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight m-0">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Fill in your details below to register your library profile.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
              <div>
                <Input
                  label="Full Name"
                  placeholder="e.g. Eleanor Vance"
                  icon={FiUser}
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />
              </div>

              <div>
                <Input
                  label="Email Address"
                  placeholder="e.g. eleanor@example.com"
                  icon={FiMail}
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Create password"
                    icon={FiLock}
                    {...register('password')}
                    error={errors.password?.message}
                    required
                  />
                </div>

                <div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    placeholder="Repeat password"
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
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    required
                  />
                </div>
              </div>

              <div>
                <Select
                  label="Account Type / Role"
                  options={[
                    { value: 'Member', label: 'Library Member (Reader)' },
                    { value: 'Admin', label: 'Library Staff (Administrator)' }
                  ]}
                  {...register('role')}
                  error={errors.role?.message}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2"
              >
                <span>Complete Registration</span>
                <FiArrowRight className="text-base" />
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-amber-700 hover:text-amber-800 underline underline-offset-4"
                >
                  Sign In here
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
