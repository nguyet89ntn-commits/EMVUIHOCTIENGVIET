import React, { useState } from "react";
import { StudentInfo, TeacherInfo } from "./NavigationMenu";
import { 
  X, 
  GraduationCap, 
  UserCheck, 
  UploadCloud, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  CheckCircle, 
  FileText,
  Youtube,
  FolderPlus
} from "lucide-react";

interface ModalsProps {
  showStudentModal: boolean;
  onCloseStudentModal: () => void;
  onSaveStudent: (info: StudentInfo) => void;
  
  showTeacherModal: boolean;
  onCloseTeacherModal: () => void;
  onSaveTeacher: (info: TeacherInfo) => void;

  showUploadModal: boolean;
  onCloseUploadModal: () => void;
  teacher: TeacherInfo | null;
  onResourceCreated: () => void;
}

const PRESET_THUMBNAILS = [
  { label: "Chữ cái & Con vật 3D", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60" },
  { label: "Âm vần & Sách mở", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=60" },
  { label: "Lớp học tương tác", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&auto=format&fit=crop&q=60" },
  { label: "Trò chơi học vần", url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=500&auto=format&fit=crop&q=60" }
];

export const StudentTeacherModals: React.FC<ModalsProps> = ({
  showStudentModal,
  onCloseStudentModal,
  onSaveStudent,
  showTeacherModal,
  onCloseTeacherModal,
  onSaveTeacher,
  showUploadModal,
  onCloseUploadModal,
  teacher,
  onResourceCreated,
}) => {
  // Student Form State
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("1A1");
  const [studentSchool, setStudentSchool] = useState("Trường Tiểu Học Kim Đồng");

  // Teacher Form State
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSchool, setTeacherSchool] = useState("Trường Tiểu Học Nguyễn Du");

  // Upload Resource State
  const [resTitle, setResTitle] = useState("");
  const [resCategory, setResCategory] = useState("Bảng chữ cái");
  const [resLessonName, setResLessonName] = useState("Bài 1: A a, B b");
  const [resType, setResType] = useState("Tải từ máy tính");
  const [resLink, setResLink] = useState("");
  const [resThumbnail, setResThumbnail] = useState(PRESET_THUMBNAILS[0].url);
  const [resDescription, setResDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    onSaveStudent({
      name: studentName.trim(),
      className: studentClass.trim() || "Lớp 1",
      schoolName: studentSchool.trim() || "Trường Tiểu Học",
    });
    onCloseStudentModal();
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherEmail.trim() || !teacherName.trim()) return;
    onSaveTeacher({
      email: teacherEmail.trim(),
      name: teacherName.trim(),
      schoolName: teacherSchool.trim() || "Trường Tiểu Học",
    });
    onCloseTeacherModal();
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resTitle.trim(),
          teacherName: teacher ? teacher.name : "Giáo viên Tiếng Việt 1",
          teacherEmail: teacher ? teacher.email : "giaovien@edu.vn",
          category: resCategory,
          lessonName: resLessonName,
          resourceType: resType,
          link: resType === "Tải từ máy tính" ? `#download-${fileName || "tai-lieu-lop1.pptx"}` : resLink || "#",
          thumbnail: resThumbnail,
          description: resDescription.trim() || "Tài nguyên giảng dạy Tiếng Việt 1 bổ ích.",
        }),
      });

      if (response.ok) {
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          onResourceCreated();
          onCloseUploadModal();
          // Reset form
          setResTitle("");
          setResDescription("");
          setResLink("");
          setFileName("");
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. STUDENT REGISTRATION MODAL */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-yellow-50 via-white to-amber-50 rounded-3xl p-6 shadow-2xl border-4 border-yellow-300">
            <button
              onClick={onCloseStudentModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-400 text-amber-950 rounded-2xl shadow-md">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-950">HỌC SINH VUI HỌC</h3>
                <p className="text-xs font-medium text-amber-800">Nhập thông tin em để lưu huy hiệu học tập nhé!</p>
              </div>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên học sinh (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-yellow-300 focus:border-amber-500 focus:outline-none font-medium text-slate-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp học</label>
                  <input
                    type="text"
                    placeholder="Lớp 1A1"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-yellow-300 focus:border-amber-500 focus:outline-none font-medium text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trường tiểu học</label>
                  <input
                    type="text"
                    placeholder="TH Kim Đồng"
                    value={studentSchool}
                    onChange={(e) => setStudentSchool(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-yellow-300 focus:border-amber-500 focus:outline-none font-medium text-slate-800 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 font-black rounded-xl text-base shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2 border-2 border-yellow-200 mt-2"
              >
                <span>VÀO HỌC NGAY 🚀</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. TEACHER REGISTRATION MODAL */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-indigo-50 via-white to-purple-50 rounded-3xl p-6 shadow-2xl border-4 border-indigo-300">
            <button
              onClick={onCloseTeacherModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md">
                <UserCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-indigo-950">GIÁO VIÊN ĐỒNG GÓP</h3>
                <p className="text-xs font-medium text-indigo-800">Khai báo thông tin giáo viên để chia sẻ tài nguyên!</p>
              </div>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ Gmail (*)</label>
                <input
                  type="email"
                  required
                  placeholder="nguyenvana@gmail.com"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên giáo viên (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Cô Nguyễn Thị Mai"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trường công tác</label>
                <input
                  type="text"
                  placeholder="Trường Tiểu Học Nguyễn Du"
                  value={teacherSchool}
                  onChange={(e) => setTeacherSchool(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none font-medium text-slate-800 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-xl text-base shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2 border-2 border-indigo-200 mt-2"
              >
                <span>XÁC NHẬN GIÁO VIÊN ✨</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. TEACHER RESOURCE UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-cyan-300 my-8">
            <button
              onClick={onCloseUploadModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500 text-white rounded-2xl shadow-md">
                <FolderPlus className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">ĐƯA TÀI NGUYÊN LÊN ĐÓNG GÓP</h3>
                <p className="text-xs font-medium text-slate-600">
                  Giáo viên: <span className="font-bold text-indigo-700">{teacher ? teacher.name : "Chưa xác nhận"}</span> ({teacher?.email})
                </p>
              </div>
            </div>

            {uploadSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-2xl font-bold text-slate-800">Đưa Tài Nguyên Thành Công!</h4>
                <p className="text-sm text-slate-600">Đã đăng tải tài nguyên thành công lên Kho Tài Nguyên Cộng Đồng.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
                {/* Resource Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tên bài / Tiêu đề tài nguyên (*)</label>
                    <input
                      type="text"
                      required
                      placeholder="Slide bài giảng âm vần an - at..."
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chọn loại tài nguyên (*)</label>
                    <select
                      value={resCategory}
                      onChange={(e) => setResCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none font-medium text-slate-800 bg-white"
                    >
                      <option value="Bảng chữ cái">Bảng chữ cái</option>
                      <option value="Bảng chữ ghép">Bảng chữ ghép</option>
                      <option value="Bảng âm vần">Bảng âm vần</option>
                      <option value="Bài giảng PowerPoint">Bài giảng PowerPoint</option>
                      <option value="Video bài giảng">Video bài giảng</option>
                      <option value="Tài liệu & Bài tập PDF">Tài liệu & Bài tập PDF</option>
                    </select>
                  </div>
                </div>

                {/* Lesson Name & Source Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Theo bài học sách giáo khoa</label>
                    <input
                      type="text"
                      placeholder="Bài 12: Ch chữ ghép Ch, Kh"
                      value={resLessonName}
                      onChange={(e) => setResLessonName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nguồn đưa tài nguyên lên (*)</label>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none font-medium text-slate-800 bg-white"
                    >
                      <option value="Tải từ máy tính">Tải từ máy tính (File đính kèm)</option>
                      <option value="Link Website">Link Web</option>
                      <option value="Link Google Drive">Link Google Drive</option>
                      <option value="Link YouTube">Link YouTube Video</option>
                    </select>
                  </div>
                </div>

                {/* Source Input details */}
                {resType === "Tải từ máy tính" ? (
                  <div className="border-2 border-dashed border-cyan-300 rounded-2xl p-4 bg-cyan-50/50 text-center">
                    <UploadCloud className="w-8 h-8 text-cyan-600 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-slate-700">Chọn file tài nguyên từ máy tính của bạn</p>
                    <p className="text-[11px] text-slate-500 mb-2">Hỗ trợ PPTX, PDF, MP4, MP3, DOCX, PNG (Tối đa 50MB)</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileName(e.target.files[0].name);
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{fileName ? `Đã chọn: ${fileName}` : "Duyệt tìm file từ máy tính"}</span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nhập đường link tài nguyên (*)</label>
                    <div className="relative">
                      {resType === "Link YouTube" ? (
                        <Youtube className="w-5 h-5 absolute left-3 top-3 text-red-500" />
                      ) : (
                        <LinkIcon className="w-5 h-5 absolute left-3 top-3 text-cyan-600" />
                      )}
                      <input
                        type="url"
                        required
                        placeholder={
                          resType === "Link Google Drive"
                            ? "https://drive.google.com/file/d/..."
                            : resType === "Link YouTube"
                            ? "https://youtube.com/watch?v=..."
                            : "https://tenmiencuaban.com/bai-hoc..."
                        }
                        value={resLink}
                        onChange={(e) => setResLink(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* Cover Image Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Tạo / Chọn ảnh đại diện tài nguyên theo chủ đề</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {PRESET_THUMBNAILS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setResThumbnail(preset.url)}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          resThumbnail === preset.url ? "border-cyan-500 ring-2 ring-cyan-300 scale-105" : "border-slate-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-14 object-cover" />
                        <p className="text-[10px] font-bold text-center py-1 bg-slate-100 text-slate-700 truncate px-1">
                          {preset.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Hoặc dán URL ảnh custom tại đây..."
                      value={resThumbnail}
                      onChange={(e) => setResThumbnail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả ngắn gọn nội dung bài học</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả tóm tắt tài nguyên để giáo viên khác và học sinh dễ dàng học và sử dụng..."
                    value={resDescription}
                    onChange={(e) => setResDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black rounded-xl text-base shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>{isSubmitting ? "Đang tải lên..." : "ĐƯA TÀI NGUYÊN LÊN CỘNG ĐỒNG"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
