import React from 'react'
import Link from 'next/link'

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen border-r bg-gray-50 flex flex-col p-4 sticky top-0">
      <h1 className="text-xl font-bold mb-8">Focus Hub</h1>
      <nav className="flex flex-col gap-2">
        <Link href="/" className="px-4 py-2 hover:bg-white rounded-md transition-all font-medium">
          Dashboard
        </Link>
        <Link href="/history" className="px-4 py-2 hover:bg-white rounded-md transition-all font-medium">
          History
        </Link>
      </nav>
      <div className="mt-auto pt-4 border-t">
        <div className="p-4 bg-blue-100 rounded-lg">
          <p className="text-sm font-semibold text-blue-800">Next Level</p>
          <div className="w-full bg-blue-200 h-2 rounded-full mt-2">
            <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
