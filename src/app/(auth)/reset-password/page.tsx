'use client'

import { updatePassword } from '@/actions/auth.actions'
import { useActionState } from 'react'
import { AuthActionResponse } from '@/types/auth'

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResponse | null, FormData>(
    updatePassword,
    { error: null, success: null }
  )

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      {/* 8-bit scanline effect overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="border-4 border-white p-6 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <h1 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-widest font-mono">
            New Passphrase
          </h1>
          
          <form action={formAction} className="flex flex-col gap-6">
            {state?.error && (
              <div className="bg-red-900 border-2 border-red-500 p-3 text-white font-mono text-sm">
                [!] {state.error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-white font-mono uppercase tracking-tighter" htmlFor="password">
                New Passphrase
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
                className="bg-neutral-800 border-2 border-white p-2 text-white font-mono focus:bg-white focus:text-black outline-none transition-colors disabled:opacity-50"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 bg-white text-black font-mono font-bold py-3 uppercase tracking-widest hover:bg-neutral-300 active:translate-y-1 transition-all border-b-4 border-neutral-500 active:border-b-0 disabled:opacity-50"
            >
              {isPending ? 'Updating...' : 'Set New Passphrase'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
