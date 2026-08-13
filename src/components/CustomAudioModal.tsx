import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, Play, Pause, RotateCcw, Check, X, Volume2, Sparkles, AlertCircle, Download, FolderDown } from "lucide-react";
import { saveCustomAudio, removeCustomAudio, hasCustomAudio, getCustomAudio, stopAllAudio, downloadAudioPackageFile, importAudioPackage, getAllAudioCount } from "../utils/customAudioStore";

interface CustomAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
  onAudioChanged?: () => void;
}

export const CustomAudioModal: React.FC<CustomAudioModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemName,
  onAudioChanged
}) => {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record");
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const isCustomized = hasCustomAudio(itemId);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSaveSuccessMsg(null);
      setAudioBlobUrl(null);
      setAudioBase64(null);
      setRecordingTime(0);
      setIsRecording(false);
      
      // Load current custom audio if available
      const current = getCustomAudio(itemId);
      if (current) {
        setAudioBlobUrl(current);
        setAudioBase64(current);
      }
    } else {
      stopRecording();
      stopAllAudio();
    }
  }, [isOpen, itemId]);

  // Start direct microphone recording
  const startRecording = async () => {
    setErrorMsg(null);
    setSaveSuccessMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);

        // Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };

        // Stop all track streams
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setErrorMsg("Không thể truy cập Microphone. Vui lòng cho phép quyền truy cập micro trên trình duyệt!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Handle File Upload (.mp3, .wav, .m4a, .ogg)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSaveSuccessMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setErrorMsg("Vui lòng chọn file định dạng âm thanh (.mp3, .wav, .m4a, .ogg)!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Kích thước file quá lớn (tối đa 5MB)!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setAudioBase64(result);
      setAudioBlobUrl(result);
    };
  };

  // Play preview audio
  const togglePlayPreview = () => {
    if (!audioBlobUrl) return;

    if (isPlayingPreview && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      const audio = new Audio(audioBlobUrl);
      audioPreviewRef.current = audio;
      setIsPlayingPreview(true);

      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = () => setIsPlayingPreview(false);
      audio.play().catch((e) => {
        console.error("Preview audio failed", e);
        setIsPlayingPreview(false);
      });
    }
  };

  // Save as Custom Audio for this item
  const handleSave = async () => {
    if (!audioBase64) {
      setErrorMsg("Chưa có đoạn âm thanh nào được ghi âm hoặc tải lên!");
      return;
    }

    const success = await saveCustomAudio(itemId, audioBase64);
    if (success) {
      setSaveSuccessMsg("Đã lưu âm thanh mẫu thành công! Từ giờ ứng dụng sẽ phát giọng đọc mẫu này.");
      if (onAudioChanged) onAudioChanged();
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMsg("Không thể lưu file âm thanh. Vui lòng thử lại!");
    }
  };

  // Reset to default TTS
  const handleReset = async () => {
    await removeCustomAudio(itemId);
    setAudioBase64(null);
    setAudioBlobUrl(null);
    setSaveSuccessMsg("Đã khôi phục giọng đọc mẫu mặc định của ứng dụng!");
    if (onAudioChanged) onAudioChanged();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[32px] border-4 border-blue-200 shadow-2xl p-6 relative overflow-hidden space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-wider block">THAY ĐỔI ÂM THANH MẪU</span>
            <h3 className="text-2xl font-black text-slate-900">{itemName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
          isCustomized 
            ? "bg-amber-50 border-amber-200 text-amber-900" 
            : "bg-blue-50 border-blue-200 text-blue-900"
        }`}>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>{isCustomized ? "Đang dùng: Giọng mẫu tùy chỉnh" : "Đang dùng: Giọng đọc chuẩn mặc định"}</span>
          </div>
          {isCustomized && (
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl transition-all text-[11px] font-black cursor-pointer shadow-sm"
            >
              Khôi phục gốc
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => { setActiveTab("record"); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "record" 
                ? "bg-white text-blue-600 shadow-md" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mic className="w-4 h-4 text-rose-500" />
            <span>GHI ÂM MỚI</span>
          </button>

          <button
            onClick={() => { setActiveTab("upload"); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "upload" 
                ? "bg-white text-blue-600 shadow-md" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>TẢI FILE TỪ MÁY (.MP3)</span>
          </button>
        </div>

        {/* Tab 1: Record Directly */}
        {activeTab === "record" && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
            {!isRecording ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-semibold">
                  Nhấn nút đỏ bên dưới và đọc rõ mẫu âm cho bé nghe:
                </p>
                <button
                  onClick={startRecording}
                  className="w-20 h-20 mx-auto rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95 cursor-pointer ring-4 ring-rose-200"
                >
                  <Mic className="w-9 h-9" />
                </button>
                <span className="block text-xs font-bold text-rose-600">BẮT ĐẦU GHI ÂM</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-rose-600 font-black text-lg animate-pulse">
                  <span className="w-3.5 h-3.5 bg-rose-600 rounded-full"></span>
                  <span>🔴 ĐANG GHI ÂM... ({recordingTime}s)</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 mx-auto transition-all active:scale-95 cursor-pointer ring-4 ring-red-200"
                >
                  <Square className="w-5 h-5 fill-white text-white" />
                  <span>⏹️ BẤM VÀO ĐÂY ĐỂ DỪNG GHI ÂM</span>
                </button>
                <span className="block text-xs font-bold text-slate-600">Bấm nút trên sau khi phát âm xong mẫu đọc nhé!</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === "upload" && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
            <p className="text-xs text-slate-600 font-semibold">
              Chọn file âm thanh mẫu từ máy tính của bạn (.mp3, .wav, .m4a):
            </p>
            <label className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-transform active:scale-95">
              <Upload className="w-4 h-4" />
              <span>CHỌN FILE ÂM THANH...</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Audio Preview Controls (if audio is recorded or uploaded) */}
        {audioBlobUrl && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPreview}
                className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md cursor-pointer"
              >
                {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="text-left">
                <span className="text-xs font-black text-emerald-900 block">ĐA BẢN THỬ NGHE ÂM THANH</span>
                <span className="text-[11px] text-emerald-700 font-medium">Bấm phát để kiểm tra giọng trước khi lưu</span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>LƯU MẪU</span>
            </button>
          </div>
        )}

        {/* Alert Error / Success Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Package Backup & Restore for Exported Links */}
        <div className="pt-3 border-t border-slate-200 mt-2 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Gói Giọng Đọc Mẫu (Xuất / Nhập File .json):</span>
            <span className="text-[11px] font-semibold text-slate-500">Đã lưu: {getAllAudioCount()} mục</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                downloadAudioPackageFile();
                setSaveSuccessMsg("Đã tải gói giọng đọc mẫu (.json) về máy!");
              }}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Xuất tất cả file ghi âm đã tạo ra file .json để sao lưu hoặc dùng trên trang xuất bản"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Xuất File Giọng (.json)</span>
            </button>

            <label className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer text-center">
              <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nhập File Giọng (.json)</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = async (evt) => {
                    const content = evt.target?.result as string;
                    if (content) {
                      const count = await importAudioPackage(content);
                      if (count > 0) {
                        setSaveSuccessMsg(`Đã nhập thành công ${count} mục giọng đọc mẫu!`);
                        if (onAudioChanged) onAudioChanged();
                      } else {
                        setErrorMsg("File .json không chứa dữ liệu giọng đọc phù hợp.");
                      }
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
          <p className="text-[10px] text-slate-500 font-medium leading-tight">
            💡 <span className="font-bold">Mẹo chia sẻ:</span> Khi mở link xuất bản mới, bấm <span className="font-bold text-slate-700">"Nhập File Giọng"</span> và chọn file .json đã xuất để khôi phục toàn bộ giọng đọc mẫu của bạn ngay lập tức!
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400">
          Giọng đọc mới sẽ được lưu trực tiếp trên thiết bị của bạn.
        </div>

      </div>
    </div>
  );
};
