import { Icons } from '@/components/ui/Icons'

export function UserStats({ coins }: { coins: number }) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-white/5 border border-white/5">
      <div className="flex flex-col items-end">
        <span className="text-[7px] text-neutral-500 uppercase font-black tracking-tighter">Credits</span>
        <span className="text-[11px] font-black text-yellow-500 flex items-center gap-1.5">
          <Icons.Coin className="w-3 h-3" /> {coins.toLocaleString()}
        </span>
      </div>
    </div>
  )
}
