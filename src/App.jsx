import React, { useState } from "react";
import { initialUser, adminUser, notificationsList } from "./data/mockData";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import GlobalSearchModal from "./components/GlobalSearchModal";
import NotificationsDrawer from "./components/NotificationsDrawer";
import ProfileModal from "./components/ProfileModal";
import Chatbot from "./components/Chatbot";
import Toast from "./components/Toast";

import LandingPage from "./views/LandingPage";
import AuthView from "./views/AuthView";
import DashboardView from "./views/DashboardView";
import TimetableModule from "./views/TimetableModule";
import NotesModule from "./views/NotesModule";
import InternshipsModule from "./views/InternshipsModule";
import StudyGroupsModule from "./views/StudyGroupsModule";
import LostFoundModule from "./views/LostFoundModule";
import EventsModule from "./views/EventsModule";
import ClubsModule from "./views/ClubsModule";
import AdminDashboardView from "./views/AdminDashboardView";

export default function App() {
  // Authentication & User State
  // Default to initialUser logged in for immediate showcase, with seamless sign-out & landing page access
  const [user, setUser] = useState(initialUser);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [authIsRegister, setAuthIsRegister] = useState(false);

  // Navigation State
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals & Drawers State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState(notificationsList);

  // Global Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLogin = (newUser) => {
    setUser(newUser);
    setShowAuthScreen(false);
    setActiveView("dashboard");
    showToast(`Welcome back, ${newUser.name.split(" ")[0]}!`, "success");
  };

  const handleLogout = () => {
    setUser(null);
    setProfileModalOpen(false);
    setShowAuthScreen(false);
    showToast("Signed out successfully.", "info");
  };

  const handleSwitchRole = () => {
    if (user?.role === "admin") {
      setUser(initialUser);
      showToast("Switched to Student Persona (Harsh Desai)", "info");
    } else {
      setUser(adminUser);
      showToast("Switched to Faculty Administrator Persona (Er. Fardeen Shaikh)", "info");
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // View Routing
  const renderCurrentView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            user={user}
            onNavigate={(viewKey) => setActiveView(viewKey)}
            onOpenSearch={() => setSearchModalOpen(true)}
            showToast={showToast}
          />
        );
      case "timetable":
        return <TimetableModule user={user} showToast={showToast} />;
      case "notes":
        return <NotesModule user={user} showToast={showToast} />;
      case "internships":
        return <InternshipsModule user={user} showToast={showToast} />;
      case "studygroups":
        return <StudyGroupsModule user={user} showToast={showToast} />;
      case "lostfound":
        return <LostFoundModule user={user} showToast={showToast} />;
      case "events":
        return <EventsModule user={user} showToast={showToast} />;
      case "clubs":
        return <ClubsModule user={user} showToast={showToast} />;
      case "admin":
        return <AdminDashboardView user={user} showToast={showToast} />;
      default:
        return (
          <DashboardView
            user={user}
            onNavigate={(viewKey) => setActiveView(viewKey)}
            onOpenSearch={() => setSearchModalOpen(true)}
            showToast={showToast}
          />
        );
    }
  };

  // If user is not logged in: Show Landing Page or Auth View
  if (!user) {
    if (showAuthScreen) {
      return (
        <AuthView
          initialIsRegister={authIsRegister}
          onLogin={handleLogin}
          onBackToHome={() => setShowAuthScreen(false)}
        />
      );
    }
    return (
      <LandingPage
        onLogin={handleLogin}
        onGoToAuth={(isRegister = false) => {
          setAuthIsRegister(isRegister);
          setShowAuthScreen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Desktop & Mobile Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={(viewKey) => setActiveView(viewKey)}
        user={user}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Top Navbar */}
        <Navbar
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onSwitchRole={handleSwitchRole}
          unreadCount={unreadCount}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      <BottomNav
        activeView={activeView}
        onNavigate={(viewKey) => setActiveView(viewKey)}
        onOpenMenu={() => setSidebarOpen(true)}
      />

      {/* 4. Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={(viewKey) => setActiveView(viewKey)}
        showToast={showToast}
      />

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        setNotifications={setNotifications}
        onNavigate={(viewKey) => setActiveView(viewKey)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUpdateUser={(updated) => setUser(updated)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        showToast={showToast}
      />

      {/* 5. Floating Interactive Campus Assistant */}
      <Chatbot user={user} onNavigate={(viewKey) => setActiveView(viewKey)} />

      {/* 6. Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
