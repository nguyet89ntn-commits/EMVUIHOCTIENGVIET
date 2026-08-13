import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Save, 
  RotateCcw, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Type
} from "lucide-react";
import { getCustomQuestion, saveCustomQuestion, removeCustomQuestion, CustomQuestionData } from "../utils/customQuestionStore";

interface GameQuestion {
  id: number;
  gameType: string;
  promptTitle: string;
  targetCode: string;
  audioText: string;
  imageUrl?: string;
  exampleWord?: string;
  options: string[];
  correctAnswer: string;
  blankWordDisplay?: string;
  missingPart?: string;
}

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionKey: string; // e.g. "game-alphabet-1"
  defaultQuestion: GameQuestion;
  onSaved: (updatedQ: GameQuestion) => void;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  questionKey,
  defaultQuestion,
  onSaved
}) => {
  const [promptTitle, setPromptTitle] = useState("");
  const [exampleWord, setExampleWord] = useState("");
  const [audioText, setAudioText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing override or default question data when modal opens
  useEffect(() => {
    if (isOpen && defaultQuestion) {
      const custom = getCustomQuestion(questionKey);
      
      const currentPrompt = custom?.promptTitle ?? defaultQuestion.promptTitle ?? "";
      const currentExample = custom?.exampleWord ?? defaultQuestion.exampleWord ?? "";
      const currentAudio = custom?.audioText ?? defaultQuestion.audioText ?? "";
      const currentImg = custom?.imageUrl ?? defaultQuestion.imageUrl ?? "";
      const currentCorrect = custom?.correctAnswer ?? defaultQuestion.correctAnswer ?? "";
      const currentOpts = custom?.options && custom.options.length > 0 ? custom.options : defaultQuestion.options || ["", "", "", ""];

      setPromptTitle(currentPrompt);
      setExampleWord(currentExample);
      setAudioText(currentAudio);
      setImageUrl(currentImg);
      setImagePreview(currentImg);
      setCorrectAnswer(currentCorrect);
      setOptions([...currentOpts]);

      setSuccessMsg("");
      setErrorMsg("");
    }
  }, [isOpen, questionKey, defaultQuestion]);

  if (!isOpen || !defaultQuestion) return null;

  // Handle Image File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn file hình ảnh hợp lệ (.png, .jpg, .jpeg, .webp)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setErrorMsg("Dung lượng ảnh tối đa 5MB. Vui lòng chọn ảnh nhỏ hơn!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImagePreview(result);
      setErrorMsg("");
    };
    reader.onerror = () => {
      setErrorMsg("Lỗi khi đọc file hình ảnh!");
    };
    reader.readAsDataURL(file);
  };

  const handleOptionChange = (index: number, val: string) => {
    const newOpts = [...options];
    newOpts[index] = val;
    setOptions(newOpts);
  };

  const handleSave = () => {
    if (!promptTitle.trim()) {
      setErrorMsg("Tiêu đề câu hỏi không được để trống!");
      return;
    }

    if (!correctAnswer.trim()) {
      setErrorMsg("Đáp án đúng không được để trống!");
      return;
    }

    const customData: CustomQuestionData = {
      id: questionKey,
      promptTitle: promptTitle.trim(),
      exampleWord: exampleWord.trim(),
      audioText: audioText.trim(),
      imageUrl: imageUrl.trim(),
      correctAnswer: correctAnswer.trim(),
      options: options.map(o => o.trim()).filter(Boolean)
    };

    const saved = saveCustomQuestion(questionKey, customData);
    if (saved) {
      setSuccessMsg("✨ Đã lưu chỉnh sửa câu hỏi thành công!");
      setErrorMsg("");

      // Construct updated question object
      const updatedQ: GameQuestion = {
        ...defaultQuestion,
        promptTitle: customData.promptTitle || defaultQuestion.promptTitle,
        exampleWord: customData.exampleWord ?? defaultQuestion.exampleWord,
        audioText: customData.audioText || defaultQuestion.audioText,
        imageUrl: customData.imageUrl ?? defaultQuestion.imageUrl,
        correctAnswer: customData.correctAnswer || defaultQuestion.correctAnswer,
        options: customData.options && customData.options.length > 0 ? customData.options : defaultQuestion.options
      };

      setTimeout(() => {
        onSaved(updatedQ);
        onClose();
      }, 700);
    } else {
      setErrorMsg("Không thể lưu chỉnh sửa. Vui lòng thử lại!");
    }
  };

  const handleResetDefault = () => {
    if (window.confirm("Bạn có chắc chắn muốn khôi phục câu hỏi về nội dung mặc định ban đầu không?")) {
      removeCustomQuestion(questionKey);
      setSuccessMsg("🔄 Đã khôi phục câu hỏi về mặc định!");
      setErrorMsg("");

      setTimeout(() => {
        onSaved(defaultQuestion);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4 border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              ✏️ Chỉnh Sửa Nội Dung Câu Hỏi
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Dành cho Giáo viên: Sửa lỗi chính tả, thay ảnh minh họa hoặc tùy chỉnh câu hỏi
            </p>
          </div>
        </div>

        {/* Notification Banners */}
        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Edit Form */}
        <div className="space-y-5 text-left max-h-[60vh] overflow-y-auto pr-1">
          
          {/* 1. Prompt Title / Instruction */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-600" />
              <span>Tiêu đề & Hướng dẫn câu hỏi:</span>
            </label>
            <textarea
              rows={2}
              value={promptTitle}
              onChange={(e) => setPromptTitle(e.target.value)}
              placeholder="Nhập tiêu đề hoặc lời dẫn câu hỏi..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm font-bold text-slate-800 outline-none transition-all"
            />
          </div>

          {/* 2. Example Word & Audio Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Từ minh họa (Ví dụ: "Con Cò"):
              </label>
              <input
                type="text"
                value={exampleWord}
                onChange={(e) => setExampleWord(e.target.value)}
                placeholder="Nhập từ ví dụ..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm font-bold text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Văn bản đọc mẫu (Ví dụ: "Chữ c"):
              </label>
              <input
                type="text"
                value={audioText}
                onChange={(e) => setAudioText(e.target.value)}
                placeholder="Nhập văn bản âm thanh..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-sm font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* 3. Image Upload / Image URL */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-3">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span>Hình ảnh minh họa câu hỏi:</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Image Preview Box */}
              <div className="w-24 h-24 rounded-2xl border-2 border-amber-300 bg-white p-1 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400 font-bold text-xs">
                    Chưa có ảnh
                  </div>
                )}
              </div>

              {/* Upload & URL Controls */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Tải ảnh từ máy (.png, .jpg)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImagePreview("");
                      }}
                      className="px-3 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Xóa ảnh
                    </button>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Hoặc dán Link URL hình ảnh:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/hinh-anh.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-amber-400 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Correct Answer & Options */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border-2 border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Đáp án đúng & Lựa chọn (Nếu có):</span>
              </label>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Đáp án đúng chính xác:
              </span>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Ví dụ: c hoặc ca"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 font-black text-emerald-800 bg-white text-base outline-none focus:border-emerald-500"
              />
            </div>

            {options.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  Các lựa chọn đáp án (4 phương án trong game):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {options.map((opt, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] font-bold text-slate-500 block">Ô {idx + 1}:</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Lựa chọn ${idx + 1}`}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none bg-white ${
                          opt === correctAnswer ? "border-emerald-500 text-emerald-800 ring-1 ring-emerald-300" : "border-slate-300 text-slate-800"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefault}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Lưu chỉnh sửa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
