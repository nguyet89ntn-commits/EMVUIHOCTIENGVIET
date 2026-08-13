import React, { useState, useRef } from "react";
import { LESSON_UNITS, LessonUnit } from "../data/vietnameseData";
import { ImageWithFallback } from "./ImageWithFallback";
import { 
  BookOpen, 
  Volume2, 
  Mic, 
  Square, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  RotateCcw,
  VolumeX,
  Award
} from "lucide-react";
import { motion } from "motion/react";

export const LessonView: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<LessonUnit>(LESSON_UNITS[0]);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [evalResult, setEvalResult] = useState<{ score: number; stars: number; message: string } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Recording Audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Simulated AI pronunciation evaluation score for fun encouragement
        const randomScore = Math.floor(Math.random() * 15) + 85; // 85-100
        const stars = randomScore >= 95 ? 5 : randomScore >= 90 ? 4 : 3;
        setEvalResult({
          score: randomScore,
          stars: stars,
          message: randomScore >= 95 
            ? "Xuất sắc! Em phát âm rất chuẩn giọng, to và rõ ràng!" 
            : "Rất giỏi! Em đọc chuẩn từng âm vần rồi đấy!"
        });

        // Stop media tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioUrl(null);
      setEvalResult(null);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      alert("Không thể truy cập Micro. Vui lòng cấp quyền Micro trên trình duyệt để thu âm nhé!");
    }
  };

  // Stop Recording Audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Lesson Selector Ribbon */}
      <div className="bg-white p-4 rounded-3xl border-4 border-amber-300 shadow-xl overflow-x-auto">
        <h3 className="text-lg font-black text-amber-950 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span>BÀI HỌC VẦN THEO SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
        </h3>

        <div className="flex gap-2.5 min-w-max pb-1">
          {LESSON_UNITS.map((unit) => {
            const isSelected = selectedUnit.id === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit);
                  setAudioUrl(null);
                  setEvalResult(null);
                }}
                className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-yellow-300 scale-105 shadow-md ring-2 ring-amber-200"
                    : "bg-amber-50/70 hover:bg-amber-100 text-slate-800 border-amber-200"
                }`}
              >
                <span>{unit.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Target Vocabulary & Spelling */}
        <div className="lg:col-span-7 bg-gradient-to-b from-amber-50 via-white to-orange-50 p-6 rounded-3xl border-4 border-amber-300 shadow-xl space-y-6">
          
          <div>
            <span className="px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full uppercase">
              {selectedUnit.subtitle}
            </span>
            <h2 className="text-3xl font-black text-amber-950 mt-2">{selectedUnit.title}</h2>
          </div>

          {/* Vocabulary Grid */}
          <div className="space-y-3">
            <h4 className="text-base font-black text-slate-800 uppercase tracking-wider">
              1. TỪ MỚI & CÁCH ĐÁNH VẦN:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedUnit.vocabulary.map((vocab, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center gap-3 hover:shadow-md transition-all"
                >
                  <ImageWithFallback
                    src={vocab.image}
                    alt={vocab.word}
                    fallbackText={vocab.word}
                    className="w-16 h-16 object-cover rounded-xl border border-amber-300 shadow"
                  />
                  <div className="flex-1">
                    <h5 className="text-xl font-black text-slate-900">{vocab.word}</h5>
                    <p className="text-xs font-bold text-amber-700">{vocab.spelling}</p>
                    <p className="text-[11px] text-slate-500">{vocab.meaning}</p>
                  </div>
                  <button
                    onClick={() => speakText(`Từ: ${vocab.word}. Đánh vần: ${vocab.spelling}`)}
                    className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow transition-transform active:scale-90"
                    title="Nghe đánh vần"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Passage */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-inner space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-slate-800 uppercase tracking-wider">
                2. ĐOẠN VĂN TẬP ĐỌC:
              </h4>
              <button
                onClick={() => speakText(selectedUnit.readingPassage)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition-transform active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>NGHE MẪU 🔊</span>
              </button>
            </div>
            <p className="text-xl font-black text-amber-950 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              "{selectedUnit.readingPassage}"
            </p>
          </div>

        </div>

        {/* Right Column: Audio Recording & Voice Comparison */}
        <div className="lg:col-span-5 bg-gradient-to-b from-rose-50 via-white to-pink-50 p-6 rounded-3xl border-4 border-rose-300 shadow-xl space-y-6">
          
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500 text-white font-extrabold text-xs rounded-full shadow">
              <Mic className="w-4 h-4" />
              <span>THU ÂM GIỌNG ĐỌC BÉ</span>
            </div>
            <h3 className="text-2xl font-black text-rose-950">Luyện Đọc & Đối Chiếu Giọng</h3>
            <p className="text-xs text-slate-600 font-medium">
              Bé nhấn nút thu âm bên dưới rồi đọc to câu: <br />
              <span className="font-bold text-rose-700 font-serif">"{selectedUnit.readingPassage}"</span>
            </p>
          </div>

          {/* Recording Control Button */}
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {!isRecording ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="w-full py-4 bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 border-2 border-white text-lg"
              >
                <Mic className="w-6 h-6 animate-pulse" />
                <span>BẮT ĐẦU THU ÂM 🎙️</span>
              </motion.button>
            ) : (
              <motion.button
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                onClick={stopRecording}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-2 border-2 border-white text-lg"
              >
                <Square className="w-6 h-6 fill-white" />
                <span>DỪNG THU ÂM ({recordingTime}s)</span>
              </motion.button>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm animate-pulse">
                <span className="w-3 h-3 bg-rose-600 rounded-full animate-ping" />
                <span>Đang thu âm giọng đọc của bé...</span>
              </div>
            )}
          </div>

          {/* Playback & Evaluation Section */}
          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-2xl border-2 border-rose-200 shadow-md space-y-3"
            >
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Play className="w-4 h-4 text-rose-500" />
                <span>Nghe lại bản thu âm của bé:</span>
              </h5>

              <audio controls src={audioUrl} className="w-full rounded-xl" />

              {/* Evaluation Star Feedback */}
              {evalResult && (
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center space-y-2">
                  <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < evalResult.stars ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="text-xl font-black text-rose-950">
                    Điểm đối chiếu: <span className="text-rose-600">{evalResult.score}/100</span>
                  </h4>
                  <p className="text-xs font-bold text-rose-800">{evalResult.message}</p>
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
