import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Volume2, Star, BookOpen } from "lucide-react";

interface BannerHeaderProps {
  onLetterClick?: (letter: string) => void;
}

const FLOATING_3D_LETTERS = [
  { text: "A", color: "from-red-500 to-pink-500", size: "text-4xl sm:text-6xl", top: "10%", left: "4%" },
  { text: "B", color: "from-blue-500 to-indigo-500", size: "text-3xl sm:text-5xl", top: "50%", left: "10%" },
  { text: "C", color: "from-emerald-400 to-teal-600", size: "text-4xl sm:text-6xl", top: "15%", left: "18%" },
  { text: "Đ", color: "from-amber-400 to-orange-500", size: "text-3xl sm:text-5xl", top: "60%", left: "24%" },
  { text: "Ê", color: "from-purple-500 to-fuchsia-600", size: "text-4xl sm:text-6xl", top: "12%", left: "74%" },
  { text: "G", color: "from-cyan-400 to-blue-600", size: "text-3xl sm:text-5xl", top: "55%", left: "80%" },
  { text: "M", color: "from-rose-500 to-red-600", size: "text-4xl sm:text-6xl", top: "18%", left: "88%" },
  { text: "O", color: "from-yellow-400 to-amber-500", size: "text-3xl sm:text-5xl", top: "62%", left: "93%" },
];

export const BannerHeader: React.FC<BannerHeaderProps> = ({ onLetterClick }) => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const speakLetter = (letterText: string) => {
    setActiveLetter(letterText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Chữ ${letterText}`);
      utterance.lang = "vi-VN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    if (onLetterClick) {
      onLetterClick(letterText);
    }
    setTimeout(() => setActiveLetter(null), 1200);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-xl border-4 border-white/80 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 my-2">
      {/* Responsive Banner Aspect Wrapper */}
      <div className="relative w-full min-h-[200px] sm:min-h-[240px] flex flex-col items-center justify-center py-6 px-4 text-center select-none">
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-4 left-10 w-20 h-20 bg-white rounded-full blur-sm"></div>
          <div className="absolute bottom-4 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-xl"></div>
        </div>
        
        {/* Floating Clouds */}
        <motion.div 
          animate={{ x: [-15, 15, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3 left-6 w-24 h-10 bg-white/70 backdrop-blur-sm rounded-full blur-[1px] hidden sm:block pointer-events-none"
        />
        <motion.div 
          animate={{ x: [20, -20, 20] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 right-10 w-32 h-12 bg-white/70 backdrop-blur-sm rounded-full blur-[1px] hidden sm:block pointer-events-none"
        />

        {/* Animated 3D Floating Letters Around Banner */}
        {FLOATING_3D_LETTERS.map((item, idx) => (
          <motion.button
            key={idx}
            onClick={() => speakLetter(item.text)}
            whileHover={{ scale: 1.3, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, idx % 2 === 0 ? 8 : -8, 0],
            }}
            transition={{
              duration: 3 + (idx % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.3,
            }}
            className={`absolute ${item.size} font-black drop-shadow-[0_6px_6px_rgba(0,0,0,0.4)] text-transparent bg-clip-text bg-gradient-to-b ${item.color} cursor-pointer hover:brightness-125 z-10 transition-transform`}
            style={{ top: item.top, left: item.left }}
            title={`Nhấn để nghe chữ ${item.text}`}
          >
            <span className="relative inline-block filter drop-shadow-[0_4px_0px_rgba(255,255,255,0.8)]">
              {item.text}
            </span>
          </motion.button>
        ))}

        {/* Center Main Title Block */}
        <div className="relative z-20 flex flex-col items-center">
          
          {/* Textbook Series Tag */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-yellow-300 text-amber-950 font-bold text-xs sm:text-sm shadow-lg border-2 border-yellow-100 mb-2"
          >
            <BookOpen className="w-4 h-4 text-amber-900 animate-bounce" />
            <span>Sách Tiếng Việt Lớp 1 • Bộ Kết Nối Tri Thức Với Cuộc Sống</span>
            <Star className="w-4 h-4 text-amber-900 fill-amber-900" />
          </motion.div>

          {/* 3D Main Title "VUI HỌC TIẾNG VIỆT 1" */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider text-white filter drop-shadow-[0_5px_0_#1e3a8a] drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] flex flex-wrap justify-center items-center gap-2 sm:gap-3"
          >
            <span className="bg-gradient-to-b from-yellow-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent transform -rotate-1 inline-block">
              VUI HỌC
            </span>
            <span className="bg-gradient-to-b from-white via-slate-100 to-amber-200 bg-clip-text text-transparent transform rotate-1 inline-block">
              TIẾNG VIỆT
            </span>
            <span className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-500 to-yellow-400 text-white text-3xl sm:text-4xl shadow-2xl border-4 border-white transform rotate-3">
              1
            </span>
          </motion.h1>

          {/* Subtitle / Interactive Tip */}
          <p className="mt-2 text-xs sm:text-base font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>Học âm vần, đánh vần & luyện đọc thú vị dành cho bé lớp 1!</span>
            <Volume2 className="w-4 h-4 text-yellow-300" />
          </p>

          {/* Active Letter Popup Indicator */}
          {activeLetter && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mt-2 px-4 py-1 bg-white text-indigo-900 font-extrabold rounded-full text-lg shadow-2xl border-2 border-indigo-400 animate-pulse"
            >
              Đang đọc: Chữ {activeLetter} 🔊
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
