import React, { useState, useEffect, useRef } from "react";
import { SINGLE_LETTERS, COMPOUND_LETTERS, RHYMES_LIST } from "../data/vietnameseData";
import { playItemAudio, hasCustomAudio } from "../utils/customAudioStore";
import { CustomAudioModal } from "./CustomAudioModal";
import { EditQuestionModal } from "./EditQuestionModal";
import { getCustomQuestion, hasCustomQuestion } from "../utils/customQuestionStore";
import { ImageWithFallback } from "./ImageWithFallback";
import { 
  Trophy, 
  RotateCcw, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Gamepad2,
  Apple,
  Heart,
  Grid,
  Layers,
  Music,
  Flame,
  Zap,
  Gift,
  Sparkles,
  Mic,
  Star,
  Puzzle,
  Bot,
  Square,
  Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { TeacherInfo } from "./NavigationMenu";

export type CategoryType = "alphabet" | "compound" | "rhymes";
export type MiniGameType = "mystery" | "bubbles" | "apples" | "fillin" | "recording";

interface GameViewProps {
  teacher?: TeacherInfo | null;
}

interface GameQuestion {
  id: number;
  gameType: MiniGameType;
  promptTitle: string;
  targetCode: string; // Always lower case
  audioText: string;
  imageUrl?: string;
  exampleWord?: string;
  options: string[]; // Options formatted appropriately (lowercase)
  correctAnswer: string;
  blankWordDisplay?: string; // For fillin mode, e.g. "c _" or "_ á"
  missingPart?: string;
}

// Utility to shuffle an array
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Web Audio API Synthesizer Sound Effects
const playGameSound = (type: "correct" | "wrong" | "pop" | "victory" | "fanfare") => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === "correct" || type === "fanfare") {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.25);
      });
    } else if (type === "wrong") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "victory") {
      const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      fanfare.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
      });
    }
  } catch (e) {
    console.warn("Audio Context error:", e);
  }
};

