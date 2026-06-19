'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, KeyRound, Mail, Radio, AlertCircle, ArrowRight, Activity } from 'lucide-react';

export default function AuthPage() {
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
      router.replace('/primary');
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

  return (
    <div className="relative min-h-screen bg-[#070A0F] text-[#F0F2F8] flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Terminal Header Info */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            Malaysia 999 Op-Center
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-lg shadow-emerald-500/5">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight text-[#F0F2F8] font-sans">
                MERS-AI
              </h1>
              <p className="text-[11px] font-mono text-slate-400 tracking-wider">
                TACTICAL DISPATCH TERMINAL
              </p>
            </div>
          </div>
        </div>

        {/* Auth Main Card */}
        <Card className="border-[#1E293B] bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
          {/* Card Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-500 to-blue-500"></div>

          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className="text-lg font-semibold tracking-wide text-slate-100 uppercase">
              {isSignUp ? 'Create Operator Profile' : 'Operator Authentication'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-mono">
              {isSignUp ? 'Sign up to register a new dispatcher console' : 'Enter your credential codes to decrypt system access'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                <Activity className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
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
                  className="w-full bg-slate-950/60 border border-[#1E293B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-lg py-2 px-3 transition-all text-slate-100 placeholder-slate-600 font-mono text-sm outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-slate-400" />
                  Terminal Key (Password)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-[#1E293B] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 rounded-lg py-2 px-3 transition-all text-slate-100 placeholder-slate-600 font-mono text-sm outline-none"
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none h-10 shadow-lg shadow-emerald-500/20 gap-1.5 transition-all text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isSignUp ? 'Decrypt & Initialize Account' : 'Decrypt Console Access'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-slate-800/40 bg-slate-950/20 py-4 gap-2 text-center">
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
                : 'New Dispatcher? Request console creation credentials'}
            </button>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              AUTHORIZED PERSONNEL ONLY // UNLAWFUL ACCESS PROHIBITED
            </div>
          </CardFooter>
        </Card>
        
        {/* Footer info stats */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 px-1">
          <div>SSL: AES_256_GCM</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SYS-STATUS: NOMINAL
          </div>
        </div>
      </div>
    </div>
  );
}
