import React, { useState, useEffect } from "react";
import { TeacherInfo } from "./NavigationMenu";
import { ImageWithFallback } from "./ImageWithFallback";
import { 
  FolderDown, 
  UploadCloud, 
  ExternalLink, 
  Download, 
  Search, 
  FileText, 
  Youtube, 
  BookOpen, 
  Layers, 
  Music, 
  User, 
  Calendar,
  CheckCircle,
  Sparkles
} from "lucide-react";

export interface SharedResource {
  id: string;
  title: string;
  teacherName: string;
  teacherEmail: string;
  category: string;
  lessonName: string;
  resourceType: string;
  link: string;
  thumbnail: string;
  description: string;
  createdAt: string;
  downloadsCount: number;
}

interface TeacherResourcesViewProps {
  teacher: TeacherInfo | null;
  onOpenUploadModal: () => void;
  onOpenTeacherModal: () => void;
}

export const TeacherResourcesView: React.FC<TeacherResourcesViewProps> = ({
  teacher,
  onOpenUploadModal,
  onOpenTeacherModal,
}) => {
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDownload = async (item: SharedResource) => {
    try {
      await fetch(`/api/resources/${item.id}/download`, { method: "POST" });
      fetchResources();

      if (item.link.startsWith("http")) {
        window.open(item.link, "_blank");
      } else {
        alert(`Đã bắt đầu tải về file: ${item.title}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ["Tất cả", "Bảng chữ cái", "Bảng chữ ghép", "Bảng âm vần", "Bài giảng PowerPoint", "Video bài giảng", "Tài liệu & Bài tập PDF"];

  const filteredResources = resources.filter((item) => {
    const matchesCategory = activeCategory === "Tất cả" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lessonName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner & Upload Action Button */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-cyan-200">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
            <FolderDown className="w-10 h-10 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <span className="px-3 py-1 bg-yellow-400 text-amber-950 font-black text-xs rounded-full">
              KHO TÀI NGUYÊN CỘNG ĐỒNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">SÁCH KẾT NỐI TRI THỨC LỚP 1</h2>
            <p className="text-xs sm:text-sm text-cyan-100 mt-1">
              Hàng trăm tài nguyên chữ cái, chữ ghép, âm vần & slide giảng dạy do giáo viên đóng góp.
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div>
          {teacher ? (
            <button
              onClick={onOpenUploadModal}
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-black text-sm rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center gap-2 border-2 border-yellow-200"
            >
              <UploadCloud className="w-5 h-5 text-amber-950" />
              <span>ĐÓNG GÓP TÀI NGUYÊN MỚI 📤</span>
            </button>
          ) : (
            <button
              onClick={onOpenTeacherModal}
              className="px-6 py-3.5 bg-white text-indigo-900 font-black text-sm rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center gap-2 hover:bg-slate-100"
            >
              <User className="w-5 h-5 text-indigo-600" />
              <span>ĐĂNG NHẬP GIÁO VIÊN ĐỂ TẢI LÊN</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Category & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border-4 border-cyan-200 shadow-md space-y-3">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  activeCategory === cat
                    ? "bg-cyan-600 text-white shadow-md scale-105"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm bài học, tên bài..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border-2 border-slate-200 focus:border-cyan-500 focus:outline-none font-medium"
            />
          </div>
        </div>

      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-bold">Đang tải kho tài nguyên cộng đồng...</div>
      ) : filteredResources.length === 0 ? (
        <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 space-y-2">
          <p className="text-base font-bold text-slate-700">Chưa có tài nguyên thuộc danh mục này.</p>
          <p className="text-xs text-slate-500">Hãy là giáo viên đầu tiên đưa tài nguyên lên đóng góp nhé!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-3 border-cyan-100 hover:border-cyan-400 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fallbackText={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-cyan-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow">
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-yellow-300 font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{item.downloadsCount} lượt tải</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {item.lessonName}
                  </span>
                  
                  <h4 className="text-lg font-black text-slate-900 line-clamp-2 group-hover:text-cyan-700 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-bold">
                      <User className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{item.teacherName}</span>
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">{item.resourceType}</span>
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => handleDownload(item)}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>XEM & TẢI TÀI NGUYÊN VỀ</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
