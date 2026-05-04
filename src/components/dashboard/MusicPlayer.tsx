'use client'

import { useState, useEffect, useRef } from 'react'
import { useUIStore } from '@/store/useUIStore'

interface Track {
  name: string
  url: string
  genre: string
}

interface Ambient {
  name: string
  url: string
  icon: string
}

const MUSIC_TRACKS = [
  {
    name: "Lofi Study",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    genre: "Chill / Focus"
  },
  {
    name: "Soft Piano",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    genre: "Piano / Relax"
  },
  {
    name: "Ambient Flow",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    genre: "Ambient / Minimal"
  }
];

const AMBIENT_SOUNDS = [
  {
    name: "Rain",
    url: "https://cdn.jsdelivr.net/gh/anars/blank-audio/10-seconds-of-silence.mp3",
    icon: "🌧️"
  },
  {
    name: "White Noise",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_280f279f75.mp3?filename=white-noise-110624.mp3",
    icon: "🌫️"
  },
  {
    name: "Ocean Waves",
    url: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_9242095f6b.mp3?filename=ocean-waves-110620.mp3",
    icon: "🌊"
  },
  {
    name: "Forest",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_655359a341.mp3?filename=forest-ambient-110602.mp3",
    icon: "🌲"
  }
];

export function MusicPlayer() {
  const { isMusicPlayerVisible, toggleMusicPlayer } = useUIStore()
  
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0)
  const [currentAmbientIdx, setCurrentAmbientIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [musicVolume, setMusicVolume] = useState(50)
  const [ambientVolume, setAmbientVolume] = useState(30)

  useEffect(() => {
    musicRef.current = new Audio(MUSIC_TRACKS[currentTrackIdx].url)
    musicRef.current.loop = true
    ambientRef.current = new Audio('')
    ambientRef.current.loop = true

    return () => {
      musicRef.current?.pause()
      ambientRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      musicRef.current?.play().catch(() => setIsPlaying(false))
      if (currentAmbientIdx !== -1) ambientRef.current?.play().catch(() => {})
    } else {
      musicRef.current?.pause()
      ambientRef.current?.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (musicRef.current) {
      const wasPlaying = isPlaying
      musicRef.current.src = MUSIC_TRACKS[currentTrackIdx].url
      musicRef.current.load()
      if (wasPlaying) musicRef.current.play()
    }
  }, [currentTrackIdx])

  useEffect(() => {
    if (ambientRef.current) {
      if (currentAmbientIdx === -1) {
        ambientRef.current.pause()
        ambientRef.current.src = ''
      } else {
        ambientRef.current.src = AMBIENT_SOUNDS[currentAmbientIdx].url
        ambientRef.current.load()
        if (isPlaying) ambientRef.current.play()
      }
    }
  }, [currentAmbientIdx])

  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = musicVolume / 100
  }, [musicVolume])

  useEffect(() => {
    if (ambientRef.current) ambientRef.current.volume = ambientVolume / 100
  }, [ambientVolume])

  const nextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % MUSIC_TRACKS.length)
  }

  return (
    <>
      {!isMusicPlayerVisible && (
        <button
          onClick={toggleMusicPlayer}
          className="fixed right-0 top-1/2 -translate-y-1/10 z-50 flex flex-col items-center gap-4 py-8 px-2 bg-black/40 backdrop-blur-md border border-r-0 border-cyan-500/50 rounded-l-2xl hover:bg-cyan-500/10 transition-all group shadow-[-5px_0_15px_rgba(6,182,212,0.2)]"
        >
          <span className="text-cyan-400 text-xl font-black group-hover:-translate-x-1 transition-transform">⇦</span>
          <div className="flex flex-col gap-2">
             {['M', 'U', 'S', 'I', 'C'].map((char, i) => (
               <span key={i} className="text-[14px] font-black text-cyan-400/80 leading-none">{char}</span>
             ))}
          </div>
        </button>
      )}

      <div 
        className={`fixed right-0 top-1/2 -translate-y-1/10 z-50 transition-all duration-500 ease-in-out ${
          isMusicPlayerVisible ? '-translate-x-4 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-5 space-y-4 shadow-2xl min-w-[320px] relative">
          <button 
            onClick={toggleMusicPlayer}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-cyan-500 text-black flex items-center justify-center rounded-l font-black hover:bg-cyan-400 transition-colors"
          >
            ⇨
          </button>

          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className={`w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] ${isPlaying ? 'animate-spin-slow' : ''}`}>
              🎵
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white truncate">
                {MUSIC_TRACKS[currentTrackIdx].name}
              </p>
              <p className="text-[9px] text-cyan-500/70 uppercase tracking-tighter truncate font-bold mt-1">
                {MUSIC_TRACKS[currentTrackIdx].genre}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 p-3 rounded-lg space-y-3">
              <div className="flex items-center justify-between px-2">
                 <span className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Music Volume</span>
                 <div className="flex gap-4">
                    <button onClick={nextTrack} className="text-neutral-500 hover:text-white transition-colors text-xs" title="Next Track">⏭</button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    >
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-2">
                <span className="text-[10px] opacity-40">🔊</span>
                <input
                  type="range" min="0" max="100" value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="flex-1 h-1 bg-neutral-800 rounded-full cursor-pointer appearance-none accent-cyan-500"
                />
              </div>
            </div>

            {/* <div className="bg-white/5 p-3 rounded-lg space-y-3">
              <span className="text-[9px] font-black uppercase text-neutral-500 tracking-widest px-2">Nature Layers</span>
              <div className="grid grid-cols-4 gap-2 px-2">
                {AMBIENT_SOUNDS.map((sound, idx) => (
                  <button
                    key={sound.name}
                    onClick={() => setCurrentAmbientIdx(currentAmbientIdx === idx ? -1 : idx)}
                    className={`py-2 rounded border text-sm transition-all ${
                      currentAmbientIdx === idx 
                        ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                        : 'border-white/5 bg-black/20 text-neutral-500 hover:border-white/20'
                    }`}
                    title={sound.name}
                  >
                    {sound.icon}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-2">
                <span className="text-[10px] opacity-40">🌬️</span>
                <input
                  type="range" min="0" max="100" value={ambientVolume}
                  onChange={(e) => setAmbientVolume(Number(e.target.value))}
                  disabled={currentAmbientIdx === -1}
                  className="flex-1 h-1 bg-neutral-800 rounded-full cursor-pointer appearance-none accent-cyan-500 disabled:opacity-20"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}
