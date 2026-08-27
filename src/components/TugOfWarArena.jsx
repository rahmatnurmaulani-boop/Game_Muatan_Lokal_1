import React from "react";

// =========================================================================
// 1. KOMPONEN PEJUANG (GAMBAR AI + MIRROR KHUSUS TIM KANAN)
// =========================================================================
function WarriorDisplay({ isLeft, isPulling, isWinning, isLosing }) {
  const leanAngle = isPulling || isWinning ? -14 : isLosing ? 10 : -5;

  return (
    <div
      className={`relative transition-all duration-300 flex flex-col items-center select-none ${
        isPulling
          ? "scale-110 -translate-y-1"
          : isWinning
            ? "scale-105"
            : isLosing
              ? "opacity-80 scale-95"
              : ""
      }`}
    >
      {/* Wrapper Gambar: Tim Kiri normal, Tim Kanan otomatis scaleX(-1) menghadap ke tali */}
      <div
        style={{
          transform: isLeft ? "none" : "scaleX(-1)",
          display: "inline-block",
        }}
      >
        <img
          src={isLeft ? "/karakter-kiri.png" : "/karakter-kanan.png"}
          alt={isLeft ? "Pejuang Tim 1" : "Pejuang Tim 2"}
          style={{
            transform: `rotate(${leanAngle}deg)`,
            transformOrigin: "bottom center",
            transition: "transform 0.3s ease",
          }}
          className="w-28 h-36 md:w-36 md:h-44 object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] pointer-events-none"
        />
      </div>

      {/* Label Status Karakter */}
      <div
        className={`px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider mt-0.5 border shadow ${
          isLeft
            ? "bg-amber-500 text-slate-950 border-amber-300"
            : "bg-emerald-500 text-slate-950 border-emerald-300"
        }`}
      >
        {isPulling ? "MENARIK! 💥" : isWinning ? "MEMIMPIN! 👑" : "BERTAHAN ⚡"}
      </div>
    </div>
  );
}

// =========================================================================
// 2. ARENA UTAMA (TALI DIAM, HANYA PITA MERAH YANG BERGESER)
// =========================================================================
export default function TugOfWarArena({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  isPulling1,
  isPulling2,
}) {
  // Posisi Pita Merah:
  // - Tim 1 (Kiri) unggul -> ribbonShift bernilai negatif -> geser ke KIRI
  // - Tim 2 (Kanan) unggul -> ribbonShift bernilai positif -> geser ke KANAN
  const scoreDifference = team2Score - team1Score;
  const ribbonShift = Math.max(-38, Math.min(38, (scoreDifference / 400) * 38));

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700/80 rounded-2xl p-2.5 md:p-3 shadow-xl relative overflow-hidden mb-2">
      {/* Garis Batas Tengah Lapangan */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-amber-500/40 z-0" />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-slate-950/90 rounded-full border border-amber-500/30 text-[9px] uppercase font-black tracking-widest text-amber-400 z-0">
        GARIS TENGAH
      </div>

      {/* Header Skor Tim */}
      <div className="flex justify-between items-center px-3 mb-1 z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs md:text-sm font-black text-amber-400 uppercase tracking-wider">
            {team1Name}{" "}
            <span className="text-white text-sm md:text-base ml-1 font-black">
              {team1Score} PTS
            </span>
          </span>
        </div>

        <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700">
          ⚡ TARIK TAMBANG SIMULTAN
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-black text-emerald-400 uppercase tracking-wider">
            <span className="text-white text-sm md:text-base mr-1 font-black">
              {team2Score} PTS
            </span>{" "}
            {team2Name}
          </span>
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Arena Tali, Pita & Karakter */}
      <div className="relative h-28 md:h-34 flex items-center justify-between px-4 md:px-12 w-full overflow-hidden">
        {/* Karakter Tim 1 (Kiri) */}
        <div className="z-20">
          <WarriorDisplay
            isLeft={true}
            isPulling={isPulling1}
            isWinning={team1Score > team2Score + 50}
            isLosing={team2Score > team1Score + 50}
          />
        </div>

        {/* TALI DIAM (FIXED) SEJAJAR DENGAN TANGAN PEJUANG */}
        <div className="absolute left-8 right-8 top-[43%] md:top-[44%] -translate-y-1/2 z-10 pointer-events-none flex items-center">
          <img
            src="/tali.png"
            alt="Tali Tambang"
            className="w-full h-3 md:h-4 object-cover filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.65)]"
          />

          {/* HANYA SIMPUL PITA MERAH INI YANG BERGESER DINAMIS */}
          <div
            className="absolute top-1/2 transition-all duration-500 ease-out z-20 flex flex-col items-center pointer-events-none"
            style={{
              left: `calc(50% + ${ribbonShift}%)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Lilitan Simpul */}
            <div className="w-3.5 h-4.5 md:w-4 md:h-5 bg-gradient-to-r from-red-900 via-red-600 to-red-900 rounded-sm shadow-md border-t border-red-400 flex items-center justify-center">
              <span className="text-[7px] font-black text-white leading-none">
                ▼
              </span>
            </div>
            {/* Ekor Pita Menjuntai */}
            <div className="flex gap-0.5 -mt-0.5">
              <div className="w-1.5 h-4 bg-gradient-to-b from-red-600 via-red-800 to-red-950 rounded-b shadow transform -rotate-12 origin-top" />
              <div className="w-1.5 h-5.5 bg-gradient-to-b from-red-500 via-red-700 to-red-950 rounded-b shadow transform rotate-6 origin-top" />
            </div>
          </div>
        </div>

        {/* Karakter Tim 2 (Kanan) */}
        <div className="z-20">
          <WarriorDisplay
            isLeft={false}
            isPulling={isPulling2}
            isWinning={team2Score > team1Score + 50}
            isLosing={team1Score > team2Score + 50}
          />
        </div>
      </div>
    </div>
  );
}
