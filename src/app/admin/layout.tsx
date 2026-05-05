import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const profile = await prisma.profile.findUnique({
    where: { id: user.id }
  })

  if (profile?.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-neutral-900/50 flex flex-col p-6 gap-8">
        <div>
          <h2 className="text-xl font-black text-cyan-400 tracking-tighter mb-1">ADMIN CONTROL</h2>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Focus Quest OS v1.0</p>
        </div>

        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all text-sm uppercase tracking-widest">
            Overview
          </Link>
          <Link href="/admin/scenes" className="p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all text-sm uppercase tracking-widest">
            Manage Scenes
          </Link>
          <Link href="/admin/users" className="p-3 hover:bg-white/5 rounded border border-transparent hover:border-white/10 transition-all text-sm uppercase tracking-widest">
            Manage Users
          </Link>
        </nav>

        <div className="mt-auto">
          <Link href="/" className="flex items-center justify-center p-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all">
            Return to Hub ⇪
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-12">
        {children}
      </main>
    </div>
  )
}
