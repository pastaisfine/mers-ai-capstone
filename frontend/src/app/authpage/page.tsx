'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Sun, Moon, KeyRound, Mail, Radio, AlertCircle, ArrowRight, Activity } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all security fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user && data.session === null) {
          setSuccess('Operator profile registered! Please check your email inbox to verify your account.');
        } else {
          setSuccess('Operator profile registered successfully!');
          router.push('/primary');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        router.push('/primary');
      }
    } catch (err: any) {
      setError(err.message || 'Access Denied. Internal security verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })

  if (error) {
    console.error(error)
  }
}

  return (
    <div className={`relative min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#070A0F] text-[#F0F2F8]' : 'bg-slate-100 text-slate-900'
      }`}>
        <button
        onClick={() => setIsDark(!isDark)}
        className={`absolute top-6 right-6 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700 text-amber-400 hover:bg-slate-700' 
            : 'bg-white/80 border-slate-300 text-indigo-600 hover:bg-slate-100 shadow-sm'
        }`}
        aria-label="Toggle Theme"
      >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Terminal Header Info */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-[10px] tracking-widest uppercase transition-colors ${
            isDark 
              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' 
              : 'border-emerald-500/40 bg-emerald-100/50 text-emerald-700'
          }`}>
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Malaysia 999 Op-Center
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className={`p-2.5 border rounded-xl shadow-lg transition-colors ${
              isDark 
                ? 'bg-slate-900 border-slate-800 shadow-emerald-500/5' 
                : 'bg-white border-slate-200 shadow-emerald-500/10'
            }`}>
              <Shield className={`w-8 h-8 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
            </div>
            <div className="text-left">
              <h1 className={`text-xl font-bold tracking-tight font-sans transition-colors ${
                isDark ? 'text-[#F0F2F8]' : 'text-slate-900'
              }`}>
                MERS-AI
              </h1>
              <p className={`text-[11px] font-mono transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                TACTICAL DISPATCH TERMINAL
              </p>
            </div>
          </div>
        </div>

        {/* Auth Main Card */}
        <Card className={`backdrop-blur-xl shadow-2xl relative overflow-hidden ring-1 transition-colors duration-300 ${
          isDark 
            ? 'border-[#1E293B] bg-slate-900/60 ring-white/5' 
            : 'border-slate-200 bg-white/80 ring-black/5'
        }`}>
          {/* Card Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className={`text-lg font-semibold tracking-wide transition-colors ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {isSignUp ? 'Create Dispatcher Profile' : 'Dispatcher LOG IN'}
            </CardTitle>
            <CardDescription className={`text-xs transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {isSignUp ? 'Sign up to register a new dispatcher console' : 'Enter your email and password to login'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className={`flex items-start gap-2.5 p-3 rounded-lg border font-mono text-xs ${
                isDark 
                  ? 'bg-destructive/10 border-destructive/30 text-destructive' 
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className={`flex items-start gap-2.5 p-3 rounded-lg border font-mono text-xs ${
                isDark 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <Activity className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Credential Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Operator Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. khalid@999.gov.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-lg py-2 px-3 transition-all font-mono text-sm outline-none ${
                    isDark 
                      ? 'bg-slate-950/60 border-[#1E293B] text-slate-100 placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <KeyRound className="w-3 h-3 text-slate-400" />
                  Terminal Key (Password)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-lg py-2 px-3 transition-all font-mono text-sm outline-none ${
                    isDark 
                      ? 'bg-slate-950/60 border-[#1E293B] text-slate-100 placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none h-10 shadow-lg shadow-emerald-500/20 gap-1.5 transition-all text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? "Create Profile" : "Log in"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <Button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold border-none h-10 shadow-lg shadow-emerald-500/20 transition-all text-sm"
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign in with Google
                </Button>
              </div>

            </form>
          </CardContent>

          <CardFooter className={`flex flex-col border-t py-4 gap-2 text-center transition-colors ${
            isDark 
              ? 'border-slate-800/40 bg-slate-950/20' 
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4"
            >
              {isSignUp 
                ? 'Already registered? Return to Authentication Screen' 
                : 'New Dispatcher? Request New Profile'}
            </button>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              AUTHORIZED PERSONNEL ONLY // UNLAWFUL ACCESS PROHIBITED
            </div>
           <Button asChild>
            <a href="/landing" className='underline'>
              Back to Home
              <ArrowRight size={16} />
            </a>
          </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
