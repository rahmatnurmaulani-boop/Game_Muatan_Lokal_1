import React, { useState, useEffect, useRef } from "react";
import { questionBank } from "./data/questions";
import { sounds } from "./utils/soundUtils";
import TugOfWarArena from "./components/TugOfWarArena";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Data Tim
  const [team1Name, setTeam1Name] = useState("LASKAR BAKUMPAI");
  const [team2Name, setTeam2Name] = useState("KSATRIA BARITO");
  const [team1Members, setTeam1Members] = useState([
    "Andi",
    "Budi",
    "Citra",
    "Dian",
  ]);
  const [team2Members, setTeam2Members] = useState([
    "Eko",
    "Fajar",
    "Gita",
    "Hana",
  ]);
  const [inputMember1, setInputMember1] = useState("");
  const [inputMember2, setInputMember2] = useState("");

  // Bank Soal Masing-Masing Tim (20 Soal Unik Per Tim)
  const [team1Questions, setTeam1Questions] = useState([]);
  const [team2Questions, setTeam2Questions] = useState([]);

  // Indeks Progres & Skor Independen
  const [t1Index, setT1Index] = useState(0);
  const [t2Index, setT2Index] = useState(0);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);

  // Efek Sentakan Tarik Tali
  const [isPulling1, setIsPulling1] = useState(false);
  const [isPulling2, setIsPulling2] = useState(false);

  // Timer Independen per Tim
  const [t1Timer, setT1Timer] = useState(30);
  const [t2Timer, setT2Timer] = useState(30);

  // Feedback Langsung per Sisi
  const [t1Feedback, setT1Feedback] = useState(null);
  const [t2Feedback, setT2Feedback] = useState(null);

  // Status Selesai
  const [t1Finished, setT1Finished] = useState(false);
  const [t2Finished, setT2Finished] = useState(false);

  const t1TimerRef = useRef(null);
  const t2TimerRef = useRef(null);

  // =========================================================================
  // LOGIKA FULLSCREEN KHUSUS IFP
  // =========================================================================
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen().catch(() => {});
      } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement || !!document.webkitFullscreenElement,
      );
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Toggle Suara & Musik
  const toggleMute = () => {
    sounds.muted = !isMuted;
    setIsMuted(!isMuted);
    if (!isMuted) {
      sounds.stopBGM();
    } else if (screen === "game") {
      sounds.startBGM();
    }
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const generateQuestions = () => {
    const mcQuestions = questionBank.filter(
      (q) => q.type === "multiple-choice",
    );
    const tfQuestions = questionBank.filter((q) => q.type === "true-false");

    const shuffledMC = shuffleArray(mcQuestions);
    const shuffledTF = shuffleArray(tfQuestions);

    const t1Pool = shuffleArray([
      ...shuffledMC.slice(0, 10),
      ...shuffledTF.slice(0, 10),
    ]);
    const t2Pool = shuffleArray([
      ...shuffledMC.slice(10, 20),
      ...shuffledTF.slice(10, 20),
    ]);

    return { t1Pool, t2Pool };
  };

  const startGame = () => {
    // Masuk Fullscreen otomatis saat mulai
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      toggleFullscreen();
    }

    const { t1Pool, t2Pool } = generateQuestions();

    setTeam1Questions(t1Pool);
    setTeam2Questions(t2Pool);
    setT1Index(0);
    setT2Index(0);
    setTeam1Score(0);
    setTeam2Score(0);
    setT1Timer(30);
    setT2Timer(30);
    setT1Feedback(null);
    setT2Feedback(null);
    setT1Finished(false);
    setT2Finished(false);
    setIsPulling1(false);
    setIsPulling2(false);

    setScreen("game");
    sounds.startBGM(); // Memulai BGM Musik Perang Dayak
  };

  // Timer Tim 1
  useEffect(() => {
    if (screen === "game" && !t1Finished && !t1Feedback) {
      t1TimerRef.current = setInterval(() => {
        setT1Timer((prev) => {
          if (prev <= 1) {
            clearInterval(t1TimerRef.current);
            handleTimeout(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t1TimerRef.current);
  }, [screen, t1Index, t1Finished, t1Feedback]);

  // Timer Tim 2
  useEffect(() => {
    if (screen === "game" && !t2Finished && !t2Feedback) {
      t2TimerRef.current = setInterval(() => {
        setT2Timer((prev) => {
          if (prev <= 1) {
            clearInterval(t2TimerRef.current);
            handleTimeout(2);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t2TimerRef.current);
  }, [screen, t2Index, t2Finished, t2Feedback]);

  // Selesai Pertandingan
  useEffect(() => {
    if (t1Finished && t2Finished && screen === "game") {
      sounds.stopBGM();
      sounds.playFanfare();
      setScreen("final");
    }
  }, [t1Finished, t2Finished, screen]);

  // Timeout Handler
  const handleTimeout = (team) => {
    sounds.playWrong();
    if (team === 1) {
      const q = team1Questions[t1Index];
      const correctAns =
        q.type === "true-false"
          ? q.correctAnswer
            ? "BENAR (TRUE)"
            : "SALAH (FALSE)"
          : q.correctAnswer;
      setT1Feedback({
        isCorrect: false,
        score: 0,
        timeout: true,
        correctAnswer: correctAns,
        explanation: q.explanation,
      });
    } else {
      const q = team2Questions[t2Index];
      const correctAns =
        q.type === "true-false"
          ? q.correctAnswer
            ? "BENAR (TRUE)"
            : "SALAH (FALSE)"
          : q.correctAnswer;
      setT2Feedback({
        isCorrect: false,
        score: 0,
        timeout: true,
        correctAnswer: correctAns,
        explanation: q.explanation,
      });
    }
  };

  // Jawaban Tim 1
  const handleAnswerTeam1 = (choice) => {
    if (t1Feedback || t1Finished) return;
    clearInterval(t1TimerRef.current);

    const q = team1Questions[t1Index];
    const isCorrect = choice === q.correctAnswer;
    const correctAns =
      q.type === "true-false"
        ? q.correctAnswer
          ? "BENAR (TRUE)"
          : "SALAH (FALSE)"
        : q.correctAnswer;

    let addedScore = 0;
    if (isCorrect) {
      const speedBonus = Math.floor((t1Timer / 30) * 20);
      addedScore = 100 + speedBonus;
      setTeam1Score((prev) => prev + addedScore);
      setIsPulling1(true);
      setTimeout(() => setIsPulling1(false), 800);
      sounds.playTugPull();
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    setT1Feedback({
      isCorrect,
      score: addedScore,
      timeout: false,
      correctAnswer: correctAns,
      explanation: q.explanation,
    });
  };

  // Jawaban Tim 2
  const handleAnswerTeam2 = (choice) => {
    if (t2Feedback || t2Finished) return;
    clearInterval(t2TimerRef.current);

    const q = team2Questions[t2Index];
    const isCorrect = choice === q.correctAnswer;
    const correctAns =
      q.type === "true-false"
        ? q.correctAnswer
          ? "BENAR (TRUE)"
          : "SALAH (FALSE)"
        : q.correctAnswer;

    let addedScore = 0;
    if (isCorrect) {
      const speedBonus = Math.floor((t2Timer / 30) * 20);
      addedScore = 100 + speedBonus;
      setTeam2Score((prev) => prev + addedScore);
      setIsPulling2(true);
      setTimeout(() => setIsPulling2(false), 800);
      sounds.playTugPull();
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    setT2Feedback({
      isCorrect,
      score: addedScore,
      timeout: false,
      correctAnswer: correctAns,
      explanation: q.explanation,
    });
  };

  // Lanjut Soal Tim 1
  const advanceTeam1 = () => {
    const nextIdx = t1Index + 1;
    if (nextIdx >= 20 || nextIdx >= team1Questions.length) {
      setT1Finished(true);
    } else {
      setT1Index(nextIdx);
      setT1Timer(30);
      setT1Feedback(null);
    }
  };

  // Lanjut Soal Tim 2
  const advanceTeam2 = () => {
    const nextIdx = t2Index + 1;
    if (nextIdx >= 20 || nextIdx >= team2Questions.length) {
      setT2Finished(true);
    } else {
      setT2Index(nextIdx);
      setT2Timer(30);
      setT2Feedback(null);
    }
  };

  // Anggota
  const addMember1 = () => {
    if (inputMember1.trim()) {
      setTeam1Members([...team1Members, inputMember1.trim()]);
      setInputMember1("");
    }
  };
  const removeMember1 = (idx) => {
    if (team1Members.length > 1)
      setTeam1Members(team1Members.filter((_, i) => i !== idx));
  };

  const addMember2 = () => {
    if (inputMember2.trim()) {
      setTeam2Members([...team2Members, inputMember2.trim()]);
      setInputMember2("");
    }
  };
  const removeMember2 = (idx) => {
    if (team2Members.length > 1)
      setTeam2Members(team2Members.filter((_, i) => i !== idx));
  };

  const currentQ1 = team1Questions[t1Index];
  const currentQ2 = team2Questions[t2Index];
  const p1Name = team1Members[t1Index % team1Members.length];
  const p2Name = team2Members[t2Index % team2Members.length];

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none font-sans overflow-hidden p-2.5 md:p-3.5">
      {/* HEADER ATAS LENGKAP DENGAN TOMBOL FULLSCREEN IFP */}
      <header className="flex justify-between items-center bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-1.5 shadow backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-base shadow-inner">
            🪢
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-wide text-amber-400 leading-none">
              TARIK TAMBANG SEJARAH: PANGLIMA BATUR
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Interactive Flat Panel Edition • Barito Utara
            </p>
          </div>
        </div>

        {/* CONTROLS: FULLSCREEN & SOUND */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className={`px-3 py-1 border rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow ${
              isFullscreen
                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
            }`}
            title="Tekan untuk beralih mode Layar Penuh"
          >
            <span>
              {isFullscreen ? "⛶ KELUAR FULLSCREEN" : "⛶ LAYAR PENUH"}
            </span>
          </button>

          <button
            onClick={toggleMute}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 transition cursor-pointer"
          >
            {isMuted ? "🔇 OFF" : "🔊 ON"}
          </button>
        </div>
      </header>

      {/* SCREEN 1: WELCOME */}
      {screen === "welcome" && (
        <main className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="max-w-4xl bg-slate-900/90 border-2 border-amber-500/30 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
              ⚔️ Tarik Tambang Sejarah Dayak Bakumpai • IFP Ready
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 tracking-tight leading-tight mb-4">
              TARIK TAMBANG
              <br />
              PANGLIMA BATUR
            </h2>

            <p className="text-sm md:text-lg text-slate-300 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
              Jawab soal sejarah Barito Utara secara serentak di layar sentuh
              IFP. Tarik tali sekuat tenaga dan raih kemenangan tim!
            </p>

            <button
              onClick={() => {
                toggleFullscreen(); // Memicu fullscreen otomatis
                setScreen("setup");
              }}
              className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xl rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition cursor-pointer border-b-4 border-amber-700"
            >
              MASUK KE PERMAINAN ➔
            </button>
          </div>
        </main>
      )}

      {/* SCREEN 2: SETUP */}
      {screen === "setup" && (
        <main className="flex-1 flex flex-col justify-center my-auto overflow-y-auto max-w-6xl mx-auto w-full">
          <div className="text-center mb-3">
            <h2 className="text-2xl md:text-3xl font-black text-amber-400">
              Pengaturan Tim Tarik Tambang
            </h2>
            <p className="text-slate-400 text-xs">
              Setiap tim menjawab 20 soal secara bergiliran antar anggota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* TIM 1 */}
            <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-2xl p-4 shadow-xl flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <label className="text-xs font-black uppercase tracking-widest text-amber-400">
                  TIM KIRI (TIM 1)
                </label>
              </div>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full bg-slate-950 border-2 border-amber-500/50 rounded-xl px-3 py-1.5 text-base font-bold text-amber-300 focus:outline-none mb-3"
              />

              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                ANGGOTA ({team1Members.length} Siswa)
              </label>
              <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-2 max-h-28 overflow-y-auto mb-2 flex flex-wrap gap-1.5 content-start">
                {team1Members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-200 text-xs font-semibold"
                  >
                    <span>
                      {idx + 1}. {m}
                    </span>
                    <button
                      onClick={() => removeMember1(idx)}
                      className="text-rose-400 hover:text-rose-300 font-black ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama siswa..."
                  value={inputMember1}
                  onChange={(e) => setInputMember1(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember1()}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
                <button
                  onClick={addMember1}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer"
                >
                  + Tambah
                </button>
              </div>
            </div>

            {/* TIM 2 */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-4 shadow-xl flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <label className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  TIM KANAN (TIM 2)
                </label>
              </div>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full bg-slate-950 border-2 border-emerald-500/50 rounded-xl px-3 py-1.5 text-base font-bold text-emerald-300 focus:outline-none mb-3"
              />

              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                ANGGOTA ({team2Members.length} Siswa)
              </label>
              <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-2 max-h-28 overflow-y-auto mb-2 flex flex-wrap gap-1.5 content-start">
                {team2Members.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-emerald-200 text-xs font-semibold"
                  >
                    <span>
                      {idx + 1}. {m}
                    </span>
                    <button
                      onClick={() => removeMember2(idx)}
                      className="text-rose-400 hover:text-rose-300 font-black ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nama siswa..."
                  value={inputMember2}
                  onChange={(e) => setInputMember2(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember2()}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
                <button
                  onClick={addMember2}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition cursor-pointer"
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startGame}
              disabled={team1Members.length === 0 || team2Members.length === 0}
              className="px-10 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-black text-base rounded-xl shadow-xl active:scale-95 transition cursor-pointer border-b-4 border-amber-700"
            >
              MULAI PERTANDINGAN 🚀
            </button>
          </div>
        </main>
      )}

      {/* SCREEN 3: GAMEPLAY */}
      {screen === "game" && (
        <main className="flex-1 flex flex-col justify-between my-0.5 max-w-7xl mx-auto w-full">
          <TugOfWarArena
            team1Name={team1Name}
            team2Name={team2Name}
            team1Score={team1Score}
            team2Score={team2Score}
            isPulling1={isPulling1}
            isPulling2={isPulling2}
          />

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* SISI KIRI (TIM 1) */}
            <div className="flex flex-col justify-between bg-slate-900/95 border-2 border-amber-500/40 rounded-2xl p-3 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-400 uppercase">
                    {team1Name}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                    Soal {t1Index + 1}/20
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Pemain:{" "}
                    <strong className="text-white underline decoration-amber-400">
                      {p1Name}
                    </strong>
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded-lg font-black text-xs border ${
                      t1Timer <= 7
                        ? "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse"
                        : "bg-slate-950 border-slate-700 text-amber-400"
                    }`}
                  >
                    ⏱️ {t1Timer}s
                  </div>
                </div>
              </div>

              {t1Finished ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-4xl mb-2">🏁</span>
                  <h3 className="text-lg font-black text-amber-400">
                    TIM 1 SELESAI!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Menunggu Tim 2 menyelesaikan seluruh soal...
                  </p>
                </div>
              ) : t1Feedback ? (
                <div className="flex-1 flex flex-col justify-between p-3 bg-slate-950/90 rounded-xl border border-slate-800 my-1.5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          t1Feedback.isCorrect
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400"
                            : "bg-rose-500/20 text-rose-300 border border-rose-400"
                        }`}
                      >
                        {t1Feedback.isCorrect
                          ? `🎉 BENAR! (+${t1Feedback.score} PTS)`
                          : t1Feedback.timeout
                            ? "⏰ WAKTU HABIS!"
                            : "❌ KURANG TEPAT (+0 PTS)"}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-amber-300 mb-1">
                      Kunci: {t1Feedback.correctAnswer}
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {t1Feedback.explanation}
                    </p>
                  </div>

                  <button
                    onClick={advanceTeam1}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl active:scale-95 transition cursor-pointer mt-1"
                  >
                    SOAL BERIKUTNYA ➔
                  </button>
                </div>
              ) : currentQ1 ? (
                <>
                  <div className="flex-1 flex items-center justify-center my-1.5 bg-slate-950/70 rounded-xl p-2.5 border border-slate-800 text-center">
                    <p className="text-xs md:text-sm font-extrabold text-slate-100 leading-snug">
                      {currentQ1.question}
                    </p>
                  </div>

                  {currentQ1.type === "multiple-choice" ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {currentQ1.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerTeam1(opt)}
                          className="flex items-center gap-2 text-left bg-slate-950 hover:bg-amber-500/20 active:scale-[0.98] border border-slate-700 hover:border-amber-400 rounded-lg p-1.5 md:p-2 transition cursor-pointer"
                        >
                          <span className="w-5 h-5 rounded bg-slate-800 text-amber-400 font-black text-[11px] flex items-center justify-center shrink-0">
                            {["A", "B", "C", "D", "E"][idx]}
                          </span>
                          <span className="text-[11px] md:text-xs font-bold text-slate-200 leading-tight">
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 h-24 md:h-28 items-center">
                      <button
                        onClick={() => handleAnswerTeam1(true)}
                        className="h-full bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 active:scale-95 rounded-xl border-2 border-emerald-400 flex flex-col items-center justify-center gap-0.5 text-white font-black text-base transition cursor-pointer"
                      >
                        <span>👍 BENAR</span>
                        <span className="text-[9px] text-emerald-200">
                          (TRUE)
                        </span>
                      </button>
                      <button
                        onClick={() => handleAnswerTeam1(false)}
                        className="h-full bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 active:scale-95 rounded-xl border-2 border-rose-400 flex flex-col items-center justify-center gap-0.5 text-white font-black text-base transition cursor-pointer"
                      >
                        <span>👎 SALAH</span>
                        <span className="text-[9px] text-rose-200">
                          (FALSE)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* SISI KANAN (TIM 2) */}
            <div className="flex flex-col justify-between bg-slate-900/95 border-2 border-emerald-500/40 rounded-2xl p-3 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-400 uppercase">
                    {team2Name}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                    Soal {t2Index + 1}/20
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Pemain:{" "}
                    <strong className="text-white underline decoration-emerald-400">
                      {p2Name}
                    </strong>
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded-lg font-black text-xs border ${
                      t2Timer <= 7
                        ? "bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse"
                        : "bg-slate-950 border-slate-700 text-emerald-400"
                    }`}
                  >
                    ⏱️ {t2Timer}s
                  </div>
                </div>
              </div>

              {t2Finished ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-4xl mb-2">🏁</span>
                  <h3 className="text-lg font-black text-emerald-400">
                    TIM 2 SELESAI!
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Menunggu Tim 1 menyelesaikan seluruh soal...
                  </p>
                </div>
              ) : t2Feedback ? (
                <div className="flex-1 flex flex-col justify-between p-3 bg-slate-950/90 rounded-xl border border-slate-800 my-1.5">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          t2Feedback.isCorrect
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400"
                            : "bg-rose-500/20 text-rose-300 border border-rose-400"
                        }`}
                      >
                        {t2Feedback.isCorrect
                          ? `🎉 BENAR! (+${t2Feedback.score} PTS)`
                          : t2Feedback.timeout
                            ? "⏰ WAKTU HABIS!"
                            : "❌ KURANG TEPAT (+0 PTS)"}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-emerald-300 mb-1">
                      Kunci: {t2Feedback.correctAnswer}
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {t2Feedback.explanation}
                    </p>
                  </div>

                  <button
                    onClick={advanceTeam2}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl active:scale-95 transition cursor-pointer mt-1"
                  >
                    SOAL BERIKUTNYA ➔
                  </button>
                </div>
              ) : currentQ2 ? (
                <>
                  <div className="flex-1 flex items-center justify-center my-1.5 bg-slate-950/70 rounded-xl p-2.5 border border-slate-800 text-center">
                    <p className="text-xs md:text-sm font-extrabold text-slate-100 leading-snug">
                      {currentQ2.question}
                    </p>
                  </div>

                  {currentQ2.type === "multiple-choice" ? (
                    <div className="grid grid-cols-1 gap-1.5">
                      {currentQ2.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerTeam2(opt)}
                          className="flex items-center gap-2 text-left bg-slate-950 hover:bg-emerald-500/20 active:scale-[0.98] border border-slate-700 hover:border-emerald-400 rounded-lg p-1.5 md:p-2 transition cursor-pointer"
                        >
                          <span className="w-5 h-5 rounded bg-slate-800 text-emerald-400 font-black text-[11px] flex items-center justify-center shrink-0">
                            {["A", "B", "C", "D", "E"][idx]}
                          </span>
                          <span className="text-[11px] md:text-xs font-bold text-slate-200 leading-tight">
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 h-24 md:h-28 items-center">
                      <button
                        onClick={() => handleAnswerTeam2(true)}
                        className="h-full bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 active:scale-95 rounded-xl border-2 border-emerald-400 flex flex-col items-center justify-center gap-0.5 text-white font-black text-base transition cursor-pointer"
                      >
                        <span>👍 BENAR</span>
                        <span className="text-[9px] text-emerald-200">
                          (TRUE)
                        </span>
                      </button>
                      <button
                        onClick={() => handleAnswerTeam2(false)}
                        className="h-full bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 active:scale-95 rounded-xl border-2 border-rose-400 flex flex-col items-center justify-center gap-0.5 text-white font-black text-base transition cursor-pointer"
                      >
                        <span>👎 SALAH</span>
                        <span className="text-[9px] text-rose-200">
                          (FALSE)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </main>
      )}

      {/* SCREEN 4: FINAL RESULT */}
      {screen === "final" && (
        <main className="flex-1 flex flex-col items-center justify-center my-auto text-center max-w-4xl mx-auto w-full">
          <div className="w-full bg-slate-900/95 border-2 border-amber-500/50 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            <TugOfWarArena
              team1Name={team1Name}
              team2Name={team2Name}
              team1Score={team1Score}
              team2Score={team2Score}
              isPulling1={team1Score >= team2Score}
              isPulling2={team2Score >= team1Score}
            />

            <div className="text-4xl mb-1 mt-2">🏆</div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-400 mb-1">
              PERTANDINGAN TARIK TAMBANG SELESAI!
            </h2>
            <p className="text-slate-400 text-xs mb-4">
              Hasil Akhir Penguasaan Materi Sejarah Panglima Batur
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-4">
              <div
                className={`p-3 rounded-2xl border-2 ${
                  team1Score > team2Score
                    ? "bg-amber-500/20 border-amber-400 shadow-lg scale-105"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="text-xs font-black text-amber-400 uppercase tracking-widest">
                  {team1Name}
                </div>
                <div className="text-3xl font-black text-white">
                  {team1Score}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  TOTAL POIN
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl border-2 ${
                  team2Score > team1Score
                    ? "bg-emerald-500/20 border-emerald-400 shadow-lg scale-105"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  {team2Name}
                </div>
                <div className="text-3xl font-black text-white">
                  {team2Score}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  TOTAL POIN
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl mb-4">
              {team1Score === team2Score ? (
                <div className="text-base font-black text-amber-300">
                  🤝 HASIL SERI / SAMA KUAT!
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Kedua tim sama-sama menguasai sejarah Barito Utara dengan
                    sangat tangguh!
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    JUARA TARIK TAMBANG
                  </div>
                  <div className="text-2xl font-black text-amber-400">
                    👑 {team1Score > team2Score ? team1Name : team2Name}
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Selamat! Terus teladani keberanian, integritas, dan semangat
                    juang Panglima Batur!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setScreen("setup")}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-xl shadow-xl active:scale-95 transition cursor-pointer border-b-4 border-amber-700"
            >
              🔄 MAIN LAGI
            </button>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="text-center text-[10px] text-slate-500 py-0.5">
        Game Pembelajaran Tarik Tambang Interaktif • Materi Sejarah Panglima
        Batur Barito Utara • Dioptimalkan untuk Layar Sentuh IFP
      </footer>
    </div>
  );
}