// Generate 30 questions for selected category mixing 5 diverse mini-game styles
function generate30Questions(category: CategoryType): GameQuestion[] {
  const list: GameQuestion[] = [];
  const miniGames: MiniGameType[] = ["mystery", "bubbles", "apples", "fillin", "recording"];

  if (category === "alphabet") {
    const items = SINGLE_LETTERS;
    for (let i = 0; i < 30; i++) {
      const qKey = `game-alphabet-q-${i + 1}`;
      const custom = getCustomQuestion(qKey);

      const target = items[i % items.length];
      const gameType = miniGames[i % 5];
      const targetLower = target.lower; // ALWAYS USE LOWERCASE ONLY

      const wrongPool = items.filter(x => x.lower !== targetLower);
      const wrongShuffled = shuffleArray(wrongPool).slice(0, 3).map(x => x.lower);
      const defaultCorrect = targetLower;
      const defaultOptions = shuffleArray([defaultCorrect, ...wrongShuffled]);

      let title = "";
      let blankDisplay = "";

      const exWord = custom?.exampleWord || target.exampleWord;

      if (gameType === "mystery") {
        title = `🕵️‍♀️ Ô Chữ Bí Ẩn: Nghe âm mẫu và đoán xem chữ cái thường nào đang giấu đằng sau ô quà?`;
      } else if (gameType === "bubbles") {
        title = `🎈 Bắn Bóng Âm Thanh: Nghe phát âm và bấm nổ quả bóng chứa chữ cái thường đúng!`;
      } else if (gameType === "apples") {
        title = `🍎 Hái Quả Táo Thần Kỳ: Từ "${exWord}" chứa chữ cái thường nào trong các quả táo?`;
      } else if (gameType === "fillin") {
        title = `🧩 Ghép Chữ Điền Từ: Chọn chữ cái còn thiếu để hoàn thiện từ dưới đây!`;
        const word = exWord || targetLower;
        if (word.length > 1) {
          blankDisplay = word.replace(targetLower, " _ ");
          if (blankDisplay === word) {
            blankDisplay = word.slice(0, 1) + " _ " + word.slice(2);
          }
        } else {
          blankDisplay = " _ ";
        }
      } else {
        // recording
        title = `🎙️ Thử Thách Ghi Âm Đọc Chữ: Bấm nút Micro, phát âm thật rõ ràng chữ cái "${targetLower}"!`;
      }

      list.push({
        id: i + 1,
        gameType,
        promptTitle: custom?.promptTitle || title,
        targetCode: targetLower,
        audioText: custom?.audioText || `Chữ ${targetLower}`,
        imageUrl: custom?.imageUrl ?? target.imageUrl,
        exampleWord: exWord,
        options: custom?.options && custom.options.length > 0 ? custom.options : defaultOptions,
        correctAnswer: custom?.correctAnswer || defaultCorrect,
        blankWordDisplay: custom?.blankWordDisplay || blankDisplay,
        missingPart: targetLower
      });
    }
  } else if (category === "compound") {
    const items = COMPOUND_LETTERS;
    for (let i = 0; i < 30; i++) {
      const qKey = `game-compound-q-${i + 1}`;
      const custom = getCustomQuestion(qKey);

      const target = items[i % items.length];
      const gameType = miniGames[i % 5];
      const targetCode = target.code; // Lowercase compound like "ch", "gh", "nh"

      const wrongPool = items.filter(x => x.code !== targetCode);
      const wrongShuffled = shuffleArray(wrongPool).slice(0, 3).map(x => x.code);
      const defaultCorrect = targetCode;
      const defaultOptions = shuffleArray([defaultCorrect, ...wrongShuffled]);

      let title = "";
      let blankDisplay = "";

      const exWord = custom?.exampleWord || target.exampleWord;

      if (gameType === "mystery") {
        title = `🕵️‍♀️ Mảnh Ghép Chữ Ghép Bí Ẩn: Bấm nghe âm và chọn đúng chữ ghép đang giấu!`;
      } else if (gameType === "bubbles") {
        title = `🎈 Bắn Bóng Chữ Ghép: Nghe phát âm và bấm nổ quả bóng chữ ghép đúng!`;
      } else if (gameType === "apples") {
        title = `🍎 Hái Táo Chữ Ghép: Từ "${exWord}" chứa chữ ghép nào dưới đây?`;
      } else if (gameType === "fillin") {
        title = `🧩 Điền Chữ Ghép Còn Thiếu: Chọn chữ ghép để hoàn chỉnh từ dưới đây!`;
        const word = exWord || targetCode;
        blankDisplay = word.replace(targetCode, " ___ ");
        if (blankDisplay === word) {
          blankDisplay = " ___ " + word;
        }
      } else {
        // recording
        title = `🎙️ Thử Thách Ghi Âm Luyện Đọc: Bấm Micro và phát âm thật chuẩn chữ ghép "${targetCode}"!`;
      }

      list.push({
        id: i + 1,
        gameType,
        promptTitle: custom?.promptTitle || title,
        targetCode,
        audioText: custom?.audioText || `Chữ ghép ${targetCode}`,
        imageUrl: custom?.imageUrl ?? target.imageUrl,
        exampleWord: exWord,
        options: custom?.options && custom.options.length > 0 ? custom.options : defaultOptions,
        correctAnswer: custom?.correctAnswer || defaultCorrect,
        blankWordDisplay: custom?.blankWordDisplay || blankDisplay,
        missingPart: targetCode
      });
    }
  } else {
    // Rhymes
    const items = RHYMES_LIST;
    for (let i = 0; i < 30; i++) {
      const qKey = `game-rhymes-q-${i + 1}`;
      const custom = getCustomQuestion(qKey);

      const target = items[i % items.length];
      const gameType = miniGames[i % 5];
      const targetRhyme = target.rhyme;

      const wrongPool = items.filter(x => x.rhyme !== targetRhyme);
      const wrongShuffled = shuffleArray(wrongPool).slice(0, 3).map(x => x.rhyme);
      const defaultCorrect = targetRhyme;
      const defaultOptions = shuffleArray([defaultCorrect, ...wrongShuffled]);

      let title = "";
      let blankDisplay = "";

      const exWord = custom?.exampleWord || target.exampleWord;

      if (gameType === "mystery") {
        title = `🕵️‍♀️ Ô Chữ Âm Vần Bí Ẩn: Nghe phát âm mẫu và lật ô quà tìm vần đúng!`;
      } else if (gameType === "bubbles") {
        title = `🎈 Bắn Bóng Âm Vần: Nghe âm vần mẫu và nổ đúng quả bóng mang vần!`;
      } else if (gameType === "apples") {
        title = `🍎 Hái Táo Âm Vần: Từ "${exWord}" chứa vần nào trong các quả táo?`;
      } else if (gameType === "fillin") {
        title = `🧩 Điền Vần Còn Thiếu: Chọn vần thích hợp ghép thành từ có nghĩa!`;
        const word = exWord || targetRhyme;
        blankDisplay = word.replace(targetRhyme, " ___ ");
        if (blankDisplay === word) {
          blankDisplay = word + " ___ ";
        }
      } else {
        // recording
        title = `🎙️ Thử Thách Ghi Âm Đọc Vần: Bấm Micro và phát âm thật vang vần "${targetRhyme}"!`;
      }

      list.push({
        id: i + 1,
        gameType,
        promptTitle: custom?.promptTitle || title,
        targetCode: targetRhyme,
        audioText: custom?.audioText || `Vần ${targetRhyme}`,
        imageUrl: custom?.imageUrl ?? target.imageUrl,
        exampleWord: exWord,
        options: custom?.options && custom.options.length > 0 ? custom.options : defaultOptions,
        correctAnswer: custom?.correctAnswer || defaultCorrect,
        blankWordDisplay: custom?.blankWordDisplay || blankDisplay,
        missingPart: targetRhyme
      });
    }
  }

  return shuffleArray(list);
}

