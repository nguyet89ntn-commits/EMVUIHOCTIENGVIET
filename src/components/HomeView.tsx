import React from "react";
import { NavTab, StudentInfo, TeacherInfo } from "./NavigationMenu";
import { 
  Grid, 
  Layers,
  Music,
  Gamepad2, 
  Bot, 
  Sparkles, 
  Star, 
  GraduationCap, 
  UserCheck, 
  ArrowRight,
  Volume2,
  Mic,
  Award
} from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  onNavigateTab: (tab: NavTab) => void;
  student: StudentInfo | null;
  teacher: TeacherInfo | null;
  onOpenStudentModal: () => void;
  onOpenTeacherModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  student,
  teacher,
  onOpenStudentModal,
  onOpenTeacherModal,
}) => {
  const quickCards = [
    {
      tab: "alphabet" as NavTab,
      title: "BẢNG CHỮ CÁI",
      subtitle: "29 chữ cái Tiếng Việt đơn",
      desc: "Học nhận biết mặt chữ cái đơn, hướng dẫn phát âm chuẩn và hình ảnh từ minh họa sinh động.",
      icon: <Grid className="w-8 h-8 text-white" />,
      color: "from-pink-500 via-rose-500 to-red-500",
      border: "border-pink-300",
      badge: "29 CHỮ CÁI ĐƠN 3D"
    },
    {
      tab: "compound" as NavTab,
      title: "BẢNG CHỮ GHÉP",
      subtitle: "11 chữ ghép Tiếng Việt Lớp 1",
      desc: "Học các chữ ghép như ch, gh, gi, kh, nh, ng, ngh, ph, qu, th, tr với phát âm chuẩn.",
      icon: <Layers className="w-8 h-8 text-white" />,
      color: "from-indigo-500 via-purple-500 to-indigo-600",
      border: "border-indigo-300",
      badge: "11 CHỮ GHÉP LỚP 1 ✨"
    },
    {
      tab: "rhymes" as NavTab,
      title: "BẢNG ÂM VẦN TỔNG HỢP",
      subtitle: "Tra cứu đầy đủ âm vần & 5 dấu thanh",
      desc: "Bảng tổng hợp hơn 50 âm vần Lớp 1 (Sách Kết Nối Tri Thức), phân loại vần và có audio phát âm.",
      icon: <Music className="w-8 h-8 text-white" />,
      color: "from-emerald-500 via-teal-500 to-green-600",
      border: "border-emerald-300",
      badge: "BẢNG VẦN TỔNG HỢP 🎵"
    },
    {
      tab: "games" as NavTab,
      title: "GAME TIẾNG VIỆT",
      subtitle: "30 câu đố vui chữ cái, chữ ghép & âm vần",
      desc: "Trải nghiệm Ô Chữ Bí Ẩn 🕵️‍♀️, Bắn Bóng Âm Thanh 🎈 và Hái Quả Táo Thần Kỳ 🍎 cực hấp dẫn!",
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      color: "from-amber-500 via-orange-500 to-yellow-500",
      border: "border-amber-300",
      badge: "3 TRÒ CHƠI HẤP DẪN 🎮"
    },
    {
      tab: "ai" as NavTab,
      title: "AI TIẾNG VIỆT",
      subtitle: "Trợ lý học tập thông minh 24/7",
      desc: "Giải đáp mọi thắc mắc đánh vần, đặt câu, kể chuyện và tạo bài tập luyện tập.",
      icon: <Bot className="w-8 h-8 text-white" />,
      color: "from-purple-600 via-indigo-600 to-violet-600",
      border: "border-purple-300",
      badge: "CÔNG NGHỆ AI MỚI ✨"
    }
  ];

  return (
    <div className="w-full space-y-8">
      
      {/* Student/Teacher Welcome Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Student Banner Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[36px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(59,130,246,0.15)] border-4 border-blue-100 flex flex-col items-center text-center transform transition-all hover:scale-[1.01]">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-blue-500 rounded-full shadow-inner flex items-center justify-center text-white text-2xl font-black">H</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-blue-800 mb-2">HỌC SINH VUI HỌC</h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-5">
            {student 
              ? `Em: ${student.name} (${student.className}) • Trường ${student.schoolName}`
              : "Khám phá thế giới chữ cái đầy màu sắc, âm vần và game trắc nghiệm!"}
          </p>
          <button 
            onClick={onOpenStudentModal}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-3.5 rounded-2xl text-lg shadow-[0_6px_0_#2563EB] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {student ? "THÔNG TIN HỌC SINH ⭐" : "BẮT ĐẦU NGAY 🚀"}
          </button>
        </div>

        {/* Teacher Banner Card */}
        <div className="bg-white p-6 sm:p-8 rounded-[36px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(16,185,129,0.15)] border-4 border-emerald-100 flex flex-col items-center text-center transform transition-all hover:scale-[1.01]">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-full shadow-inner flex items-center justify-center text-white text-2xl font-black">G</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 mb-2">DÀNH CHO GIÁO VIÊN</h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-5">
            {teacher 
              ? `GV: ${teacher.name} • Trường ${teacher.schoolName}`
              : "Đóng góp tài nguyên, chia sẻ bài giảng slide và giáo án học vần."}
          </p>
          <button 
            onClick={onOpenTeacherModal}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl text-lg shadow-[0_6px_0_#059669] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {teacher ? "TÀI KHOẢN GIÁO VIÊN ✨" : "ĐĂNG NHẬP GIÁO VIÊN 📤"}
          </button>
        </div>

      </div>

      {/* Main Grid Navigation Cards corresponding to the Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => onNavigateTab(card.tab)}
            className={`bg-white rounded-[32px] border-3 ${card.border} shadow-md hover:shadow-xl transition-all cursor-pointer p-6 flex flex-col justify-between group relative overflow-hidden`}
          >
            {/* Background Light Glow */}
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-slate-100 opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${card.color} shadow-md`}>
                  {card.icon}
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-800 font-black text-[10px] rounded-full group-hover:bg-yellow-300 transition-colors">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs font-bold text-slate-500 mb-2">{card.subtitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-800 group-hover:text-amber-600">
              <span>TRUY CẬP VÀO BÊN TRONG</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
