import React, { useState, useEffect } from "react";
import { BannerHeader } from "./components/BannerHeader";
import { NavigationMenu, NavTab, StudentInfo, TeacherInfo } from "./components/NavigationMenu";
import { StudentTeacherModals } from "./components/StudentTeacherModals";
import { HomeView } from "./components/HomeView";
import { AlphabetView } from "./components/AlphabetView";
import { GameView } from "./components/GameView";
import { AiTutorView } from "./components/AiTutorView";
import { FooterStats } from "./components/FooterStats";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");

  // User role state
  const [student, setStudent] = useState<StudentInfo | null>(() => {
    const saved = localStorage.getItem("vuihoc_student");
    return saved ? JSON.parse(saved) : null;
  });

  const [teacher, setTeacher] = useState<TeacherInfo | null>(() => {
    const saved = localStorage.getItem("vuihoc_teacher");
    return saved ? JSON.parse(saved) : null;
  });

  // Modal visibility states
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleSaveStudent = (info: StudentInfo) => {
    setStudent(info);
    localStorage.setItem("vuihoc_student", JSON.stringify(info));
  };

  const handleSaveTeacher = (info: TeacherInfo) => {
    setTeacher(info);
    localStorage.setItem("vuihoc_teacher", JSON.stringify(info));
  };

  const handleOpenUploadModal = () => {
    if (!teacher) {
      setShowTeacherModal(true);
    } else {
      setShowUploadModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-950 pb-12">
      
      {/* Container Max Width Constraint */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-5">
        
        {/* 1. TOP 3D BANNER HEADER (Size 1280x250 proportion) */}
        <BannerHeader
          onLetterClick={(letter) => {
            // Optional letter click callback from banner
          }}
        />

        {/* 2. NAVIGATION MENU (TRANG CHỦ, BẢNG CHỮ CÁI, HỌC VẦN, GAME, AI, KHO TÀI NGUYÊN) */}
        <NavigationMenu
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          student={student}
          teacher={teacher}
          onOpenStudentModal={() => setShowStudentModal(true)}
          onOpenTeacherModal={() => setShowTeacherModal(true)}
        />

        {/* 3. MAIN TAB CONTENT VIEWS */}
        <main className="w-full min-h-[500px]">
          {currentTab === "home" && (
            <HomeView
              onNavigateTab={(tab) => setCurrentTab(tab)}
              student={student}
              teacher={teacher}
              onOpenStudentModal={() => setShowStudentModal(true)}
              onOpenTeacherModal={() => setShowTeacherModal(true)}
            />
          )}

          {currentTab === "alphabet" && <AlphabetView teacher={teacher} initialSubTab="single" />}

          {currentTab === "compound" && <AlphabetView teacher={teacher} initialSubTab="compound" />}

          {currentTab === "rhymes" && <AlphabetView teacher={teacher} initialSubTab="rhymes" />}

          {currentTab === "games" && <GameView teacher={teacher} />}

          {currentTab === "ai" && <AiTutorView />}
        </main>

        {/* 4. FOOTER STATS COUNTERS (Truy cập >= 5000, Lượt xem >= 4500, Lượt tải >= 300) */}
        <FooterStats />

      </div>

      {/* 5. MODALS FOR STUDENT IDENTIFICATION, TEACHER LOGIN, & RESOURCE UPLOAD */}
      <StudentTeacherModals
        showStudentModal={showStudentModal}
        onCloseStudentModal={() => setShowStudentModal(false)}
        onSaveStudent={handleSaveStudent}
        showTeacherModal={showTeacherModal}
        onCloseTeacherModal={() => setShowTeacherModal(false)}
        onSaveTeacher={handleSaveTeacher}
        showUploadModal={showUploadModal}
        onCloseUploadModal={() => setShowUploadModal(false)}
        teacher={teacher}
        onResourceCreated={() => {
          // Trigger refresh when resource uploaded
        }}
      />

    </div>
  );
}
