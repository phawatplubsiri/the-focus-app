'use client'

import { verifyOtp } from '@/actions/auth.actions'
import { useActionState, use } from 'react'
import { AuthActionResponse } from '@/types/auth'

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = use(searchParams)
  const email = typeof params.email === 'string' ? params.email : ''
  
  const [state, formAction, isPending] = useActionState<AuthActionResponse | null, FormData>(
    verifyOtp,
    { error: null, success: null }
  )

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-white font-mono uppercase text-sm mb-2">Verification Code Sent To:</p>
        <p className="text-yellow-400 font-mono text-xs break-all mb-4">{email}</p>
      </div>

      {state?.error && (
        <div className="bg-red-900 border-2 border-red-500 p-3 text-white font-mono text-sm text-center">
          [!] {state.error}
        </div>
      )}

      <input type="hidden" name="email" value={email} />

      <div className="flex flex-col gap-2">
        <label className="text-white font-mono uppercase tracking-tighter" htmlFor="token">
          Enter 6-Digit Code
        </label>
        <input
          id="token"
          name="token"
          type="text"
          required
          maxLength={6}
          disabled={isPending}
          className="bg-neutral-800 border-2 border-white p-4 text-white font-mono text-2xl text-center tracking-[1em] focus:bg-white focus:text-black outline-none transition-colors disabled:opacity-50"
          placeholder="000000"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 bg-yellow-500 text-black font-mono font-bold py-3 uppercase tracking-widest hover:bg-yellow-400 active:translate-y-1 transition-all border-b-4 border-yellow-800 active:border-b-0 disabled:opacity-50"
      >
        {isPending ? 'Verifying...' : 'Verify Hero'}
      </button>

      <p className="text-neutral-500 font-mono text-[10px] text-center uppercase leading-tight">
        Check your spam folder if the scroll of truth (email) hasn't arrived.
      </p>
    </form>
  )
}
