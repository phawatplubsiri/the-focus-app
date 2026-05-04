import prisma from '@/lib/prisma'

export default async function AdminOverview() {
  const [userCount, sceneCount, sessionCount] = await Promise.all([
    prisma.profile.count(),
    prisma.scene.count(),
    prisma.focusSession.count()
  ])

  const stats = [
    { label: 'Total Heroes', value: userCount, icon: '👤', color: 'text-cyan-400' },
    { label: 'Active Scenes', value: sceneCount, icon: '🖼️', color: 'text-purple-400' },
    { label: 'Total Quests', value: sessionCount, icon: '⚔️', color: 'text-yellow-400' },
  ]

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Command Center</h1>
        <p className="text-neutral-500 text-sm">Welcome back, Grandmaster. System status is NOMINAL.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-neutral-900 border border-white/5 p-6 rounded-xl hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900/30 border border-white/5 p-8 rounded-2xl">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">System Logs (Last Actions)</h3>
        <div className="space-y-4">
          <p className="text-[10px] text-neutral-600 font-mono">[02:45:12] DB_SYNC: Synchronized 3 scenes from static/assets</p>
          <p className="text-[10px] text-neutral-600 font-mono">[03:12:45] AUTH_WATCHER: New user verified from source: Google_OAuth</p>
          <p className="text-[10px] text-neutral-600 font-mono">[05:01:22] ADMIN_SESSION: Grandmaster access granted</p>
        </div>
      </div>
    </div>
  )
}
