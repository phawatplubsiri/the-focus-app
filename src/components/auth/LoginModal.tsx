'use client'

import Link from 'next/link'
import { login, signInWithGoogle, forgotPassword } from '@/actions/auth.actions'
import { useActionState, useState } from 'react'
import { AuthActionResponse } from '@/types/auth'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

export function LoginModal() {
  const [view, setView] = useState<'login' | 'forgot'>('login')
  const [state, formAction, isPending] = useActionState<AuthActionResponse | null, FormData>(
    view === 'login' ? login : forgotPassword,
    { error: null, success: null }
  )

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[110]">
          <DashboardSkeleton />
        </div>
      )}
      
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${isPending ? 'invisible opacity-0' : 'visible opacity-100'}`}>
        {/* 8-bit scanline effect overlay */}
        <div className="pointer-events-none fixed inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

        <div className="w-full max-w-md relative z-20">
          <div className="border-4 border-white p-6 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h1 className="text-4xl font-bold text-white mb-8 text-center uppercase tracking-widest font-mono">
              {view === 'login' ? 'Focus Quest' : 'Recover Access'}
            </h1>

            <div className="flex flex-col gap-6">
              <form action={formAction} className="flex flex-col gap-6">
                {state?.error && (
                  <div className="bg-red-900 border-2 border-red-500 p-3 text-white font-mono text-sm">
                    [!] {state.error}
                  </div>
                )}

                {state?.success && (
                  <div className="bg-green-900 border-2 border-green-500 p-3 text-white font-mono text-sm">
                    [*] {state.success}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-white font-mono uppercase tracking-tighter" htmlFor="email">
                    User ID (Email)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isPending}
                    className="bg-neutral-800 border-2 border-white p-2 text-white font-mono focus:bg-white focus:text-black outline-none transition-colors"
                    placeholder="hero@quest.com"
                  />
                </div>

                {view === 'login' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <label className="text-white font-mono uppercase tracking-tighter" htmlFor="password">
                        Passphrase
                      </label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        disabled={isPending}
                        className="text-[10px] text-neutral-500 hover:text-white uppercase font-mono mb-0.5"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      disabled={isPending}
                      className="bg-neutral-800 border-2 border-white p-2 text-white font-mono focus:bg-white focus:text-black outline-none transition-colors"
                      placeholder="********"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-4 bg-white text-black font-mono font-bold py-3 uppercase tracking-widest hover:bg-neutral-300 active:translate-y-1 transition-all border-b-4 border-neutral-500 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {view === 'login' ? 'Enter Hub' : 'Send Recovery Link'}
                </button>

                {view === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    disabled={isPending}
                    className="text-center text-xs text-neutral-400 hover:text-white uppercase font-mono disabled:opacity-50"
                  >
                    Back to Login
                  </button>
                )}
              </form>

              {view === 'login' && (
                <>
                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-neutral-700"></div>
                    <span className="flex-shrink mx-4 text-neutral-500 font-mono text-xs uppercase">or</span>
                    <div className="flex-grow border-t border-neutral-700"></div>
                  </div>

                  <form action={signInWithGoogle}>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white font-mono font-bold py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign in with Google
                    </button>
                  </form>

                  <p className="text-neutral-400 font-mono text-center text-sm uppercase">
                    New Hero?{' '}
                    <Link href="/register" className="text-white underline hover:no-underline">
                      Register Here
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
