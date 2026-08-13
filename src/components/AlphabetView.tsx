import React, { useState, useEffect } from "react";
import { 
  SINGLE_LETTERS, 
  COMPOUND_LETTERS, 
  RHYMES_LIST, 
  KET_NOI_TRI_THUC_AM, 
  KET_NOI_TRI_THUC_HK1, 
  KET_NOI_TRI_THUC_HK2, 
  LetterItem, 
  CompoundLetter, 
  RhymeItem 
} from "../data/vietnameseData";
import { Volume2, Sparkles, BookOpen, Layers, Music, Search, Filter, VolumeX, Mic, Upload, Settings, Grid, Layout } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playItemAudio, hasCustomAudio, stopAllAudio } from "../utils/customAudioStore";
import { CustomAudioModal } from "./CustomAudioModal";
import { ImageWithFallback } from "./ImageWithFallback";
import { PracticeMode } from "./PracticeMode";

import { TeacherInfo } from "./NavigationMenu";

interface AlphabetViewProps {
  initialSubTab?: "single" | "compound" | "rhymes";
  teacher?: TeacherInfo | null;
}

export const AlphabetView: React.FC<AlphabetViewProps> = ({ initialSubTab = "single", teacher }) => {
  const isTeacher = !!teacher || !!localStorage.getItem("vuihoc_teacher");
  const [subTab, setSubTab] = useState<"single" | "compound" | "rhymes">(initialSubTab);
  const [showPracticeMode, setShowPracticeMode] = useState<boolean>(false);
  const [rhymeViewMode, setRhymeViewMode] = useState<"poster" | "grid">("poster");

  useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);
  
  // Selection States
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(SINGLE_LETTERS[0]);
  const [selectedCompound, setSelectedCompound] = useState<CompoundLetter | null>(COMPOUND_LETTERS[0]);
  const [selectedRhyme, setSelectedRhyme] = useState<RhymeItem | null>(RHYMES_LIST[0]);
  const [selectedAmItem, setSelectedAmItem] = useState<{ char: string; info: { key: string; name: string; id: string; display: string } } | null>(null);
  
  // Custom Audio Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<{ id: string; name: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Search & Filter state for Consolidated Rhymes
  const [rhymeSearch, setRhymeSearch] = useState("");
  const [rhymeTypeFilter, setRhymeTypeFilter] = useState<string>("Tất cả");

  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const speakText = (itemId: string, defaultText: string, visualId: string) => {
    setSpeakingId(visualId);
    playItemAudio(
      itemId,
      defaultText,
      () => setSpeakingId(visualId),
      () => setSpeakingId(null)
    );
  };

  const openCustomAudioModal = (id: string, name: string) => {
    setModalTarget({ id, name });
    setModalOpen(true);
  };

  // Helper to find a RhymeItem object from a string rhyme
  const findRhymeItemByString = (rStr: string): RhymeItem | undefined => {
    return RHYMES_LIST.find((item) => item.rhyme === rStr);
  };

  // Helper to get audio key & name for an Âm item
  const getAmInfo = (item: string) => {
    const TONE_NAMES: Record<string, { key: string; name: string; display: string }> = {
      "̀": { key: "tone-huyen", name: "Dấu huyền", display: "Dấu huyền ( ` )" },
      "́": { key: "tone-sac", name: "Dấu sắc", display: "Dấu sắc ( ´ )" },
      "̉": { key: "tone-hoi", name: "Dấu hỏi", display: "Dấu hỏi ( ̉ )" },
      "̃": { key: "tone-nga", name: "Dấu ngã", display: "Dấu ngã ( ~ )" },
      "̣": { key: "tone-nang", name: "Dấu nặng", display: "Dấu nặng ( . )" },
      "`": { key: "tone-huyen", name: "Dấu huyền", display: "Dấu huyền ( ` )" },
      "´": { key: "tone-sac", name: "Dấu sắc", display: "Dấu sắc ( ´ )" },
      "?": { key: "tone-hoi", name: "Dấu hỏi", display: "Dấu hỏi ( ̉ )" },
      "~": { key: "tone-nga", name: "Dấu ngã", display: "Dấu ngã ( ~ )" },
      ".": { key: "tone-nang", name: "Dấu nặng", display: "Dấu nặng ( . )" },
    };

    if (TONE_NAMES[item]) {
      return { key: TONE_NAMES[item].key, name: TONE_NAMES[item].name, id: TONE_NAMES[item].key, display: TONE_NAMES[item].display };
    }

    const single = SINGLE_LETTERS.find((l) => l.lower === item);
    if (single) return { key: `letter-${single.id}`, name: `Chữ ${single.name}`, id: single.id, display: `Chữ ${single.name}` };
    const compound = COMPOUND_LETTERS.find((c) => c.code === item);
    if (compound) return { key: `comp-${compound.id}`, name: `Chữ ghép ${compound.name}`, id: compound.id, display: `Chữ ghép ${compound.name}` };
    const rhyme = RHYMES_LIST.find((r) => r.rhyme === item);
    if (rhyme) return { key: `rhyme-${rhyme.id}`, name: `Âm vần ${rhyme.rhyme}`, id: rhyme.id, display: `Âm vần ${rhyme.rhyme}` };
    return { key: `am-${item}`, name: `Âm ${item}`, id: `am-${item}`, display: `Âm ${item}` };
  };

  // Filter Rhymes list based on search and category
  const filteredRhymes = RHYMES_LIST.filter((item) => {
    const matchesSearch = item.rhyme.toLowerCase().includes(rhymeSearch.toLowerCase()) || 
                          item.exampleWord.toLowerCase().includes(rhymeSearch.toLowerCase());
    const matchesType = rhymeTypeFilter === "Tất cả" || item.type === rhymeTypeFilter;
    return matchesSearch && matchesType;
  });

  const rhymeTypes = ["Tất cả", "Vần Học kì 1", "Vần Học kì 2"];

  return (
    <div className="w-full space-y-6">
      
      {/* Sub-navigation Tabs for Master Alphabet & Rhyme Tables */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-3xl border-2 border-blue-100 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSubTab("single"); if (!selectedLetter) setSelectedLetter(SINGLE_LETTERS[0]); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              subTab === "single"
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-slate-50 hover:bg-blue-50 text-slate-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>BẢNG CHỮ CÁI ĐƠN (29 Chữ)</span>
          </button>

          <button
            onClick={() => { setSubTab("compound"); if (!selectedCompound) setSelectedCompound(COMPOUND_LETTERS[0]); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              subTab === "compound"
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "bg-slate-50 hover:bg-indigo-50 text-slate-700"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>BẢNG CHỮ GHÉP (11 Chữ)</span>
          </button>

          <button
            onClick={() => { setSubTab("rhymes"); if (!selectedRhyme) setSelectedRhyme(RHYMES_LIST[0]); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              subTab === "rhymes"
                ? "bg-emerald-600 text-white shadow-md scale-105"
                : "bg-slate-50 hover:bg-emerald-50 text-slate-700"
            }`}
          >
            <Music className="w-4 h-4" />
            <span>BẢNG ÂM VẦN ({RHYMES_LIST.length} Vần)</span>
          </button>
        </div>

        {/* Practice Mode Toggle Button */}
        <button
          onClick={() => setShowPracticeMode(!showPracticeMode)}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg ${
            showPracticeMode
              ? "bg-slate-900 text-amber-400 border-2 border-amber-400 scale-105 ring-4 ring-amber-400/20"
              : "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 hover:scale-105"
          }`}
        >
          <Mic className="w-4 h-4 animate-bounce" />
          <span>
            {showPracticeMode
              ? "✖️ ĐÓNG CHẾ ĐỘ LUYỆN ĐỌC"
              : subTab === "single"
              ? "🎯 LUYỆN ĐỌC 29 CHỮ CÁI (AI CHẤM ĐIỂM)"
              : subTab === "compound"
              ? "🎯 LUYỆN ĐỌC 11 CHỮ GHÉP (AI CHẤM ĐIỂM)"
              : "🎯 LUYỆN ĐỌC ÂM VẦN (AI CHẤM ĐIỂM)"}
          </span>
        </button>
      </div>

      {/* RENDER PRACTICE MODE IF ACTIVE */}
      {showPracticeMode && (
        <PracticeMode 
          initialType={subTab} 
          onClose={() => setShowPracticeMode(false)} 
        />
      )}

      {/* 1. SINGLE LETTERS SECTION */}
      {subTab === "single" && (
        <div className="space-y-6">
          {/* Practice Banner for Single Letters */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white border-2 border-blue-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center font-black shadow-md shrink-0">
                <Mic className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>🎯 LUYỆN ĐỌC 29 CHỮ CÁI ĐƠN & CHẤM ĐIỂM AI</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-blue-100">
                  Bé đọc to lần lượt 29 chữ cái qua micro, AI sẽ nhận diện giọng đọc và chấm điểm thưởng sao!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPracticeMode(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>BẮT ĐẦU LUYỆN ĐỌC CHỮ CÁI 🚀</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Alphabet Grid (Left side) */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-[32px] border-4 border-blue-100 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-blue-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span>29 Chữ Cái Tiếng Việt Lớp 1</span>
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Kèm hình ảnh minh họa
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {SINGLE_LETTERS.map((item) => {
                const isSelected = selectedLetter?.id === item.id;
                const customized = hasCustomAudio(`letter-${item.id}`);
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedLetter(item);
                      speakText(`letter-${item.id}`, `Chữ ${item.name}. ${item.exampleWord}`, item.id);
                    }}
                    className={`relative p-2.5 rounded-2xl border-2 transition-all cursor-pointer text-center flex flex-col items-center ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-300 ring-4 ring-blue-100 shadow-lg scale-105 z-10"
                        : "bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-200"
                    }`}
                  >
                    {customized && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" title="Có âm thanh mẫu tùy chỉnh" />
                    )}
                    <span className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm text-blue-900">
                      {item.lower}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Letter Detail Card (Right side) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[32px] border-4 border-blue-100 shadow-xl">
            {selectedLetter ? (
              <div className="space-y-4 text-center">
                <div className="inline-block px-4 py-1 bg-blue-500 text-white font-black text-xs rounded-full shadow-sm">
                  CHI TIẾT CHỮ CÁI
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black text-6xl sm:text-7xl flex items-center justify-center shadow-xl border-4 border-white">
                    {selectedLetter.lower}
                  </div>
                  <span className="text-xs font-bold text-blue-600 mt-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Chữ cái thường: {selectedLetter.lower} | Cách vần: {selectedLetter.spelling}
                  </span>
                </div>

                <h2 className="text-3xl font-black text-blue-950">{selectedLetter.name}</h2>

                {/* Pronunciation Audio Button */}
                <button
                  onClick={() => speakText(`letter-${selectedLetter.id}`, `Chữ ${selectedLetter.name}. Đánh vần: ${selectedLetter.spelling}.`, selectedLetter.id)}
                  className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                >
                  <Volume2 className={`w-5 h-5 ${speakingId === selectedLetter.id ? "animate-bounce" : ""}`} />
                  <span>NGHE PHÁT ÂM CHUẨN 🔊</span>
                </button>

                {/* Custom Audio Recorder / File Upload Trigger */}
                {isTeacher && (
                  <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-left">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Giọng mẫu phát âm:</span>
                      <span className="text-xs font-black text-blue-950 flex items-center gap-1">
                        {hasCustomAudio(`letter-${selectedLetter.id}`) ? "⭐ Giọng đọc mẫu đã tùy chỉnh" : "🔊 Giọng đọc chuẩn mặc định"}
                      </span>
                    </div>
                    <button
                      onClick={() => openCustomAudioModal(`letter-${selectedLetter.id}`, `Chữ cái ${selectedLetter.name}`)}
                      className="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-100 text-blue-900 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-500" />
                      <span>Ghi âm / File</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-12">Chọn một chữ cái để xem chi tiết!</p>
            )}
          </div>
        </div>
      </div>
      )}

      {/* 2. COMPOUND LETTERS MASTER TABLE */}
      {subTab === "compound" && (
        <div className="space-y-6">
          {/* Practice Banner for Compound Letters */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white border-2 border-indigo-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center font-black shadow-md shrink-0">
                <Mic className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>🎯 LUYỆN ĐỌC 11 CHỮ GHÉP & CHẤM ĐIỂM AI</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-indigo-100">
                  Luyện đọc chuẩn 11 chữ ghép (ch, kh, nh, th, tr, ph, qu, ngh...). AI lắng nghe và chấm điểm tức thì!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPracticeMode(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>BẮT ĐẦU LUYỆN ĐỌC CHỮ GHÉP 🚀</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-[32px] border-4 border-indigo-100 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>BẢNG 11 CHỮ GHÉP LỚP 1 (KÈM HÌNH MINH HỌA)</span>
              </h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Sách Kết Nối Tri Thức
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {COMPOUND_LETTERS.map((item) => {
                const isSelected = selectedCompound?.id === item.id;
                const customized = hasCustomAudio(`comp-${item.id}`);
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCompound(item);
                      speakText(`comp-${item.id}`, `Chữ ghép ${item.code}. Đánh vần ${item.spelling}.`, item.id);
                    }}
                    className={`relative p-3.5 rounded-2xl border-2 text-center transition-all shadow-sm cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-300 ring-4 ring-indigo-100 scale-105"
                        : "bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-200"
                    }`}
                  >
                    {customized && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" title="Có âm thanh mẫu tùy chỉnh" />
                    )}
                    <span className="text-3xl font-black">{item.code}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-[32px] border-4 border-indigo-100 shadow-xl">
            {selectedCompound ? (
              <div className="space-y-4 text-center">
                <div className="inline-block px-4 py-1 bg-indigo-600 text-white font-black text-xs rounded-full shadow-sm">
                  CHI TIẾT CHỮ GHÉP
                </div>

                <div className="w-28 h-28 mx-auto rounded-3xl bg-indigo-600 text-white font-black text-6xl flex items-center justify-center shadow-lg border-4 border-white">
                  {selectedCompound.code}
                </div>

                <h2 className="text-3xl font-black text-indigo-950">{selectedCompound.name}</h2>
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                  Cách đánh vần: {selectedCompound.spelling}
                </span>

                <button
                  onClick={() => speakText(`comp-${selectedCompound.id}`, `Chữ ghép ${selectedCompound.name}. Đánh vần ${selectedCompound.spelling}.`, selectedCompound.id)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>NGHE PHÁT ÂM CHỮ GHÉP 🔊</span>
                </button>

                {/* Custom Audio Trigger Bar */}
                {isTeacher && (
                  <div className="flex items-center justify-between p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-left">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Giọng mẫu phát âm:</span>
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                        {hasCustomAudio(`comp-${selectedCompound.id}`) ? "⭐ Giọng đọc mẫu đã tùy chỉnh" : "🔊 Giọng đọc chuẩn mặc định"}
                      </span>
                    </div>
                    <button
                      onClick={() => openCustomAudioModal(`comp-${selectedCompound.id}`, `Chữ ghép ${selectedCompound.name}`)}
                      className="px-3 py-1.5 bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-900 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-rose-500" />
                      <span>Ghi âm / File</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-12">Chọn một chữ ghép để tập đọc!</p>
            )}
          </div>
        </div>
      </div>
      )}

      {/* 3. CONSOLIDATED MASTER RHYMES TABLE */}
      {subTab === "rhymes" && (
        <div className="space-y-6">
          
          {/* Practice Banner for Rhymes */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white border-2 border-emerald-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center font-black shadow-md shrink-0">
                <Mic className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>🎯 LUYỆN ĐỌC BẢNG ÂM VẦN LỚP 1 & CHẤM ĐIỂM AI</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-emerald-100">
                  Thử thách đọc các âm vần Tiếng Việt Lớp 1 (HK1 & HK2) ngẫu nhiên, nâng cao khả năng phát âm với AI!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPracticeMode(true)}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>BẮT ĐẦU LUYỆN ĐỌC ÂM VẦN 🚀</span>
            </button>
          </div>

          {/* View Mode Switcher Header */}
          <div className="flex flex-wrap items-center justify-between bg-emerald-50/80 p-3 rounded-2xl border-2 border-emerald-200 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRhymeViewMode("poster")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  rhymeViewMode === "poster"
                    ? "bg-rose-600 text-white shadow-md scale-105 ring-2 ring-rose-300"
                    : "bg-white text-rose-900 hover:bg-rose-50 border border-rose-200"
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>📋 BẢNG POSTER MẪU KẾT NỐI TRI THỨC</span>
              </button>
              <button
                onClick={() => setRhymeViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  rhymeViewMode === "grid"
                    ? "bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-300"
                    : "bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>🖼️ XEM THẺ DẠNG LƯỚI & HÌNH ẢNH</span>
              </button>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              Chương trình Kết Nối Tri Thức Với Cuộc Sống
            </span>
          </div>

          {/* RENDER POSTER CHART MODE */}
          {rhymeViewMode === "poster" ? (
            <div className="bg-amber-50/40 p-4 sm:p-6 rounded-[32px] border-4 border-rose-200 shadow-xl space-y-6">
              
              {/* Poster Main Banner Header */}
              <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg border-2 border-amber-200 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-15">
                  <Sparkles className="w-32 h-32" />
                </div>
                <h2 className="text-xl sm:text-3xl font-black tracking-wide uppercase drop-shadow-md">
                  BẢNG VẦN LỚP 1
                </h2>
                <p className="text-xs sm:text-base font-bold text-amber-200 mt-1 uppercase tracking-wider">
                  BỘ KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
                </p>
              </div>

              {/* 0. DẤU THANH TIẾNG VIỆT */}
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-500 p-4 sm:p-5 rounded-3xl text-white shadow-md space-y-3 border-2 border-purple-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-yellow-400 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow-xs">
                      DẤU THANH
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                      5 Dấu thanh Tiếng Việt (Ghi âm & Nghe phát âm mẫu)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-amber-200 bg-black/20 px-3 py-1 rounded-full border border-white/20">
                    Bấm nút 🎙️ để ghi âm giọng đọc mẫu
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { symbol: "̀", name: "Dấu huyền", key: "tone-huyen", example: "Bàn, Nhà, Mèo" },
                    { symbol: "́", name: "Dấu sắc", key: "tone-sac", example: "Cá, Lá, Nón" },
                    { symbol: "̉", name: "Dấu hỏi", key: "tone-hoi", example: "Hổ, Thỏ, Cổ" },
                    { symbol: "̃", name: "Dấu ngã", key: "tone-nga", example: "Gỗ, Mỡ, Nữa" },
                    { symbol: "̣", name: "Dấu nặng", key: "tone-nang", example: "Mẹ, Nạ, Nặng" },
                  ].map((tone) => {
                    const hasCustom = hasCustomAudio(tone.key);
                    return (
                      <div
                        key={tone.key}
                        className="bg-white text-slate-900 p-3 rounded-2xl shadow-sm border-2 border-purple-200 flex flex-col items-center text-center justify-between gap-2 transition-all hover:scale-105 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-2xl font-black text-purple-700 bg-purple-100 w-11 h-11 rounded-xl flex items-center justify-center border border-purple-300 shadow-inner">
                            {tone.symbol}
                          </span>
                          {hasCustom ? (
                            <span className="px-1.5 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-black rounded-full shadow-2xs" title="Đã có giọng mẫu tùy chỉnh">
                              ⭐ Đã có giọng
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">
                              Gốc
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-black text-sm text-purple-950">{tone.name}</h4>
                          <span className="text-[11px] text-slate-500 font-medium block">Ví dụ: {tone.example}</span>
                        </div>

                        <div className="flex items-center gap-1.5 w-full mt-1">
                          <button
                            onClick={() => speakText(tone.key, `${tone.name}.`, tone.key)}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title={`Nghe phát âm ${tone.name}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe</span>
                          </button>

                          <button
                            onClick={() => openCustomAudioModal(tone.key, tone.name)}
                            className="py-2 px-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                            title={`Ghi âm giọng mẫu cho ${tone.name}`}
                          >
                            <Mic className="w-3.5 h-3.5 text-white" />
                            <span>Ghi âm</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1. PHẦN ÂM */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-rose-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 bg-rose-600 text-white font-black text-sm rounded-xl shadow-xs">
                      ÂM
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-600">
                      Các âm đơn, chữ ghép cơ bản & dấu thanh
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                    Bấm vào âm/chữ bất kỳ để nghe hoặc ghi âm giọng đọc
                  </span>
                </div>

                <div className="space-y-2.5">
                  {KET_NOI_TRI_THUC_AM.map((row, rIdx) => (
                    <div key={rIdx} className="flex flex-wrap gap-1.5 sm:gap-2">
                      {row.map((item, cIdx) => {
                        const info = getAmInfo(item);
                        const hasCustom = hasCustomAudio(info.key);
                        const isSelected = selectedAmItem?.char === item;
                        return (
                          <button
                            key={cIdx}
                            onClick={() => {
                              setSelectedAmItem({ char: item, info });
                              speakText(info.key, `${info.name}.`, info.id);
                            }}
                            className={`relative min-w-[34px] sm:min-w-[40px] h-10 px-2 font-black text-sm sm:text-base rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-300 scale-110 shadow-md z-10"
                                : "bg-rose-50/70 hover:bg-rose-100 text-rose-950 border-rose-200 shadow-2xs hover:scale-105"
                            }`}
                            title={`Click để nghe ${info.name}${hasCustom ? " (Có giọng mẫu tùy chỉnh)" : ""}`}
                          >
                            {hasCustom && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white ring-1 ring-amber-500 shadow-xs flex items-center justify-center text-[9px] font-black text-amber-950" title="Có giọng mẫu tùy chỉnh">★</span>
                            )}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Selected Âm Item Details & Custom Recording Action Bar */}
                {selectedAmItem && (
                  <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-rose-600 text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
                        {selectedAmItem.char}
                      </div>
                      <div>
                        <h4 className="font-black text-base text-rose-950">{selectedAmItem.info.name}</h4>
                        <span className="text-xs text-rose-700 font-medium block">
                          {hasCustomAudio(selectedAmItem.info.key) ? "⭐ Đã có giọng đọc mẫu riêng" : "🔊 Giọng đọc mặc định"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => speakText(selectedAmItem.info.key, `${selectedAmItem.info.name}.`, selectedAmItem.info.id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Nghe đọc</span>
                      </button>

                      <button
                        onClick={() => openCustomAudioModal(selectedAmItem.info.key, selectedAmItem.info.name)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-white" />
                        <span>Ghi âm giọng mẫu 🎙️</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. PHẦN VẦN - HỌC KÌ 1 */}
              <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-4 py-1.5 bg-amber-500 text-white font-black text-sm rounded-xl shadow-xs">
                    HỌC KÌ 1
                  </span>
                  <span className="px-3 py-1 bg-sky-600 text-white font-black text-xs rounded-lg shadow-xs">
                    VẦN
                  </span>
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    (Nhấp vào vần bất kỳ để nghe phát âm, ghi âm & xem minh họa)
                  </span>
                </div>

                <div className="space-y-2">
                  {KET_NOI_TRI_THUC_HK1.map((row, rIdx) => (
                    <div key={rIdx} className="flex flex-wrap gap-1.5 sm:gap-2">
                      {row.map((v, cIdx) => {
                        const itemObj = findRhymeItemByString(v);
                        const isSelected = selectedRhyme?.rhyme === v;
                        const audioKey = itemObj ? `rhyme-${itemObj.id}` : `rhyme-hk1-${rIdx}-${cIdx}`;
                        const hasCustom = hasCustomAudio(audioKey);
                        return (
                          <button
                            key={cIdx}
                            onClick={() => {
                              if (itemObj) setSelectedRhyme(itemObj);
                              speakText(audioKey, `Vần ${v}.`, itemObj ? itemObj.id : `hk1-${rIdx}-${cIdx}`);
                            }}
                            className={`relative min-w-[36px] sm:min-w-[42px] h-9 sm:h-10 px-2 sm:px-2.5 font-black text-sm sm:text-base rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 scale-110 shadow-md z-10"
                                : "bg-amber-50/50 hover:bg-amber-100 text-amber-950 border-amber-200 shadow-2xs hover:scale-105"
                            }`}
                            title={`Vần ${v}${hasCustom ? " (Có giọng mẫu tùy chỉnh)" : ""}`}
                          >
                            {hasCustom && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white ring-1 ring-amber-500 shadow-xs flex items-center justify-center text-[9px] font-black text-amber-950" title="Có giọng mẫu tùy chỉnh">★</span>
                            )}
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. PHẦN VẦN - HỌC KÌ 2 */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-4 py-1.5 bg-emerald-600 text-white font-black text-sm rounded-xl shadow-xs">
                    HỌC KÌ 2
                  </span>
                  <span className="px-3 py-1 bg-sky-600 text-white font-black text-xs rounded-lg shadow-xs">
                    VẦN
                  </span>
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    (Các vần nâng cao Học kì 2)
                  </span>
                </div>

                <div className="space-y-2">
                  {KET_NOI_TRI_THUC_HK2.map((row, rIdx) => (
                    <div key={rIdx} className="flex flex-wrap gap-1.5 sm:gap-2">
                      {row.map((v, cIdx) => {
                        const itemObj = findRhymeItemByString(v);
                        const isSelected = selectedRhyme?.rhyme === v;
                        const audioKey = itemObj ? `rhyme-${itemObj.id}` : `rhyme-hk2-${rIdx}-${cIdx}`;
                        const hasCustom = hasCustomAudio(audioKey);
                        return (
                          <button
                            key={cIdx}
                            onClick={() => {
                              if (itemObj) setSelectedRhyme(itemObj);
                              speakText(audioKey, `Vần ${v}.`, itemObj ? itemObj.id : `hk2-${rIdx}-${cIdx}`);
                            }}
                            className={`relative min-w-[36px] sm:min-w-[42px] h-9 sm:h-10 px-2 sm:px-2.5 font-black text-sm sm:text-base rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 scale-110 shadow-md z-10"
                                : "bg-emerald-50/50 hover:bg-emerald-100 text-emerald-950 border-emerald-200 shadow-2xs hover:scale-105"
                            }`}
                            title={`Vần ${v}${hasCustom ? " (Có giọng mẫu tùy chỉnh)" : ""}`}
                          >
                            {hasCustom && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white ring-1 ring-amber-500 shadow-xs flex items-center justify-center text-[9px] font-black text-amber-950" title="Có giọng mẫu tùy chỉnh">★</span>
                            )}
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Rhyme Card Box when in Poster Mode */}
              {selectedRhyme && (
                <div className="bg-white p-5 rounded-3xl border-4 border-rose-300 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full md:w-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-rose-600 text-white font-black text-4xl sm:text-5xl flex items-center justify-center shadow-md shrink-0">
                      {selectedRhyme.rhyme}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
                          {selectedRhyme.type}
                        </span>
                        {hasCustomAudio(`rhyme-${selectedRhyme.id}`) && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black rounded-full flex items-center gap-1">
                            ⭐ Đã có giọng mẫu tùy chỉnh
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        Vần "{selectedRhyme.rhyme}"
                      </h3>
                      <p className="text-xs font-semibold text-slate-600">
                        Đánh vần: <span className="font-bold text-slate-800">{selectedRhyme.spelling}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center shrink-0">
                    <button
                      onClick={() => speakText(`rhyme-${selectedRhyme.id}`, `Vần ${selectedRhyme.rhyme}. Đánh vần ${selectedRhyme.spelling}.`, selectedRhyme.id)}
                      className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>NGHE PHÁT ÂM 🔊</span>
                    </button>

                    <button
                      onClick={() => openCustomAudioModal(`rhyme-${selectedRhyme.id}`, `Âm vần "${selectedRhyme.rhyme}"`)}
                      className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                      title="Ghi âm giọng đọc mẫu hoặc tải file MP3 cho vần này"
                    >
                      <Mic className="w-4 h-4 text-white" />
                      <span>{hasCustomAudio(`rhyme-${selectedRhyme.id}`) ? "SỬA GIỌNG MẪU 🎙️" : "GHI ÂM GIỌNG MẪU 🎙️"}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (

            /* Consolidated Master Rhyme Grid & Details Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Rhyme Grid with Search & Categories */}
              <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-[32px] border-4 border-emerald-100 shadow-xl space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                    <Music className="w-5 h-5 text-emerald-600" />
                    <span>BẢNG ÂM VẦN TỔNG HỢP ({RHYMES_LIST.length} Vần)</span>
                  </h3>

                  {/* Quick Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm vần (ví dụ: an, ia)..."
                      value={rhymeSearch}
                      onChange={(e) => setRhymeSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs rounded-full border border-slate-300 focus:outline-none focus:border-emerald-500 w-full sm:w-48 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {rhymeTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setRhymeTypeFilter(type)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        rhymeTypeFilter === type
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Rhymes Master Grid */}
                {filteredRhymes.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2.5 max-h-[560px] overflow-y-auto pr-1">
                    {filteredRhymes.map((item) => {
                      const isSelected = selectedRhyme?.id === item.id;
                      const customized = hasCustomAudio(`rhyme-${item.id}`);
                      return (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedRhyme(item);
                            speakText(`rhyme-${item.id}`, `Vần ${item.rhyme}. Đánh vần ${item.spelling}.`, item.id);
                          }}
                          className={`relative p-3 rounded-2xl border-2 text-center transition-all cursor-pointer shadow-sm flex items-center justify-center ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-300 ring-4 ring-emerald-100 scale-105 z-10"
                              : "bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200"
                          }`}
                        >
                          {customized && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" title="Có âm thanh mẫu tùy chỉnh" />
                          )}
                          <span className="text-2xl font-black block">{item.rhyme}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    Không tìm thấy âm vần nào phù hợp với từ khóa "{rhymeSearch}".
                  </div>
                )}

              </div>

              {/* Right Column: Selected Rhyme Detail Panel */}
              <div className="lg:col-span-5 bg-white p-6 rounded-[32px] border-4 border-emerald-100 shadow-xl">
                {selectedRhyme ? (
                  <div className="space-y-4 text-center">
                    <div className="inline-block px-4 py-1 bg-emerald-600 text-white font-black text-xs rounded-full shadow-sm">
                      CHI TIẾT ÂM VẦN
                    </div>

                    <div className="w-28 h-28 mx-auto rounded-3xl bg-emerald-600 text-white font-black text-6xl flex items-center justify-center shadow-lg border-4 border-white">
                      {selectedRhyme.rhyme}
                    </div>

                    <div>
                      <h2 className="text-3xl font-black text-emerald-950">Vần "{selectedRhyme.rhyme}"</h2>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                          {selectedRhyme.type}
                        </span>
                        <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                          Cách vần: {selectedRhyme.spelling}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => speakText(`rhyme-${selectedRhyme.id}`, `Vần ${selectedRhyme.rhyme}. Đánh vần ${selectedRhyme.spelling}.`, selectedRhyme.id)}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>NGHE ĐỌC ÂM VẦN 🔊</span>
                    </button>

                    {/* Custom Audio Trigger Bar */}
                    {isTeacher && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-left">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Giọng mẫu phát âm:</span>
                          <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                            {hasCustomAudio(`rhyme-${selectedRhyme.id}`) ? "⭐ Giọng đọc mẫu đã tùy chỉnh" : "🔊 Giọng đọc chuẩn mặc định"}
                          </span>
                        </div>
                        <button
                          onClick={() => openCustomAudioModal(`rhyme-${selectedRhyme.id}`, `Âm vần "${selectedRhyme.rhyme}"`)}
                          className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Mic className="w-3.5 h-3.5 text-rose-500" />
                          <span>Ghi âm / File</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-12">Chọn một âm vần để xem hướng dẫn đọc!</p>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* Modal Customize Sample Audio */}
      {modalTarget && (
        <CustomAudioModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          itemId={modalTarget.id}
          itemName={modalTarget.name}
          onAudioChanged={() => setRefreshKey(prev => prev + 1)}
        />
      )}

    </div>
  );
};

