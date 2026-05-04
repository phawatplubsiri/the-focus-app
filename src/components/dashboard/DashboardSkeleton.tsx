import { Skeleton } from '@/components/ui/Skeleton'

export function DashboardSkeleton() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white font-mono overflow-hidden flex flex-col animate-fade-in">
      {/* Background Layer Placeholder */}
      <div className="absolute inset-0 bg-neutral-900/50" />

      {/* Navbar Placeholder */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5 h-20 min-h-[5rem]">
        <div className="h-full px-6 flex justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-9 h-9" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-48 h-2" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="w-24 h-8 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area Placeholder */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar Placeholder */}
        <aside className="w-20 border-r border-white/5 bg-black/40 flex flex-col items-center py-8 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-10 rounded" />
          ))}
        </aside>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 gap-12 overflow-auto">
          {/* Timer Placeholder */}
          <div className="flex flex-col items-center gap-8">
            <Skeleton className="w-64 h-64 rounded-full" />
            <Skeleton className="w-48 h-12" />
            <Skeleton className="w-32 h-4" />
          </div>
          
          {/* Focus Input Placeholder */}
          <Skeleton className="w-full max-w-md h-12 rounded-lg" />
        </div>
      </main>

      {/* Widgets Placeholder */}
      <div className="absolute bottom-8 left-8 z-20">
        <Skeleton className="w-64 h-24 rounded-lg" />
      </div>

      <div className="absolute bottom-8 right-8 z-20">
        <Skeleton className="w-80 h-24 rounded-lg" />
      </div>
    </div>
  )
}
