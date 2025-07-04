// components/Header.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiUser,
  FiClock,
  FiBell,
  FiChevronDown,
  FiAlertTriangle,
  FiMenu,
  FiSettings,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    role: "",
    avatarColor: "#0f355d", // Default color
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        // Generate a consistent color based on user's name
        const hash =
          parsed.user.fullName
            ?.split("")
            .reduce((acc: number, char: string) => {
              return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0) || 0;
        const color = `hsl(${Math.abs(hash) % 360}, 70%, 45%)`;

        setUserData({
          fullName: parsed.user.fullName || "Pengguna",
          role: parsed.roles.name || "Karyawan",
          avatarColor: color,
        });
      } catch (err) {
        console.error("Gagal parse authData:", err);
      }
    }
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleAttendanceModal = () =>
    setShowAttendanceModal(!showAttendanceModal);

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setShowLogoutConfirm(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authData");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/login");
  };

  const handleAttendance = (type: "checkin" | "checkout") => {
    setShowAttendanceModal(false);
    // Add floating notification
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
      type === "checkin" ? "bg-green-500" : "bg-red-500"
    } text-white flex items-center gap-2`;
    notification.innerHTML = `
      <span>Berhasil ${type === "checkin" ? "Check In" : "Check Out"}!</span>
    `;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.transition = "opacity 0.5s";
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm px-4 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-30 border-b border-gray-100"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-gray-600"
          onClick={onMenuToggle}
        >
          <FiMenu size={24} />
        </motion.button>

        <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
          <h2 className="text-lg md:text-xl font-semibold text-[#0f355d] flex items-center gap-2">
            <span>Selamat Datang</span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="hidden md:inline-block"
            >
              👋
            </motion.span>
          </h2>
          <p className="text-xs text-gray-500">Hari yang produktif!</p>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Attendance Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAttendanceModal}
          className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm shadow-md hover:shadow-lg transition-all"
        >
          <FiClock className="text-sm md:text-base" />
          <span className="hidden sm:inline">Absen</span>
        </motion.button>

        {/* Notification Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative cursor-pointer p-1 md:p-2 rounded-full hover:bg-gray-100"
        >
          <FiBell className="text-gray-600 text-lg md:text-xl" />
          <motion.span
            className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={toggleDropdown}
            className="flex items-center gap-1 md:gap-2 cursor-pointer p-1 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div
              className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: userData.avatarColor }}
            >
              {userData.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-gray-800 leading-tight">
                {userData.fullName}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {userData.role.toLowerCase()}
              </div>
            </div>
            <motion.div animate={{ rotate: showDropdown ? 180 : 0 }}>
              <FiChevronDown className="text-gray-500 text-sm md:text-base" />
            </motion.div>
          </motion.div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-800">
                    {userData.fullName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {userData.role.toLowerCase()}
                  </div>
                </div>

                <motion.button
                  whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.05)" }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100"
                >
                  <FiUser />
                  <span>Profil Saya</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.05)" }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100"
                >
                  <FiSettings />
                  <span>Pengaturan</span>
                </motion.button>

                <motion.button
                  whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.05)" }}
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500"
                >
                  <FiLogOut />
                  <span>Keluar</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Attendance Modal */}
      <AnimatePresence>
        {showAttendanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
            onClick={() => setShowAttendanceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#0f355d] mb-4 flex items-center gap-2">
                <FiClock className="text-[#0f355d]" />
                <span>Presensi Karyawan</span>
              </h3>

              <div className="flex flex-col gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAttendance("checkin")}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <FiClock />
                  Check In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAttendance("checkout")}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
                >
                  <FiClock />
                  Check Out
                </motion.button>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAttendanceModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  Tutup
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <FiAlertTriangle className="text-red-500 text-xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Konfirmasi Logout
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Anda akan keluar dari sistem. Pastikan semua pekerjaan Anda
                sudah disimpan.
              </p>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-70 flex items-center gap-2 transition-colors"
                >
                  {isLoggingOut ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block"
                      >
                        ↻
                      </motion.span>
                      Memproses...
                    </>
                  ) : (
                    "Ya, Logout"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
