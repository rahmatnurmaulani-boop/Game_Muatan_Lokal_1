import React from "react";

function RealisticDayakWarrior({
  theme = "amber",
  isPulling = false,
  isWinning = false,
  isLosing = false,
}) {
  const isLeft = theme === "amber";

  const vestColor1 = isLeft ? "#b45309" : "#047857";
  const vestColor2 = isLeft ? "#78350f" : "#064e3b";
  const accentColor = isLeft ? "#f59e0b" : "#10b981";
  const headbandColor = isLeft ? "#dc2626" : "#d97706";
  const skinTone = "#d49b6a";
  const skinShadow = "#b27848";

  let pullRotation =
    isPulling || isWinning ? (isLeft ? -14 : 14) : isLeft ? -6 : 6;
  if (isLosing) pullRotation = isLeft ? 10 : -10;

  return (
    <div
      className={`relative transition-all duration-300 flex flex-col items-center ${
        isPulling ? "scale-110" : ""
      } ${isWinning ? "scale-105" : ""} ${isLosing ? "opacity-80 scale-95" : ""}`}
    >
      <svg
        className={`w-24 h-32 md:w-32 md:h-40 filter drop-shadow-2xl ${!isLeft ? "scale-x-[-1]" : ""}`}
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`rotate(${pullRotation} 80 160)`}>
          <ellipse cx="80" cy="195" rx="45" ry="8" fill="rgba(0,0,0,0.4)" />

          {/* KAKI BELAKANG */}
          <path
            d="M45 140 L30 170 L15 190"
            stroke={skinShadow}
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="18"
            y="178"
            width="14"
            height="6"
            rx="2"
            fill={accentColor}
            transform="rotate(35 18 178)"
          />
          <path d="M12 188 L32 192 L10 196 Z" fill="#451a03" />

          {/* KAKI DEPAN */}
          <path
            d="M75 140 L95 168 L115 192"
            stroke={skinTone}
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="98"
            y="174"
            width="15"
            height="6"
            rx="2"
            fill={accentColor}
            transform="rotate(-40 98 174)"
          />
          <path d="M108 190 L135 192 L110 198 Z" fill="#451a03" />

          {/* CAWAT */}
          <path d="M42 125 L90 125 L82 155 L48 155 Z" fill="#1e293b" />
          <path d="M52 125 L78 125 L74 165 L56 165 Z" fill={headbandColor} />

          {/* TUBUH & ROMPI */}
          <path d="M45 75 L88 75 L82 130 L48 130 Z" fill={skinTone} />
          <path
            d="M65 85 L65 120 M55 100 L75 100 M56 112 L74 112"
            stroke={skinShadow}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path d="M40 75 L58 75 L52 130 L38 126 Z" fill={vestColor1} />
          <path d="M92 75 L74 75 L80 130 L94 126 Z" fill={vestColor2} />
          <path
            d="M42 85 Q50 95 44 110"
            stroke={accentColor}
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M90 85 Q82 95 88 110"
            stroke={accentColor}
            strokeWidth="3"
            fill="none"
          />

          {/* KALUNG */}
          <path
            d="M52 75 Q65 88 78 75"
            stroke="#fef08a"
            strokeWidth="3"
            fill="none"
          />
          <polygon points="65,85 62,94 68,94" fill="#f8fafc" />

          {/* TANGAN KIRI */}
          <path
            d="M46 80 L25 105 L60 112"
            stroke={skinShadow}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="36"
            cy="92"
            r="4"
            stroke="#0f172a"
            strokeWidth="1.5"
            fill="none"
          />

          {/* TANGAN KANAN */}
          <path
            d="M85 80 L115 100 L80 114"
            stroke={skinTone}
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="92"
            y="86"
            width="7"
            height="15"
            rx="2"
            fill={accentColor}
            transform="rotate(30 92 86)"
          />
          <rect
            x="75"
            y="108"
            width="16"
            height="12"
            rx="4"
            fill={skinShadow}
          />

          {/* KEPALA & WAJAH */}
          <rect x="58" y="60" width="16" height="18" fill={skinShadow} rx="3" />
          <ellipse cx="66" cy="50" r="16" fill={skinTone} />
          <path
            d="M54 50 Q66 65 78 50"
            fill={skinTone}
            stroke={skinShadow}
            strokeWidth="2"
          />
          <path d="M50 45 Q42 70 45 85 L52 82 Q48 65 54 48 Z" fill="#09090b" />

          <path
            d="M58 45 L68 47"
            stroke="#18181b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M72 47 L80 45"
            stroke="#18181b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="65" cy="50" r="2.5" fill="#09090b" />
          <circle cx="76" cy="50" r="2.5" fill="#09090b" />
          <path
            d="M63 57 Q70 63 76 57 Z"
            fill="#450a0a"
            stroke="#18181b"
            strokeWidth="1.5"
          />

          {/* IKAT KEPALA & BULU ENGGANG */}
          <path
            d="M48 42 Q66 32 84 42 L83 34 Q66 26 49 34 Z"
            fill={headbandColor}
          />
          <line
            x1="50"
            y1="38"
            x2="82"
            y2="38"
            stroke="#fef08a"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
          <path
            d="M52 35 Q35 5 50 2 Q58 10 54 35 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="1"
          />
          <path d="M45 4 Q50 2 55 4 L53 14 L44 14 Z" fill="#09090b" />
          <path d="M52 35 L49 4" stroke="#64748b" strokeWidth="1" />
        </g>
      </svg>

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

export default function TugOfWarArena({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  isPulling1,
  isPulling2,
}) {
  // RUMUS TARIKAN TALI:
  // Tim 1 (KIRI) lebih unggul -> nilai negatif -> geser ke KIRI (translateX negatif)
  // Tim 2 (KANAN) lebih unggul -> nilai positif -> geser ke KANAN (translateX positif)
  const scoreDifference = team2Score - team1Score;
  const ropeShiftPercent = Math.max(
    -36,
    Math.min(36, (scoreDifference / 400) * 36),
  );

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700/80 rounded-2xl p-2.5 md:p-3 shadow-xl relative overflow-hidden mb-2">
      {/* Garis Tengah Lapangan */}
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

      {/* Arena Tali Tambang */}
      <div className="relative h-28 md:h-34 flex items-center justify-between px-4 md:px-12 w-full overflow-hidden">
        {/* Karakter Kiri (Tim 1) */}
        <div className="z-20">
          <RealisticDayakWarrior
            theme="amber"
            isPulling={isPulling1}
            isWinning={team1Score > team2Score + 50}
            isLosing={team2Score > team1Score + 50}
          />
        </div>

        {/* Tali Tambang Fisika Real-Time */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center transition-transform duration-500 ease-out z-10 pointer-events-none"
          style={{ transform: `translateX(${ropeShiftPercent}%)` }}
        >
          <div className="w-[115%] h-4 md:h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-full shadow-2xl border-y-2 border-amber-950 flex items-center justify-center relative">
            <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(45deg,#000,#000_6px,#fff_6px,#fff_12px)]" />

            {/* Pita Merah Penanda Tengah Tali */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 bottom-[-14px] flex flex-col items-center justify-center z-20">
              <div className="w-5 h-7 md:w-6 md:h-9 bg-rose-600 border-2 border-rose-200 rounded-sm shadow-xl flex items-center justify-center">
                <span className="text-[9px] font-black text-white leading-none">
                  ▼
                </span>
              </div>
              <div className="w-2 h-3 bg-rose-900 rounded-b" />
            </div>
          </div>
        </div>

        {/* Karakter Kanan (Tim 2) */}
        <div className="z-20">
          <RealisticDayakWarrior
            theme="emerald"
            isPulling={isPulling2}
            isWinning={team2Score > team1Score + 50}
            isLosing={team1Score > team2Score + 50}
          />
        </div>
      </div>
    </div>
  );
}
