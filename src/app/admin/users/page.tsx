import { getAllUsers } from '@/actions/admin.actions'
import { AdminUserTable } from '@/components/admin/AdminUserTable'

export default async function ManageUsers() {
  const users = await getAllUsers()

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Hero Directory</h1>
        <p className="text-neutral-500 text-sm">Monitor and manage all registered heroes in the system.</p>
      </div>

      <AdminUserTable initialUsers={users} />
    </div>
  )
}
