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
} from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userEmail = "admin@klinik.com";

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
    alert(`Berhasil ${type === "checkin" ? "Check In" : "Check Out"}`);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm px-4 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-30"
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

        <motion.h2
          whileHover={{ scale: 1.02 }}
          className="text-lg md:text-xl font-semibold text-[#0f355d] flex items-center gap-2"
        >
          <span>Selamat Datang</span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="hidden md:inline-block"
          >
            👋
          </motion.span>
        </motion.h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Attendance Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAttendanceModal}
          className="flex items-center gap-1 md:gap-2 bg-[#0f355d] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm shadow-md hover:bg-[#1a4b7e] transition-colors"
        >
          <FiClock className="text-sm md:text-base" />
          <span className="hidden sm:inline">Absen</span>
        </motion.button>

        {/* Notification Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
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
            className="flex items-center gap-1 md:gap-2 cursor-pointer p-1 md:p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#0f355d] flex items-center justify-center text-white">
              <FiUser className="text-sm md:text-base" />
            </div>
            <div className="text-xs md:text-sm text-gray-700 hidden md:block">
              {userEmail}
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
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100"
              >
                <motion.button
                  whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.05)" }}
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700"
                >
                  <FiLogOut />
                  <span>Logout</span>
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
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#0f355d] mb-4">
                Presensi Karyawan
              </h3>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAttendance("checkin")}
                  className="bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiClock />
                  Check In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAttendance("checkout")}
                  className="bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FiClock />
                  Check Out
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAttendanceModal(false)}
                className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
              >
                Tutup
              </motion.button>
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
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <FiAlertTriangle className="text-yellow-500 text-2xl" />
                <h3 className="text-lg font-semibold text-[#0f355d]">
                  Konfirmasi Logout
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin keluar dari sistem?
              </p>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300 flex items-center gap-2"
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
