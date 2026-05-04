'use client'

import { useState } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { updateUsername, resetPasswordEmail } from '@/actions/user.actions'
import { logout } from '@/actions/auth.actions'
import Link from 'next/link'

interface SettingsModalProps {
  email: string
  currentUsername: string
  role?: string
}

export function SettingsModal({ email, currentUsername, role }: SettingsModalProps) {
  const { isSettingsOpen, toggleSettings, setSettingsOpen } = useUIStore()
  const [username, setUsername] = useState(currentUsername)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  if (!isSettingsOpen && !isLoggingOut) return null

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    setSettingsOpen(false)
    setIsLoggingOut(true)
    await logout()
  }

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    const res = await updateUsername(username)
    if (res.success) {
      setMessage({ text: 'Username updated!', type: 'success' })
    } else {
      setMessage({ text: res.error || 'Failed to update', type: 'error' })
    }
    setIsLoading(false)
  }

  const handleResetPassword = async () => {
    setIsLoading(true)
    const res = await resetPasswordEmail()
    if (res.success) {
      setMessage({ text: 'Reset link sent to your email!', type: 'success' })
    } else {
      setMessage({ text: res.error || 'Failed to send reset link', type: 'error' })
    }
    setIsLoading(false)
  }

  return (
    <>
      {/* Full Screen Loading Overlay for Logout */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-red-400 font-mono font-bold uppercase tracking-[0.3em] animate-pulse">Shutting Down...</p>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={toggleSettings}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-neutral-900 border-2 border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/5 p-4 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">System Configuration</h2>
          <button onClick={toggleSettings} className="text-neutral-500 hover:text-white transition-colors text-lg">×</button>
        </div>

        <div className="p-6 space-y-8">
          {/* Admin Override Section */}
          {role === 'ADMIN' && (
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-500">System Management Override</label>
              <Link 
                href="/admin" 
                onClick={toggleSettings}
                className="w-full py-3 bg-purple-900/20 border border-purple-500/30 rounded text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 hover:bg-purple-500/20 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Command Center</span>
                <span className="text-[8px]">⚡</span>
              </Link>
            </div>
          )}

          {/* Identity Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Identity & Credentials</label>
            <div className="space-y-3">
              <div className="p-3 bg-black/40 rounded border border-white/5">
                <p className="text-[8px] text-neutral-600 uppercase mb-1">Email Address (Primary)</p>
                <p className="text-sm font-mono text-neutral-300">{email}</p>
              </div>

              <form onSubmit={handleUpdateUsername} className="space-y-2">
                <p className="text-[8px] text-neutral-600 uppercase">Username (Callsign)</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-sm text-white font-mono focus:border-cyan-500/50 outline-none transition-all"
                  />
                  <button 
                    disabled={isLoading || username === currentUsername}
                    className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-30"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security & System */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Security & Maintenance</label>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full py-3 bg-white/5 border border-white/10 rounded text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>Reset Access Passphrase</span>
                <span className="text-[8px]">🔐</span>
              </button>

              <form onSubmit={handleLogout}>
                <button 
                  type="submit"
                  disabled={isLoading || isLoggingOut}
                  className="w-full py-3 bg-red-900/10 border border-red-900/30 rounded text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Shut Down (Logout)</span>
                  <span className="text-[8px]">⏻</span>
                </button>
              </form>
            </div>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className={`p-3 rounded text-[10px] font-black uppercase tracking-widest text-center animate-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
        </div>
      )}
    </>
  )
}