export const GameView: React.FC<GameViewProps> = ({ teacher }) => {
  const isTeacher = !!teacher || !!localStorage.getItem("vuihoc_teacher");
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Gameplay State
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Scratch / Reveal state for mystery card
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Answer state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Speech Recording State in Game
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSuccess, setRecordingSuccess] = useState<boolean>(false);
  const [recordedFeedback, setRecordedFeedback] = useState<string>("");
  const [recordingAttempts, setRecordingAttempts] = useState<number>(0);
  const MAX_RECORDING_ATTEMPTS = 5;
  const recognitionRef = useRef<any>(null);

  // Custom Audio Modal State (Thay giọng đọc mẫu câu hỏi)
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);
  const [customAudioItemId, setCustomAudioItemId] = useState<string>("");
  const [customAudioItemName, setCustomAudioItemName] = useState<string>("");

  // Edit Question Modal State (Sửa câu hỏi & hình ảnh)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const getQuestionKey = (q: GameQuestion): string => {
    return `game-${category || "alphabet"}-q-${q.id}`;
  };

  const getQuestionAudioItemId = (q: GameQuestion): string => {
    if (hasCustomAudio(`game-q-${q.id}`)) {
      return `game-q-${q.id}`;
    }
    if (hasCustomAudio(`letter-${q.targetCode}`)) {
      return `letter-${q.targetCode}`;
    }
    if (hasCustomAudio(`comp-${q.targetCode}`)) {
      return `comp-${q.targetCode}`;
    }
    if (hasCustomAudio(`rhyme-${q.targetCode}`)) {
      return `rhyme-${q.targetCode}`;
    }
    return `game-q-${q.id}`;
  };

  // Start Category Game
  const startCategoryGame = (cat: CategoryType) => {
    const qList = generate30Questions(cat);
    setCategory(cat);
    setQuestions(qList);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setCorrectCount(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsRevealed(false);
    setIsRecording(false);
    setRecordingSuccess(false);
    setRecordedFeedback("");
    setRecordingAttempts(0);

    if (qList.length > 0) {
      setTimeout(() => {
        const audioKey = getQuestionAudioItemId(qList[0]);
        playItemAudio(audioKey, qList[0].audioText);
      }, 300);
    }
  };

  const currentQ = questions[currentIndex];

  const handlePlayPromptAudio = () => {
    if (!currentQ) return;
    playGameSound("pop");
    const audioKey = getQuestionAudioItemId(currentQ);
    playItemAudio(audioKey, currentQ.audioText);
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
    setIsRevealed(true);

    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      playGameSound("correct");
      setScore(prev => prev + 10 + streak * 2);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      playGameSound("wrong");
      setStreak(0);
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  const recordingTimerRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>("");
  const hasEvaluatedRecordingRef = useRef<boolean>(false);

  // Handle Voice Recording for "recording" game type
  const handleStartRecording = () => {
    if (isAnswered) return;
    if (isRecording) {
      handleStopRecording();
      return;
    }

    setIsRecording(true);
    setRecordedFeedback("🎙️ Đang lắng nghe giọng bé đọc...");
    playGameSound("pop");

    lastTranscriptRef.current = "";
    hasEvaluatedRecordingRef.current = false;

    // Check for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "vi-VN";
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          lastTranscriptRef.current = transcript;
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event?.error);
          setIsRecording(false);
          if (!hasEvaluatedRecordingRef.current) {
            hasEvaluatedRecordingRef.current = true;
            evalVoiceRecording(lastTranscriptRef.current);
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (!hasEvaluatedRecordingRef.current) {
            hasEvaluatedRecordingRef.current = true;
            evalVoiceRecording(lastTranscriptRef.current);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.warn("Speech recognition failed to start:", e);
      }
    }

    // Fallback timer simulation if speech recognition is unsupported in browser
    if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
    recordingTimerRef.current = setTimeout(() => {
      setIsRecording(false);
      if (!hasEvaluatedRecordingRef.current) {
        hasEvaluatedRecordingRef.current = true;
        evalVoiceRecording(lastTranscriptRef.current);
      }
    }, 5000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Error stopping recognition:", e);
      }
    }
    if (!hasEvaluatedRecordingRef.current) {
      hasEvaluatedRecordingRef.current = true;
      setTimeout(() => {
        evalVoiceRecording(lastTranscriptRef.current);
      }, 200);
    }
  };

  const evalVoiceRecording = async (spokenText: string) => {
    const cleanSpoken = spokenText ? spokenText.trim() : "";
    const newAttempts = recordingAttempts + 1;
    setRecordingAttempts(newAttempts);

    if (!cleanSpoken) {
      if (newAttempts < MAX_RECORDING_ATTEMPTS) {
        setIsAnswered(false);
        setIsCorrect(false);
        setRecordingSuccess(false);
        setRecordedFeedback(`⚠️ AI chưa nghe thấy giọng bé đọc (Lần ${newAttempts}/${MAX_RECORDING_ATTEMPTS}). Bé hãy bấm nút ghi âm màu đỏ và đọc thật to chữ/vần "${currentQ.targetCode}" nhé!`);
        playGameSound("wrong");
      } else {
        setIsAnswered(true);
        setIsRevealed(true);
        setSelectedOption(currentQ.correctAnswer);
        setIsCorrect(false);
        setRecordingSuccess(false);
        setRecordedFeedback(`⚠️ AI chưa nghe thấy giọng bé đọc sau ${MAX_RECORDING_ATTEMPTS} lần thử. Đừng buồn, hãy thử lại ở câu tiếp theo nhé!`);
        playGameSound("wrong");
        setStreak(0);
        setLives(prev => Math.max(0, prev - 1));
      }
      return;
    }

    setRecordedFeedback("🤖 AI đang phân tích và chấm điểm giọng đọc của bé...");

    let isMatch = false;
    let feedbackStr = "";
    let scoreEarned = 15;

    try {
      const res = await fetch("/api/evaluate-pronunciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetText: currentQ.targetCode,
          spokenText: cleanSpoken,
          itemType: "Màn chơi Game",
          exampleWord: currentQ.exampleWord
        })
      });

      const data = await res.json();
      isMatch = !!data.isMatch;
      feedbackStr = data.feedback || "";
      scoreEarned = data.score || 15;
    } catch (e) {
      const target = currentQ.targetCode.toLowerCase();
      const spoken = cleanSpoken.toLowerCase();
      isMatch = spoken.includes(target) || target.includes(spoken);
    }

    if (isMatch) {
      setIsAnswered(true);
      setIsRevealed(true);
      setSelectedOption(currentQ.correctAnswer);
      setIsCorrect(true);
      setRecordingSuccess(true);
      setRecordedFeedback(
        feedbackStr || `🌟 Xuất sắc! AI nhận diện bé đọc rất chuẩn âm "${currentQ.targetCode}" (Thành công ở lần thử ${newAttempts}/${MAX_RECORDING_ATTEMPTS})!`
      );
      playGameSound("fanfare");
      setScore(prev => prev + scoreEarned + streak * 3);
      setStreak(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
    } else {
      if (newAttempts < MAX_RECORDING_ATTEMPTS) {
        setIsAnswered(false);
        setIsCorrect(false);
        setRecordingSuccess(false);
        setRecordedFeedback(
          `${feedbackStr || `❌ AI nghe thấy bé đọc là: "${cleanSpoken}". Chưa đúng âm "${currentQ.targetCode}".`} 👉 Bé còn ${MAX_RECORDING_ATTEMPTS - newAttempts} lần thử (Lần ${newAttempts}/${MAX_RECORDING_ATTEMPTS}). Hãy bấm đọc lại thật to nhé!`
        );
        playGameSound("wrong");
      } else {
        setIsAnswered(true);
        setIsRevealed(true);
        setSelectedOption(currentQ.correctAnswer);
        setIsCorrect(false);
        setRecordingSuccess(false);
        setRecordedFeedback(
          `${feedbackStr || `❌ AI nghe thấy bé đọc là: "${cleanSpoken}". Chưa đúng âm "${currentQ.targetCode}".`} (Bé đã thử đủ ${MAX_RECORDING_ATTEMPTS} lần. Cố gắng ở câu tiếp theo nhé!)`
        );
        playGameSound("wrong");
        setStreak(0);
        setLives(prev => Math.max(0, prev - 1));
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsRevealed(false);
    setIsRecording(false);
    setRecordingSuccess(false);
    setRecordedFeedback("");
    setRecordingAttempts(0);

    if (lives <= 0 || currentIndex + 1 >= 30) {
      setIsFinished(true);
      playGameSound("victory");
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => {
        const nextQ = questions[nextIdx];
        const audioKey = getQuestionAudioItemId(nextQ);
        playItemAudio(audioKey, nextQ.audioText);
      }, 200);
    }
  };

  // Color bubbles list for bubble mode
  const bubbleColors = [
    "from-pink-400 to-rose-500 border-pink-200 text-white shadow-pink-300",
    "from-amber-400 to-orange-500 border-amber-200 text-slate-950 shadow-amber-300",
    "from-emerald-400 to-teal-500 border-emerald-200 text-white shadow-emerald-300",
    "from-indigo-400 to-purple-600 border-indigo-200 text-white shadow-indigo-300"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* 1. SELECTION MENU WITH 3 MAIN CATEGORIES */}
      {!category ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-2xl space-y-8 text-center">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-2 rounded-full uppercase tracking-wider shadow animate-bounce">
              <Gamepad2 className="w-5 h-5 fill-slate-950" />
              SÂN CHƠI GAME TIẾNG VIỆT LỚP 1 (DÙNG CHỮ THƯỜNG & LUYỆN ĐỌC GHI ÂM)
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800">
              🎮 CHỌN CHỦ ĐỀ TRÒ CHƠI TIẾNG VIỆT
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Mỗi chủ đề gồm <span className="text-amber-600 font-black">30 câu hỏi biến tấu hấp dẫn</span> kết hợp 5 dạng trò chơi: <span className="font-bold text-amber-600">Ô Chữ Bí Ẩn 🕵️‍♀️</span>, <span className="font-bold text-pink-600">Bắn Bóng 🎈</span>, <span className="font-bold text-emerald-600">Hái Táo 🍎</span>, <span className="font-bold text-indigo-600">Điền Từ 🧩</span> và <span className="font-bold text-rose-600">Thử Thách Ghi Âm Luyện Đọc AI 🎙️</span>!
            </p>
          </div>

          {/* 3 CATEGORY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Category 1: Game Bảng Chữ Cái (Chữ Thường) */}
            <motion.button
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startCategoryGame("alphabet")}
              className="bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 text-white p-6 rounded-3xl shadow-xl border-4 border-pink-200 flex flex-col items-center justify-between space-y-5 cursor-pointer text-center group relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/40">
                <Grid className="w-11 h-11 text-yellow-200" />
              </div>
              <div className="space-y-2">
                <span className="bg-slate-950/30 text-amber-200 text-[11px] font-black px-3 py-1 rounded-full uppercase border border-amber-200/30">
                  CHỮ THƯỜNG & LUYỆN ĐỌC
                </span>
                <h3 className="text-2xl font-black text-white">
                  🔤 Game Chữ Cái Thường
                </h3>
                <p className="text-xs text-pink-100 font-medium leading-relaxed">
                  Đố vui 29 chữ cái viết thường (a, b, c, d, đ...), điền từ & thử thách phát âm ghi âm trực tiếp.
                </p>
              </div>
              <div className="bg-white text-rose-600 font-black text-sm px-6 py-3 rounded-2xl shadow group-hover:bg-amber-300 group-hover:text-slate-950 transition-all w-full flex items-center justify-center gap-2">
                <span>VÀO CHƠI NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Category 2: Game Bảng Chữ Ghép */}
            <motion.button
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startCategoryGame("compound")}
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 rounded-3xl shadow-xl border-4 border-indigo-200 flex flex-col items-center justify-between space-y-5 cursor-pointer text-center group relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/40">
                <Layers className="w-11 h-11 text-amber-300" />
              </div>
              <div className="space-y-2">
                <span className="bg-slate-950/30 text-indigo-200 text-[11px] font-black px-3 py-1 rounded-full uppercase border border-indigo-200/30">
                  11 CHỮ GHÉP CƠ BẢN
                </span>
                <h3 className="text-2xl font-black text-white">
                  🧩 Game Bảng Chữ Ghép
                </h3>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                  Luyện tập 11 chữ ghép cơ bản (ch, gh, gi, kh, ngh, nh, ph, qu, th, tr, r) qua game điền từ & ghi âm.
                </p>
              </div>
              <div className="bg-white text-indigo-700 font-black text-sm px-6 py-3 rounded-2xl shadow group-hover:bg-amber-300 group-hover:text-slate-950 transition-all w-full flex items-center justify-center gap-2">
                <span>VÀO CHƠI NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

            {/* Category 3: Game Bảng Âm Vần */}
            <motion.button
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startCategoryGame("rhymes")}
              className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white p-6 rounded-3xl shadow-xl border-4 border-emerald-200 flex flex-col items-center justify-between space-y-5 cursor-pointer text-center group relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/40">
                <Music className="w-11 h-11 text-amber-300" />
              </div>
              <div className="space-y-2">
                <span className="bg-slate-950/30 text-emerald-200 text-[11px] font-black px-3 py-1 rounded-full uppercase border border-emerald-200/30">
                  50+ ÂM VẦN TỔNG HỢP
                </span>
                <h3 className="text-2xl font-black text-white">
                  🎵 Game Bảng Âm Vần
                </h3>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  Thử tài ghép vần tiếng Việt (an, at, am, ap, ang, ac, eo, au...) qua câu đố phong phú.
                </p>
              </div>
              <div className="bg-white text-emerald-800 font-black text-sm px-6 py-3 rounded-2xl shadow group-hover:bg-amber-300 group-hover:text-slate-950 transition-all w-full flex items-center justify-center gap-2">
                <span>VÀO CHƠI NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>

          </div>
        </div>
      ) : (
        /* 2. GAMEPLAY DISPLAY AREA */
        <div className="space-y-5">
          
          {/* Header Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCategory(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-3.5 py-2 rounded-xl border border-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <span>⬅</span>
                <span>ĐỔI GAME KHÁC</span>
              </button>
              <h2 className="text-lg sm:text-xl font-black text-slate-800">
                {category === "alphabet" ? "🔤 GAME CHỮ CÁI THƯỜNG" : category === "compound" ? "🧩 GAME BẢNG CHỮ GHÉP" : "🎵 GAME BẢNG ÂM VẦN"}
              </h2>
            </div>

            {/* Score, Streak & Lives */}
            <div className="flex items-center gap-4 bg-amber-50/80 px-4 py-2 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-1.5 font-black text-amber-600 text-sm">
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>{score} điểm</span>
              </div>
              <div className="w-px h-5 bg-amber-200" />
              <div className="flex items-center gap-1 font-black text-orange-600 text-xs">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
                <span>Chuỗi: {streak} 🔥</span>
              </div>
              <div className="w-px h-5 bg-amber-200" />
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${i < lives ? "fill-red-500 text-red-500" : "text-slate-300"}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {!isFinished && currentQ ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-6 relative overflow-hidden">
              
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-black text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Câu hỏi {currentIndex + 1} / 30</span>
                  </span>
                  <span>{Math.round(((currentIndex + 1) / 30) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                  <motion.div
                    animate={{ width: `${((currentIndex + 1) / 30) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full"
                  />
                </div>
              </div>

              {/* Game Prompt Title Banner */}
              <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 p-4 sm:p-5 rounded-2xl text-center space-y-3 shadow-inner">
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                  {currentQ.promptTitle}
                </h3>

                {/* Audio Listen & Custom Recording Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={handlePlayPromptAudio}
                    className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95 border-2 border-white/40"
                  >
                    <Volume2 className="w-5 h-5 animate-bounce text-amber-300" />
                    <span>🔊 BẤM ĐỂ NGHE ÂM MẪU</span>
                  </button>

                  {isTeacher && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          if (!currentQ) return;
                          const itemId = `game-q-${currentQ.id}`;
                          setCustomAudioItemId(itemId);
                          setCustomAudioItemName(`Câu hỏi ${currentQ.id}: ${currentQ.audioText}`);
                          setIsAudioModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm px-4 py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95 border-2 border-white/60"
                      >
                        <Mic className="w-4 h-4 text-rose-700" />
                        <span>🎙️ THAY GIỌNG MẪU</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!currentQ) return;
                          setIsEditModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm px-4 py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95 border-2 border-white/60"
                      >
                        <Edit3 className="w-4 h-4 text-amber-300" />
                        <span>✏️ SỬA CÂU HỎI & HÌNH ÁNH</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Custom Audio & Custom Question Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {currentQ && hasCustomQuestion(getQuestionKey(currentQ)) && (
                    <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-900 border border-indigo-300 text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>✨ Câu hỏi này đã được Giáo viên tùy chỉnh</span>
                    </div>
                  )}

                  {currentQ && hasCustomAudio(getQuestionAudioItemId(currentQ)) && (
                    <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Đang dùng giọng đọc mẫu tùy chỉnh</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MINI GAME VISUAL STAGE */}
              <div className="min-h-[200px] bg-slate-950/90 rounded-2xl p-6 border-2 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                
                {/* Visual Mode 1: Mystery Scratch / Gift Box Reveal Card */}
                {currentQ.gameType === "mystery" && (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <motion.div
                        animate={isRevealed ? { rotateY: 180 } : {}}
                        transition={{ duration: 0.6 }}
                        className="w-36 h-36 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center text-center cursor-pointer"
                        onClick={() => setIsRevealed(true)}
                      >
                        {!isRevealed ? (
                          <div className="flex flex-col items-center space-y-1 text-slate-950 font-black">
                            <Gift className="w-14 h-14 text-slate-950 animate-bounce" />
                            <span className="text-xs uppercase font-black tracking-wider">Ô QUÀ BÍ ẨN</span>
                          </div>
                        ) : (
                          <span className="text-7xl font-black text-slate-950 rotate-y-180">
                            {currentQ.correctAnswer}
                          </span>
                        )}
                      </motion.div>
                    </div>
                    <p className="text-xs text-amber-300 font-bold">
                      {!isRevealed ? "💡 Tấm màn bí ẩn đang che giấu chữ! Hãy nghe âm và chọn đáp án đúng để lật mở ô quà!" : "✨ Đã lật mở ô chữ bí ẩn!"}
                    </p>
                  </div>
                )}

                {/* Visual Mode 2: Sound Bubbles */}
                {currentQ.gameType === "bubbles" && (
                  <div className="flex flex-col items-center space-y-3 w-full">
                    <p className="text-xs text-slate-300 font-bold text-center">
                      🎈 Các quả bóng bay bồng bềnh mang chữ cái! Hãy bấm nổ quả bóng đúng với âm vừa nghe!
                    </p>
                    {currentQ.imageUrl && (
                      <div className="pt-1">
                        <ImageWithFallback
                          src={currentQ.imageUrl}
                          alt={currentQ.exampleWord || "Minh họa"}
                          fallbackText={currentQ.exampleWord || "Minh họa"}
                          className="w-20 h-20 object-cover rounded-2xl border-2 border-amber-400 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Mode 3: Magic Apple Tree */}
                {currentQ.gameType === "apples" && (
                  <div className="flex items-center gap-4">
                    {currentQ.imageUrl && (
                      <ImageWithFallback
                        src={currentQ.imageUrl}
                        alt={currentQ.exampleWord || "Minh họa"}
                        fallbackText={currentQ.exampleWord || "Minh họa"}
                        className="w-24 h-24 object-cover rounded-2xl border-2 border-amber-400 shadow-md"
                      />
                    )}
                    <div className="space-y-1 text-left">
                      <div className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold px-3 py-1 rounded-full">
                        <Apple className="w-4 h-4 text-red-400 fill-red-400" />
                        <span>Cây Táo Thần Kỳ</span>
                      </div>
                      <h4 className="text-2xl font-black text-amber-300">
                        {currentQ.exampleWord ? `Từ: "${currentQ.exampleWord}"` : `Hãy hái quả táo đúng!`}
                      </h4>
                    </div>
                  </div>
                )}

                {/* Visual Mode 4: Fill In The Blank Puzzle */}
                {currentQ.gameType === "fillin" && (
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold px-3 py-1 rounded-full">
                      <Puzzle className="w-4 h-4 text-indigo-400" />
                      <span>Ghép Chữ Điền Từ Còn Thiếu</span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      {currentQ.imageUrl && (
                        <ImageWithFallback
                          src={currentQ.imageUrl}
                          alt={currentQ.exampleWord || "Minh họa"}
                          fallbackText={currentQ.exampleWord || "Minh họa"}
                          className="w-20 h-20 object-cover rounded-2xl border-2 border-amber-400 shadow-md"
                        />
                      )}
                      <div className="bg-slate-900 px-6 py-4 rounded-2xl border-2 border-amber-400 shadow-inner">
                        <span className="text-4xl sm:text-5xl font-black text-amber-300 tracking-wider">
                          {isAnswered ? currentQ.exampleWord || currentQ.blankWordDisplay?.replace(" ___ ", ` ${currentQ.correctAnswer} `).replace(" _ ", ` ${currentQ.correctAnswer} `) : currentQ.blankWordDisplay}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual Mode 5: Speech Recording Game Mode 🎙️ */}
                {currentQ.gameType === "recording" && (
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold px-3.5 py-1 rounded-full">
                      <Mic className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span>THỬ THÁCH GHI ÂM TƯƠNG TÁC AI (LẦN THỬ: {recordingAttempts}/{MAX_RECORDING_ATTEMPTS})</span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 border-4 border-white shadow-xl flex items-center justify-center">
                        <span className="text-5xl font-black text-white">{currentQ.targetCode}</span>
                      </div>
                      {currentQ.imageUrl && (
                        <ImageWithFallback
                          src={currentQ.imageUrl}
                          alt={currentQ.exampleWord || "Minh họa"}
                          fallbackText={currentQ.exampleWord || "Minh họa"}
                          className="w-24 h-24 object-cover rounded-3xl border-4 border-white shadow-xl"
                        />
                      )}
                    </div>

                    {/* Microphone Record Action Button */}
                    <div className="pt-2 flex flex-col items-center gap-3">
                      {isRecording ? (
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={handleStopRecording}
                            className="px-8 py-4.5 rounded-2xl font-black text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white border-4 border-amber-300 animate-pulse hover:scale-105 active:scale-95 ring-4 ring-red-400/50"
                          >
                            <Square className="w-7 h-7 fill-white text-white shrink-0" />
                            <span>⏹️ BẤM VÀO ĐÂY ĐỂ DỪNG GHI ÂM & HOÀN THÀNH</span>
                          </button>
                          <span className="text-xs text-amber-200 font-bold bg-slate-900/90 px-3 py-1 rounded-full border border-amber-400/30">
                            🎙️ Đang lắng nghe... Sau khi phát âm xong, bé hoặc thầy cô/phụ huynh bấm nút đỏ ⏹️ phía trên nhé!
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={handleStartRecording}
                            disabled={isAnswered}
                            className={`px-8 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer border-4 ${
                              isAnswered
                                ? isCorrect
                                  ? "bg-emerald-600 text-white border-emerald-300"
                                  : "bg-slate-700 text-slate-300 border-slate-600"
                                : "bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:scale-105 text-white border-white active:scale-95"
                            }`}
                          >
                            <Mic className="w-7 h-7 text-yellow-300" />
                            <span>
                              {isAnswered
                                ? isCorrect
                                  ? "🎉 ĐÃ PHÁT ÂM CHUẨN XUẤT SẮC!"
                                  : `❌ ĐÃ HẾT ${MAX_RECORDING_ATTEMPTS} LẦN THỬ GHI ÂM`
                                : recordingAttempts === 0
                                  ? "🎙️ BẤM ĐỂ BẮT ĐẦU GHI ÂM DẠY ĐỌC (TỐI ĐA 5 LẦN THỬ)"
                                  : `🎙️ ĐỌC LẠI THỬ TÍẾP (LẦN ${recordingAttempts + 1}/${MAX_RECORDING_ATTEMPTS})`}
                            </span>
                          </button>

                          {/* Allow skipping to next question if child tried at least once and hasn't passed */}
                          {!isAnswered && recordingAttempts > 0 && (
                            <button
                              onClick={() => {
                                setIsAnswered(true);
                                setIsRevealed(true);
                                setSelectedOption(currentQ.correctAnswer);
                                setIsCorrect(false);
                                setRecordingSuccess(false);
                                setRecordedFeedback(`Bé đã chọn chuyển sang câu tiếp theo. Cố gắng ở câu tiếp nhé!`);
                                setStreak(0);
                                setLives(prev => Math.max(0, prev - 1));
                              }}
                              className="text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer pt-1"
                            >
                              ⏩ Bỏ qua câu này để sang câu tiếp
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {recordedFeedback && (
                      <p className="text-sm font-bold text-amber-300 bg-slate-900 px-4 py-2 rounded-xl border border-amber-400/30">
                        {recordedFeedback}
                      </p>
                    )}
                  </div>
                )}

              </div>

              {/* OPTIONS GRID (Used for mystery, bubbles, apples, fillin modes) */}
              {currentQ.gameType !== "recording" && (
                <div className="grid grid-cols-2 gap-4">
                  {currentQ.options.map((opt, idx) => {
                    let btnStyle = "bg-amber-100/80 hover:bg-amber-200 text-slate-900 border-2 border-amber-300 shadow-md";

                    if (currentQ.gameType === "bubbles") {
                      btnStyle = `bg-gradient-to-r ${bubbleColors[idx % bubbleColors.length]} border-2 shadow-lg hover:scale-105`;
                    }

                    if (isAnswered) {
                      if (opt === currentQ.correctAnswer) {
                        btnStyle = "bg-emerald-500 text-white border-4 border-emerald-300 shadow-xl scale-105";
                      } else if (opt === selectedOption) {
                        btnStyle = "bg-rose-500 text-white border-4 border-rose-300 shadow-xl";
                      } else {
                        btnStyle = "bg-slate-100 text-slate-400 border-slate-200 opacity-40";
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!isAnswered ? { scale: 1.03 } : {}}
                        whileTap={!isAnswered ? { scale: 0.97 } : {}}
                        onClick={() => handleOptionClick(opt)}
                        disabled={isAnswered}
                        className={`p-5 sm:p-6 rounded-2xl font-black text-3xl sm:text-4xl text-center transition-all cursor-pointer relative flex items-center justify-center gap-2 ${btnStyle}`}
                      >
                        {currentQ.gameType === "apples" && (
                          <Apple className="w-8 h-8 text-red-500 fill-red-500 hidden sm:inline-block" />
                        )}
                        <span>{opt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Feedback Banner */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 ${
                      isCorrect ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-rose-50 border-rose-300 text-rose-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <p className="font-black text-base sm:text-lg">
                          {isCorrect ? "🎉 Xuất sắc! Bé chọn/đọc rất chuẩn!" : `❌ Tiếc quá! Đáp án đúng là: ${currentQ.correctAnswer}`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-sm px-6 py-3 rounded-xl shadow-lg cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <span>CÂU TIẾP THEO</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ) : isFinished ? (
            /* 3. GAME OVER SCOREBOARD */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-amber-400 shadow-2xl text-center space-y-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce border-4 border-white">
                <Award className="w-14 h-14" />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800">
                  🎉 CHÚC MỪNG BÉ HOÀN THÀNH 30 CÂU THỬ THÁCH!
                </h3>
                <p className="text-base text-slate-600 font-medium">
                  Em đã xuất sắc vượt qua tất cả 5 dạng trò chơi {category === "alphabet" ? "Game Chữ Cái Thường" : category === "compound" ? "Game Bảng Chữ Ghép" : "Game Bảng Âm Vần"}!
                </p>
              </div>

              {/* Star Rating & Stats */}
              <div className="flex justify-center gap-2 text-amber-400">
                <Sparkles className="w-10 h-10 fill-amber-300 animate-spin" />
                <Sparkles className="w-12 h-12 fill-amber-400" />
                <Sparkles className="w-10 h-10 fill-amber-300 animate-spin" />
              </div>

              <div className="flex flex-wrap justify-center gap-6 bg-amber-50 p-6 rounded-3xl border border-amber-200 max-w-md mx-auto shadow-inner">
                <div className="text-center px-4">
                  <span className="block text-xs text-slate-500 font-bold uppercase">Tổng Điểm</span>
                  <span className="text-4xl font-black text-amber-500">{score} đ</span>
                </div>
                <div className="w-px h-12 bg-amber-200" />
                <div className="text-center px-4">
                  <span className="block text-xs text-slate-500 font-bold uppercase">Trả Lời Đúng</span>
                  <span className="text-4xl font-black text-emerald-600">{correctCount} / 30</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => startCategoryGame(category)}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-base px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-white"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>CHƠI LẠI CHỦ ĐỀ NÀY</span>
                </button>

                <button
                  onClick={() => setCategory(null)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all cursor-pointer border-2 border-white/30"
                >
                  <span>CHỌN CHỦ ĐỀ KHÁC ➔</span>
                </button>
              </div>
            </motion.div>
          ) : null}

        </div>
      )}

      {/* Custom Audio Modal for replacing sample reading voice */}
      <CustomAudioModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        itemId={customAudioItemId}
        itemName={customAudioItemName}
        onAudioChanged={() => {
          if (currentQ) {
            const audioKey = getQuestionAudioItemId(currentQ);
            playItemAudio(audioKey, currentQ.audioText);
          }
        }}
      />

      {/* Edit Question Modal for Teachers to fix typos, change image or question text */}
      {currentQ && (
        <EditQuestionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          questionKey={getQuestionKey(currentQ)}
          defaultQuestion={currentQ}
          onSaved={(updatedQ) => {
            const updatedList = [...questions];
            updatedList[currentIndex] = updatedQ;
            setQuestions(updatedList);
          }}
        />
      )}

    </div>
  );
};
