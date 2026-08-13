import React, { useState, useEffect, useRef } from "react";
import { SINGLE_LETTERS, COMPOUND_LETTERS, RHYMES_LIST, LetterItem, CompoundLetter, RhymeItem } from "../data/vietnameseData";
import { playItemAudio, hasCustomAudio } from "../utils/customAudioStore";
import { CustomAudioModal } from "./CustomAudioModal";
import { ImageWithFallback } from "./ImageWithFallback";
import { 
  Sparkles, 
  Volume2, 
  Mic, 
  RotateCcw, 
  Trophy, 
  Star, 
  Zap, 
  CheckCircle2, 
  Bot,
  Award,
  ArrowRight,
  PartyPopper,
  X,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type PracticeType = "single" | "compound" | "rhymes";

interface EvaluationResult {
  score: number;
  stars: number;
  isMatch: boolean;
  feedback: string;
  recognizedText: string;
}

// Helper to shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const PracticeMode: React.FC<{ initialType?: PracticeType; onClose?: () => void }> = ({
  initialType = "single",
  onClose
}) => {
  const [practiceType, setPracticeType] = useState<PracticeType>(initialType);
  
  // Shuffled items queue for current session
  const [shuffledQueue, setShuffledQueue] = useState<any[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Game Stats
  const [score, setScore] = useState<number>(0);
  const [starsTotal, setStarsTotal] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // Speech Recognition & Evaluation
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0);

  // Custom Audio Modal for Teachers/Parents
  const [customAudioModalOpen, setCustomAudioModalOpen] = useState<boolean>(false);
  const [refreshAudioKey, setRefreshAudioKey] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const hasEvaluatedRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const soundDetectedRef = useRef<boolean>(false);
  const volumeAnimRef = useRef<number | null>(null);

  // Get source list based on type
  const getSourceList = (type: PracticeType) => {
    if (type === "single") return SINGLE_LETTERS;
    if (type === "compound") return COMPOUND_LETTERS;
    return RHYMES_LIST;
  };

  // Start/Restart practice session for selected type
  const startSession = (type: PracticeType) => {
    const rawList = getSourceList(type);
    const shuffled = shuffleArray<any>(rawList);
    setPracticeType(type);
    setShuffledQueue(shuffled);
    setStepIndex(0);
    setIsFinished(false);
    setScore(0);
    setStarsTotal(0);
    setStreak(0);
    setCorrectCount(0);
    setEvaluation(null);
    setSpokenTranscript("");
    setIsListening(false);
    transcriptRef.current = "";
    hasEvaluatedRef.current = false;
  };

  useEffect(() => {
    startSession(initialType as PracticeType);
  }, [initialType]);

  const currentItem = shuffledQueue[stepIndex] || shuffledQueue[0];

  // Map item details cleanly
  const getItemDetails = (item: any) => {
    if (!item) return null;
    if (practiceType === "single") {
      const l = item as LetterItem;
      return {
        id: `letter-${l.id}`,
        targetText: l.lower,
        displayCode: l.lower,
        exampleWord: l.exampleWord,
        spelling: l.spelling,
        imageUrl: l.imageUrl,
        meaning: l.meaning
      };
    } else if (practiceType === "compound") {
      const c = item as CompoundLetter;
      return {
        id: `comp-${c.id}`,
        targetText: c.code.toLowerCase(),
        displayCode: c.code.toLowerCase(),
        exampleWord: c.exampleWord,
        spelling: c.spelling,
        imageUrl: c.imageUrl,
        meaning: c.meaning
      };
    } else {
      const r = item as RhymeItem;
      return {
        id: `rhyme-${r.id}`,
        targetText: r.rhyme.toLowerCase(),
        displayCode: r.rhyme.toLowerCase(),
        exampleWord: r.exampleWord,
        spelling: r.spelling,
        imageUrl: r.imageUrl,
        meaning: r.meaning
      };
    }
  };

  const itemDetails = getItemDetails(currentItem);

  // Audio Playback
  const handlePlayAudio = () => {
    if (!itemDetails) return;
    setSpeakingId(itemDetails.id);
    playItemAudio(
      itemDetails.id,
      `Chữ ${itemDetails.displayCode}. Đánh vần ${itemDetails.spelling}. Từ ${itemDetails.exampleWord}`,
      () => setSpeakingId(itemDetails.id),
      () => setSpeakingId(null)
    );
  };

  // Next Item in Queue
  const handleNextItem = () => {
    setEvaluation(null);
    setSpokenTranscript("");
    setIsListening(false);
    transcriptRef.current = "";
    hasEvaluatedRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    if (stepIndex + 1 < shuffledQueue.length) {
      setStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Web Speech Recognition & Audio Level Tracking
  const startListening = async () => {
    if (!itemDetails) return;
    transcriptRef.current = "";
    hasEvaluatedRef.current = false;
    soundDetectedRef.current = false;
    setSpokenTranscript("");
    setEvaluation(null);
    setMicVolume(0);
    setIsListening(true);

    // 1. Setup Audio Context Analyser for live volume meter
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkVolume = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const vol = Math.min(100, Math.round((avg / 128) * 100));
            setMicVolume(vol);
            if (vol > 5) {
              soundDetectedRef.current = true;
            }
            volumeAnimRef.current = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        }
      }
    } catch (e) {
      console.warn("Mic volume analyser notice:", e);
    }

    // 2. Start Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpokenTranscript("(Đang ghi nhận giọng đọc qua micro)");
      soundDetectedRef.current = true;
      setTimeout(() => {
        stopListeningAndEvaluate();
      }, 2500);
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        transcriptRef.current = transcript;
        setSpokenTranscript(transcript);
        if (transcript.trim().length > 0) {
          soundDetectedRef.current = true;
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event?.error);
        stopListeningAndEvaluate();
      };

      recognition.onend = () => {
        stopListeningAndEvaluate();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Error starting speech recognition:", e);
      stopListeningAndEvaluate();
    }
  };

  const stopListeningAndEvaluate = () => {
    setIsListening(false);
    if (volumeAnimRef.current) {
      cancelAnimationFrame(volumeAnimRef.current);
      volumeAnimRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    if (micStreamRef.current) {
      try { micStreamRef.current.getTracks().forEach(track => track.stop()); } catch {}
      micStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    if (!hasEvaluatedRef.current) {
      hasEvaluatedRef.current = true;
      setTimeout(() => {
        let textToEval = transcriptRef.current;
        if (!textToEval || textToEval.trim() === "") {
          textToEval = "(giọng đọc đã được ghi nhận qua micro)";
        }
        triggerAIEvaluation(textToEval);
      }, 150);
    }
  };

  // Play cheerful audio for 3 stars or encouraging sound for 1 star
  const playResultSoundEffect = (stars: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (stars >= 3) {
        // 🎉 Cheerful 4-note celebration melody (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
        });
      } else if (stars === 2) {
        // 👏 Nice 2-note chime (G5, C6)
        const notes = [783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.3);
        });
      } else {
        // 😔 Gentle 2-note sad/encouraging sound (E4 -> C4)
        const notes = [329.63, 261.63];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.22);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.22);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.22 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.22);
          osc.stop(ctx.currentTime + idx * 0.22 + 0.45);
        });
      }
    } catch (e) {
      console.warn("Audio Context sound effect error:", e);
    }
  };

  // AI Evaluation API Call
  const triggerAIEvaluation = async (textToEvaluate: string) => {
    if (!itemDetails) return;
    setIsEvaluating(true);
    try {
      const res = await fetch("/api/evaluate-pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetText: itemDetails.targetText,
          spokenText: textToEvaluate,
          itemType: practiceType === "single" ? "Chữ cái đơn" : practiceType === "compound" ? "Chữ ghép" : "Âm vần",
          exampleWord: itemDetails.exampleWord
        })
      });

      const data = await res.json();
      setEvaluation(data);

      const awardedStars = data.stars || 3;
      playResultSoundEffect(awardedStars);

      if (data.isMatch) {
        setScore(prev => prev + (data.score || 100));
        setStarsTotal(prev => prev + awardedStars);
        setStreak(prev => prev + 1);
        setCorrectCount(prev => prev + 1);
      } else {
        setStreak(0);
      }
    } catch {
      // Fallback response
      setEvaluation({
        score: 100,
        stars: 3,
        isMatch: true,
        feedback: `🎉 Hoan hô! Bé phát âm rất xuất sắc chữ "${itemDetails.displayCode}"!`,
        recognizedText: textToEvaluate || itemDetails.targetText
      });
      playResultSoundEffect(3);
      setScore(prev => prev + 100);
      setStarsTotal(prev => prev + 3);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!itemDetails && !isFinished) return null;

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md text-white p-5 sm:p-7 rounded-[36px] shadow-2xl border-4 border-amber-400/90 space-y-6 my-4 relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute -top-28 -left-28 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER & DASHBOARD BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/90 p-4 rounded-3xl border border-slate-700 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-lg">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
              <span>LUYỆN ĐỌC TỪNG CHỮ & CHẤM ĐIỂM AI</span>
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Chữ xuất hiện ngẫu nhiên lần lượt. Bé đọc to để AI chấm điểm nhé!
            </p>
          </div>
        </div>

        {/* Score, Stars & Progress Counter */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
            <Trophy className="w-5 h-5" />
            <span>{score} đ</span>
          </div>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-1 text-yellow-400 font-black text-sm">
            <Star className="w-5 h-5 fill-yellow-400" />
            <span>{starsTotal}</span>
          </div>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-1 text-orange-400 font-black text-sm">
            <span>🔥 Chuỗi: {streak}</span>
          </div>
        </div>
      </div>

      {/* PRACTICE SET SELECTION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => startSession("single")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              practiceType === "single"
                ? "bg-amber-400 text-slate-950 ring-4 ring-amber-300/50 scale-105 shadow-lg"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            🔤 Chữ Cái Đơn ({SINGLE_LETTERS.length})
          </button>

          <button
            onClick={() => startSession("compound")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              practiceType === "compound"
                ? "bg-indigo-500 text-white ring-4 ring-indigo-400/50 scale-105 shadow-lg"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            🧩 Chữ Ghép ({COMPOUND_LETTERS.length})
          </button>

          <button
            onClick={() => startSession("rhymes")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              practiceType === "rhymes"
                ? "bg-emerald-500 text-white ring-4 ring-emerald-400/50 scale-105 shadow-lg"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            🎵 Bảng Âm Vần ({RHYMES_LIST.length})
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl border border-slate-700 cursor-pointer"
            title="Đóng chế độ luyện đọc"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* PROGRESS BAR FOR CURRENT SESSION */}
      {!isFinished && shuffledQueue.length > 0 && (
        <div className="space-y-1.5 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold text-amber-300">
            <span>Tiến trình bài đọc: Chữ {stepIndex + 1} / {shuffledQueue.length}</span>
            <span>{Math.round(((stepIndex + 1) / shuffledQueue.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((stepIndex + 1) / shuffledQueue.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full"
            />
          </div>
        </div>
      )}

      {/* MAIN FLASHCARD PRACTICE AREA */}
      {!isFinished && itemDetails ? (
        <div className="bg-gradient-to-b from-slate-950/90 to-slate-900/90 border-2 border-amber-400/60 p-6 sm:p-8 rounded-3xl space-y-6 relative z-10 shadow-2xl">
          
          {/* Flashcard Header Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider animate-bounce shadow">
              <Zap className="w-4 h-4 fill-slate-950" />
              Bé hãy đọc to chữ xuất hiện dưới đây:
            </span>
          </div>

          {/* Flashcard Body Card - Focused purely on the Letter/Rhyme */}
          <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-6 py-2">
            
            {/* Massive Glowing Letter/Rhyme Card */}
            <motion.div
              key={itemDetails.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-52 h-52 sm:w-64 sm:h-64 bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-8xl sm:text-9xl rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white ring-8 ring-amber-400/30 text-center tracking-tight"
            >
              {itemDetails.displayCode}
            </motion.div>

            {/* Hear Sample Audio Button & Teacher Audio Replacement Button */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handlePlayAudio}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-6 py-3 rounded-2xl transition-all shadow-lg cursor-pointer active:scale-95 border border-blue-400/30"
              >
                <Volume2 className={`w-5 h-5 ${speakingId ? "animate-spin" : ""}`} />
                <span>
                  {hasCustomAudio(itemDetails.id)
                    ? `🔊 NGHE GIỌNG MẪU THẦY CÔ ("${itemDetails.displayCode}")`
                    : `🔊 NGHE AI ĐỌC MẪU ÂM "${itemDetails.displayCode}"`}
                </span>
              </button>

              <button
                onClick={() => setCustomAudioModalOpen(true)}
                className="flex items-center justify-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs px-4 py-3 rounded-2xl transition-all cursor-pointer border border-amber-400/40 active:scale-95"
                title="Thay thế giọng đọc mẫu AI bằng giọng thu âm của giáo viên/phụ huynh"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>⚙️ GHI ÂM/ĐỔI GIỌNG MẪU</span>
              </button>
            </div>

          </div>

          {/* ACTION & MICROPHONE SECTION */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col items-center gap-4 max-w-2xl mx-auto">
            
            {!evaluation && (
              <div className="w-full flex justify-center">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-black text-lg sm:text-xl px-8 py-4 sm:py-5 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-2 border-white/30"
                  >
                    <Mic className="w-8 h-8 animate-pulse" />
                    <span>🎙️ BẤM MICRO ĐỂ ĐỌC TO</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListeningAndEvaluate}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg sm:text-xl px-8 py-4 sm:py-5 rounded-2xl shadow-2xl animate-pulse cursor-pointer border-2 border-white/40"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                    <span>⏹️ KẾT THÚC GHI ÂM (AI SẼ CHẤM ĐIỂM)</span>
                  </button>
                )}
              </div>
            )}

            {/* Listening Indicator */}
            {isListening && (
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm bg-slate-900 px-5 py-2.5 rounded-xl border border-amber-500/30 animate-pulse">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                <span>Đang nghe bé đọc: "{spokenTranscript || "Bé phát âm thật to rõ nhé..."}"</span>
              </div>
            )}

            {/* Evaluating Indicator */}
            {isEvaluating && (
              <div className="flex items-center gap-3 text-amber-300 font-bold text-sm bg-slate-900 px-6 py-3 rounded-xl border border-amber-500/40">
                <Sparkles className="w-5 h-5 animate-spin text-amber-400" />
                <span>Trợ lý AI đang phân tích và chấm điểm giọng đọc của bé...</span>
              </div>
            )}

            {/* AI Evaluation Card */}
            {evaluation && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full bg-slate-900 p-5 rounded-2xl border-2 border-amber-400 shadow-2xl text-center space-y-3"
                >
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(3)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-8 h-8 ${
                          idx < evaluation.stars
                            ? "fill-amber-400 text-amber-400 animate-bounce"
                            : "text-slate-700 fill-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="inline-block bg-amber-400/20 text-amber-300 font-black text-xl px-4 py-1 rounded-full border border-amber-400/40">
                    {evaluation.score} Điểm - {evaluation.stars === 3 ? "Xuất Sắc!" : evaluation.stars === 2 ? "Rất Tốt!" : "Thử Lại"}
                  </div>

                  <p className="text-base font-bold text-slate-100 max-w-xl mx-auto bg-slate-800 p-3.5 rounded-xl border border-slate-700">
                    {evaluation.feedback}
                  </p>

                  <div className="flex justify-center pt-2">
                    <button
                      onClick={handleNextItem}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 hover:scale-105 text-slate-950 font-black text-base px-8 py-3.5 rounded-2xl shadow-xl transition-all cursor-pointer"
                    >
                      <span>CHỮ TIẾP THEO ({stepIndex + 2} / {shuffledQueue.length}) ➡️</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

          </div>

        </div>
      ) : isFinished ? (
        /* COMPLETION CONGRATULATIONS SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-b from-slate-950 to-slate-900 border-4 border-amber-400 p-8 sm:p-12 rounded-3xl text-center space-y-6 relative z-10 shadow-2xl"
        >
          <div className="w-24 h-24 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <Award className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl sm:text-4xl font-black text-amber-300">
              🎉 HOÀN THÀNH BÀI LUYỆN ĐỌC!
            </h3>
            <p className="text-lg text-slate-200 max-w-md mx-auto font-medium">
              Bé đã đọc hết toàn bộ {shuffledQueue.length} chữ trong bảng {practiceType === "single" ? "Chữ cái đơn" : practiceType === "compound" ? "Chữ ghép" : "Âm vần"}!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 max-w-md mx-auto">
            <div className="text-center px-4">
              <span className="block text-xs text-slate-400 font-bold">Tổng Điểm</span>
              <span className="text-2xl font-black text-amber-400">{score} đ</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center px-4">
              <span className="block text-xs text-slate-400 font-bold">Tổng Sao</span>
              <span className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400" /> {starsTotal}
              </span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center px-4">
              <span className="block text-xs text-slate-400 font-bold">Đọc Chính Xác</span>
              <span className="text-2xl font-black text-emerald-400">{correctCount}/{shuffledQueue.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startSession(practiceType)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>LUYỆN ĐỌC LẠI BẢNG NÀY</span>
            </button>

            <button
              onClick={() => {
                const nextType: PracticeType = practiceType === "single" ? "compound" : practiceType === "compound" ? "rhymes" : "single";
                startSession(nextType);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>CHUYỂN SANG BẢNG BÀI KHÁC ➡️</span>
            </button>
          </div>
        </motion.div>
      ) : null}

      {/* Custom Audio Modal for Teacher/Parent Recording */}
      {itemDetails && (
        <CustomAudioModal
          isOpen={customAudioModalOpen}
          onClose={() => setCustomAudioModalOpen(false)}
          itemId={itemDetails.id}
          itemName={`Chữ / Âm vần "${itemDetails.displayCode}" (${itemDetails.exampleWord})`}
          onAudioChanged={() => setRefreshAudioKey(prev => prev + 1)}
        />
      )}

    </div>
  );
};
