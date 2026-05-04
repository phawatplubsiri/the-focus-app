export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      {/* 8-bit scanline effect overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="border-4 border-white p-6 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <h1 className="text-4xl font-bold text-white mb-8 text-center uppercase tracking-widest font-mono">
            Focus Quest
          </h1>
          {children}
        </div>
      </div>
    </div>
  )
}
