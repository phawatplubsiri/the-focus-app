'use client'

import Link from 'next/link'
import { signup } from '@/actions/auth.actions'
import { useActionState } from 'react'
import { AuthActionResponse } from '@/types/auth'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResponse | null, FormData>(
    signup,
    { error: null, success: null }
  )

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="bg-red-900 border-2 border-red-500 p-3 text-white font-mono text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-900 border-2 border-green-500 p-3 text-white font-mono text-sm">
          {state.success}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-white font-mono uppercase tracking-tighter" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
          className="bg-neutral-800 border-2 border-white p-2 text-white font-mono focus:bg-white focus:text-black outline-none transition-colors disabled:opacity-50"
          placeholder="hero@quest.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-white font-mono uppercase tracking-tighter" htmlFor="password">
          Create Passphrase
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
        className="mt-4 bg-white text-black font-mono font-bold py-3 uppercase tracking-widest hover:bg-neutral-300 active:translate-y-1 transition-all border-b-4 border-neutral-500 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Creating...' : 'Create Account'}
      </button>

      <p className="text-neutral-400 font-mono text-center text-sm uppercase">
        Already registered?{' '}
        <Link href="/" className="text-white underline hover:no-underline">
          Log In
        </Link>
      </p>
    </form>
  )
}
