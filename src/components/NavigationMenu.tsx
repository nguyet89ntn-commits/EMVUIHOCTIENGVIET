import React from "react";
import { 
  Home, 
  Grid, 
  Layers,
  Music,
  Gamepad2, 
  Bot, 
  GraduationCap, 
  UserCheck, 
  Sparkles,
  Award
} from "lucide-react";

export type NavTab = "home" | "alphabet" | "compound" | "rhymes" | "games" | "ai";

export interface StudentInfo {
  name: string;
  className: string;
  schoolName: string;
}

export interface TeacherInfo {
  name: string;
  email: string;
  schoolName: string;
}

interface NavigationMenuProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  student: StudentInfo | null;
  teacher: TeacherInfo | null;
  onOpenStudentModal: () => void;
  onOpenTeacherModal: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  currentTab,
  onSelectTab,
  student,
  teacher,
  onOpenStudentModal,
  onOpenTeacherModal,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "home", label: "TRANG CHỦ", icon: <Home className="w-5 h-5" />, color: "from-blue-500 to-indigo-600" },
    { id: "alphabet", label: "BẢNG CHỮ CÁI", icon: <Grid className="w-5 h-5" />, color: "from-pink-500 to-rose-600" },
    { id: "compound", label: "BẢNG CHỮ GHÉP", icon: <Layers className="w-5 h-5" />, color: "from-indigo-500 to-purple-600" },
    { id: "rhymes", label: "BẢNG ÂM VẦN TỔNG HỢP", icon: <Music className="w-5 h-5" />, color: "from-emerald-500 to-teal-600" },
    { id: "games", label: "GAME TIẾNG VIỆT", icon: <Gamepad2 className="w-5 h-5" />, color: "from-amber-500 to-orange-600" },
    { id: "ai", label: "AI TIẾNG VIỆT", icon: <Bot className="w-5 h-5" />, color: "from-purple-500 to-violet-600" },
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-2xl sm:rounded-full p-2.5 sm:px-6 sm:py-3 mb-6 z-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Main Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full lg:w-auto">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? item.id === "ai"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm scale-105"
                      : "bg-blue-500 text-white shadow-sm hover:bg-blue-600 scale-105"
                    : "text-slate-700 hover:bg-blue-50 rounded-full font-semibold transition-colors"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === "ai" && (
                  <span className="ml-1 px-2 py-0.5 bg-yellow-300 text-amber-950 font-black text-[10px] rounded-full animate-bounce">
                    MỚI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Role Action Buttons (HỌC SINH VUI HỌC / GIÁO VIÊN) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Học Sinh Vui Học Button */}
          <button
            onClick={onOpenStudentModal}
            className={`relative inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all transform hover:scale-105 shadow-md ${
              student
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-2 border-emerald-300 ring-2 ring-emerald-200"
                : "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 border-2 border-yellow-200"
            }`}
          >
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
            {student ? (
              <span className="flex items-center gap-1">
                <span className="max-w-[100px] truncate">{student.name}</span>
                <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-md">({student.className})</span>
              </span>
            ) : (
              <span>HỌC SINH VUI HỌC</span>
            )}
            {student && <Award className="w-4 h-4 text-yellow-300 fill-yellow-300" />}
          </button>

          {/* Giáo Viên Button */}
          <button
            onClick={onOpenTeacherModal}
            className={`relative inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all transform hover:scale-105 shadow-md ${
              teacher
                ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white border-2 border-purple-300 ring-2 ring-purple-200"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-2 border-blue-300"
            }`}
          >
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            {teacher ? (
              <span className="flex items-center gap-1">
                <span className="max-w-[110px] truncate">GV. {teacher.name}</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </span>
            ) : (
              <span>GIÁO VIÊN</span>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
