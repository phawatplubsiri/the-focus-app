import { getAllScenes, createScene, deleteScene } from '@/actions/admin.actions'
import { redirect } from 'next/navigation'

export default async function ManageScenes() {
  const scenes = await getAllScenes()

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Scene Forge</h1>
          <p className="text-neutral-500 text-sm">Deploy new environments or decommission old ones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Add Scene Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-white/5 p-6 rounded-2xl sticky top-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-6">Forge New Scene</h3>
            
            <form action={createScene} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-500 uppercase font-black">Scene Name</label>
                <input name="name" required className="w-full bg-black border border-white/10 rounded p-3 text-sm focus:border-cyan-500 outline-none" placeholder="e.g. Floating Island" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-neutral-500 uppercase font-black">Image Path/URL</label>
                <input name="imageUrl" required className="w-full bg-black border border-white/10 rounded p-3 text-sm focus:border-cyan-500 outline-none" placeholder="/scenes/example.jpg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-500 uppercase font-black">Type</label>
                  <select name="type" className="w-full bg-black border border-white/10 rounded p-3 text-sm focus:border-cyan-500 outline-none">
                    <option value="static">Static</option>
                    <option value="dynamic">Dynamic</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-neutral-500 uppercase font-black">Price (◈)</label>
                  <input name="price" type="number" defaultValue="0" className="w-full bg-black border border-white/10 rounded p-3 text-sm focus:border-cyan-500 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" name="isDefault" id="isDefault" className="w-4 h-4 bg-black border-white/10" />
                <label htmlFor="isDefault" className="text-[10px] text-neutral-300 uppercase font-black">Set as Default</label>
              </div>

              <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all mt-4">
                Deploy Scene ⚒
              </button>
            </form>
          </div>
        </div>

        {/* Scene List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 mb-6">Active Deployments ({scenes.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenes.map((scene) => (
              <div key={scene.id} className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden flex flex-col group">
                <div className="aspect-video bg-neutral-800 relative">
                  <img src={scene.imageUrl} alt={scene.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  {scene.isDefault && (
                    <span className="absolute top-2 left-2 bg-cyan-500 text-black text-[8px] font-black px-2 py-1 uppercase rounded">Default</span>
                  )}
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tighter">{scene.name}</h4>
                    <p className="text-[10px] text-neutral-500 uppercase">{scene.type} — {scene.price}◈</p>
                  </div>
                  
                  <form action={async () => {
                    'use server'
                    await deleteScene(scene.id)
                  }}>
                    <button className="text-[10px] text-red-900 hover:text-red-500 font-black uppercase tracking-widest transition-colors">
                      [X] Terminate
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
