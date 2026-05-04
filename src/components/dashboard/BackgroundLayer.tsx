interface BackgroundLayerProps {
  imageUrl?: string
}

export function BackgroundLayer({ imageUrl }: BackgroundLayerProps) {
  // ลำดับความสำคัญ: 1. รูปจากฐานข้อมูล 2. รูปสำรอง (Fallback)
  const bgImage =
    imageUrl ||
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Background Image - เพิ่ม blur กลับเข้าไปตามคำขอ (blur-[2px]) */}
      <img
        src={bgImage}
        alt="scene-background"
        className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-1000 blur-[2px]"
      />

      {/* Dark Overlay - ปรับให้นุ่มนวลขึ้นเพื่อโชว์รายละเอียดภาพ */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />
      
      {/* Vignette - เน้นให้ภาพดูมีมิติแต่กว้างขึ้น */}
      <div className="absolute inset-0 bg-black/10 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)]" />

      {/* Scanlines Effect - สไตล์ 8-bit ปรับให้บางลง */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_4px,4px_100%] opacity-15" />
    </div>
  )
}
