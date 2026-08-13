import React, { useState } from "react";
import { Bot, Send, Sparkles, Volume2, User, RefreshCw, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

interface Message {
  sender: "user" | "ai";
  text: string;
  time: string;
}

const PRESET_PROMPTS = [
  "Đánh vần giúp em từ 'trường học' và 'cô giáo'",
  "Đặt 2 câu ngắn đơn giản cho bé lớp 1 tập đọc",
  "Tạo 3 câu trắc nghiệm vui về chữ cái A, B, C",
  "Kể một câu chuyện ngụ ngôn ngắn về Chú Thỏ Thông Minh",
  "Gợi ý 2 trò chơi gây hứng thú cho tiết học Tiếng Việt Lớp 1"
];

export const AiTutorView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Xin chào thầy cô và các em học sinh lớp 1! Tôi là Trợ Lý AI Tiếng Việt 1 - Bộ Sách Kết Nối Tri Thức Với Cuộc Sống. Em hoặc thầy cô cần giải đáp thắc mắc gì về đánh vần, tập đọc hay bài tập cứ hỏi tôi nhé! 🎈📚⭐",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await response.json();
      const aiReply = data.reply || "AI đang bận một chút, em hãy thử lại câu hỏi nhé!";

      const aiMsg: Message = {
        sender: "ai",
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "Có chút gián đoạn kết nối. Nhưng em hãy an tâm, hãy tiếp tục học chữ cái nhé!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* AI Header Card */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-purple-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
            <Bot className="w-10 h-10 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <span className="px-3 py-1 bg-yellow-400 text-amber-950 font-black text-xs rounded-full">
              CÔNG NGHỆ AI DÀNH Cho LỚP 1
            </span>
            <h3 className="text-2xl font-black mt-1">TRỢ LÝ AI TIẾNG VIỆT 1</h3>
            <p className="text-xs text-purple-100">
              Hỗ trợ học sinh & giáo viên mọi lĩnh vực: đánh vần, tập đọc, soạn bài tập và giải đáp tri thức.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Prompts Buttons */}
      <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-sm">
        <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Gợi ý câu hỏi nhanh:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold text-xs transition-transform active:scale-95 text-left"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-slate-50 rounded-3xl border-4 border-purple-200 shadow-inner p-4 sm:p-6 flex flex-col h-[450px]">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === "user" ? "bg-amber-500 text-white" : "bg-purple-600 text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm sm:text-base font-medium space-y-2 ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border-2 border-purple-100 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                
                <div className="flex items-center justify-between text-[10px] opacity-75 border-t border-black/10 pt-1">
                  <span>{msg.time}</span>
                  {msg.sender === "ai" && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="inline-flex items-center gap-1 text-purple-700 font-bold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe AI đọc 🔊</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
                <Bot className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl border-2 border-purple-100 text-sm font-bold text-purple-700 animate-pulse">
                Trợ lý AI Tiếng Việt đang suy nghĩ câu trả lời ngộ nghĩnh...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 flex items-center gap-2 pt-2 border-t-2 border-slate-200"
        >
          <input
            type="text"
            placeholder="Hỏi AI bất kỳ điều gì về Tiếng Việt Lớp 1..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium text-slate-800 bg-white shadow-inner"
          />

          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">GỬI CÂU HỎI</span>
          </button>
        </form>

      </div>

    </div>
  );
};
