'use client'

import { useState, useEffect } from 'react'
import { useUIStore } from '@/store/useUIStore'
import { getStoreScenes, purchaseScene, setActiveScene } from '@/actions/store.actions'
import { Skeleton } from '@/components/ui/Skeleton'

interface SceneWithStatus {
  id: string
  name: string
  imageUrl: string
  price: number
  type: string
  isOwned: boolean
}

interface StoreModalProps {
  userPoints: number
  currentSceneId?: string
}

export function StoreModal({ userPoints, currentSceneId }: StoreModalProps) {
  const { isStoreOpen, toggleStore } = useUIStore()
  const [scenes, setScenes] = useState<SceneWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (isStoreOpen) {
      loadScenes()
    } else {
      setMessage(null)
    }
  }, [isStoreOpen])

  async function loadScenes() {
    setLoading(true)
    const res = await getStoreScenes()
    if (res.scenes) {
      setScenes(res.scenes)
    }
    setLoading(false)
  }

  const handleAction = async (scene: SceneWithStatus) => {
    setProcessing(scene.id)
    setMessage(null)
    
    if (scene.isOwned) {
      const res = await setActiveScene(scene.id)
      if (res.success) {
        setMessage({ text: `Set ${scene.name} as background`, type: 'success' })
      } else {
        setMessage({ text: res.error || 'Failed to set scene', type: 'error' })
      }
    } else {
      if (userPoints < scene.price) {
        setMessage({ text: 'Not enough points!', type: 'error' })
      } else {
        const res = await purchaseScene(scene.id)
        if (res.success) {
          setMessage({ text: res.message || 'Purchase successful!', type: 'success' })
          await loadScenes()
        } else {
          setMessage({ text: res.error || 'Purchase failed', type: 'error' })
        }
      }
    }
    setProcessing(null)
  }

  if (!isStoreOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={toggleStore} />

      <div className="relative w-full max-w-4xl bg-neutral-900 border-2 border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/5 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-cyan-400">Environment Hub</h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Available ◈ Points: <span className="text-yellow-500 font-mono">{userPoints.toLocaleString()}</span></p>
          </div>
          <button onClick={toggleStore} className="text-neutral-500 hover:text-white transition-colors text-2xl">×</button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          {message && (
            <div className={`mb-8 p-4 rounded text-xs font-black uppercase tracking-widest text-center animate-in slide-in-from-top-4 duration-300 ${
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="aspect-[16/10] rounded-xl" />)
            ) : (
              scenes.map((scene) => (
                <div key={scene.id} className="flex flex-col bg-black/40 border border-white/5 rounded-xl overflow-hidden group hover:border-white/20 transition-all">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                      src={scene.imageUrl} 
                      alt={scene.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!scene.isOwned ? 'grayscale opacity-40' : ''}`} 
                    />
                    {!scene.isOwned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl opacity-50">🔒</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-black uppercase tracking-tight truncate">{scene.name}</h4>
                      <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded text-neutral-500 uppercase">{scene.type}</span>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                      {scene.isOwned ? (
                        <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Unlocked</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500 text-xs font-mono">{scene.price}</span>
                          <span className="text-yellow-500/60 text-[8px] font-black uppercase">◈</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleAction(scene)}
                        disabled={processing === scene.id || (!scene.isOwned && userPoints < scene.price) || scene.id === currentSceneId}
                        className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                          scene.id === currentSceneId
                            ? 'bg-cyan-500/20 text-cyan-400 opacity-50 cursor-not-allowed border border-cyan-500/30'
                            : scene.isOwned
                            ? 'bg-white text-black hover:bg-cyan-400'
                            : userPoints >= scene.price
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-red-900/20 text-red-500 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {processing === scene.id 
                          ? 'Wait...' 
                          : scene.id === currentSceneId
                          ? 'Active'
                          : scene.isOwned ? 'Apply' : 'Unlock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-black/40 p-4 flex justify-center border-t border-white/5">
           <p className="text-[8px] text-neutral-700 uppercase tracking-widest font-black">Secure Marketplace Protocol v1.2</p>
        </div>
      </div>
    </div>
  )
}
