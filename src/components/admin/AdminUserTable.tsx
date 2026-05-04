'use client'

import { useState } from 'react'
import { updateUserDetails, deleteUser } from '@/actions/admin.actions'
import { Icons } from '@/components/ui/Icons'

interface UserProfile {
  id: string
  email: string
  username: string | null
  role: string
  experienceScore: number
  totalPoints: number
}

interface AdminUserTableProps {
  initialUsers: UserProfile[]
}

export function AdminUserTable({ initialUsers }: AdminUserTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})

  const handleEdit = (user: UserProfile) => {
    setEditingId(user.id)
    setEditData({
      username: user.username || `User_${user.id.substring(0, 5)}`,
      experienceScore: user.experienceScore,
      totalPoints: user.totalPoints,
      role: user.role
    })
  }

  const handleSave = async (id: string) => {
    try {
      await updateUserDetails(id, {
        username: editData.username || undefined,
        experienceScore: Number(editData.experienceScore),
        totalPoints: Number(editData.totalPoints),
        role: editData.role
      })
      setEditingId(null)
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hero? This action cannot be undone.')) {
      try {
        await deleteUser(id)
      } catch (error: any) {
        alert('Error: ' + error.message)
      }
    }
  }

  return (
    <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <th className="p-4">Hero ID / Email</th>
            <th className="p-4">Username</th>
            <th className="p-4">Role</th>
            <th className="p-4 text-right">Experience</th>
            <th className="p-4 text-right">Points</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {initialUsers.map((user) => {
            const isEditing = editingId === user.id
            const displayUsername = user.username || `User_${user.id.substring(0, 5)}`

            return (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-white">{user.email}</span>
                    <span className="text-[8px] text-neutral-600 font-mono">{user.id}</span>
                  </div>
                </td>
                <td className="p-4">
                  {isEditing ? (
                    <input 
                      type="text"
                      className="bg-black border border-white/10 rounded px-2 py-1 text-sm font-black text-cyan-400 w-full"
                      value={editData.username || ''}
                      onChange={(e) => setEditData({...editData, username: e.target.value})}
                    />
                  ) : (
                    <span className="text-sm font-black text-cyan-400">{displayUsername}</span>
                  )}
                </td>
                <td className="p-4">
                  {isEditing ? (
                    <select 
                      className="bg-black border border-white/10 rounded px-2 py-1 text-[10px] font-black uppercase"
                      value={editData.role}
                      onChange={(e) => setEditData({...editData, role: e.target.value})}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span className={`text-[8px] font-black px-2 py-1 rounded uppercase ${
                      user.role === 'ADMIN' ? 'bg-purple-500 text-white' : 'bg-neutral-700 text-neutral-300'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                   {isEditing ? (
                    <input 
                      type="number"
                      className="bg-black border border-white/10 rounded px-2 py-1 text-xs font-mono text-right w-24"
                      value={editData.experienceScore}
                      onChange={(e) => setEditData({...editData, experienceScore: Number(e.target.value)})}
                    />
                  ) : (
                    <span className="font-mono text-xs text-white">{user.experienceScore.toLocaleString()} XP</span>
                  )}
                </td>
                <td className="p-4 text-right">
                   {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                       <Icons.Coin className="w-3 h-3 text-yellow-500" />
                       <input 
                        type="number"
                        className="bg-black border border-white/10 rounded px-2 py-1 text-xs font-mono text-right text-yellow-500 w-24"
                        value={editData.totalPoints}
                        onChange={(e) => setEditData({...editData, totalPoints: Number(e.target.value)})}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Icons.Coin className="w-3 h-3 text-yellow-500/50" />
                      <span className="font-mono text-xs text-yellow-500">{user.totalPoints.toLocaleString()}</span>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-4">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={() => handleSave(user.id)}
                          className="text-green-500 hover:text-green-400 p-1 rounded hover:bg-white/5 transition-colors"
                          title="Save"
                        >
                          <Icons.Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)}
                          className="text-neutral-500 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
                          title="Cancel"
                        >
                          <Icons.X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="text-cyan-500 hover:text-cyan-400 p-1 rounded hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500/50 hover:text-red-500 p-1 rounded hover:bg-white/5 transition-colors"
                          title="Delete"
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
