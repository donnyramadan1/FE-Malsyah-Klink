"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiClock,
  FiBell,
  FiChevronDown,
  FiAlertTriangle,
  FiMenu,
  FiCalendar,
  FiHeart,
  FiUmbrella,
  FiLock,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [attendanceType, setAttendanceType] = useState<"izin" | "sakit" | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    role: "",
    avatarColor: "#0f355d",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formattedTime = new Intl.DateTimeFormat("id-ID", options).format(
        now
      );
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = Cookies.get("authUser");
    const storedRole = Cookies.get("authRoles");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        let roleName = "";
        if (storedRole) {
          const parsedRoles = JSON.parse(storedRole);
          roleName = parsedRoles[0].name
        }
        const hash =
          parsed?.fullName
            ?.split("")
            .reduce((acc: number, char: string) => {
              return char.charCodeAt(0) + ((acc << 5) - acc);
            }, 0) || 0;
        const color = `hsl(${Math.abs(hash) % 360}, 70%, 45%)`;

        setUserData({
          fullName: parsed?.fullName || "Pengguna",
          role: roleName || "Karyawan",
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
    Cookies.remove("authToken");
    Cookies.remove("authUser");      
    Cookies.remove("authRoles");
    Cookies.remove("authMenus");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/login");
  };

  const handleAttendanceAction = (
    type: "checkin" | "checkout" | "izin" | "sakit"
  ) => {
    if (type === "izin" || type === "sakit") {
      setAttendanceType(type);
      return;
    }

    submitAttendance(type);
  };

  const submitAttendance = (
    type: "checkin" | "checkout" | "izin" | "sakit",
    reason?: string
  ) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setShowAttendanceModal(false);
      setAttendanceType(null);
      setReason("");
      setIsSubmitting(false);

      const notification = document.createElement("div");
      let bgColor = "bg-blue-500";
      let icon = "";
      let message = type.charAt(0).toUpperCase() + type.slice(1);

      if (type === "izin" || type === "sakit") {
        message += ` (${reason})`;
      }

      switch (type) {
        case "checkin":
          bgColor = "bg-green-500";
          icon = "✓";
          break;
        case "checkout":
          bgColor = "bg-red-500";
          icon = "✗";
          break;
        case "izin":
          bgColor = "bg-yellow-500";
          icon = "📝";
          break;
        case "sakit":
          bgColor = "bg-purple-500";
          icon = "🏥";
          break;
      }

      notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${bgColor} text-white flex items-center gap-2`;
      notification.innerHTML = `<span>${icon} Berhasil ${message}!</span>`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.transition = "opacity 0.5s";
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    }, 1000);
  };

  const handleReasonSubmit = () => {
    if (!reason.trim()) return;
    if (attendanceType) {
      submitAttendance(attendanceType, reason);
    }
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

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
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

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#0f355d]/10 to-[#1a4b7e]/10 px-3 py-1.5 rounded-lg border border-[#0f355d]/20"
            >
              <FiClock className="text-[#0f355d]" />
              <div className="text-sm text-[#0f355d] font-medium">
                {currentTime}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="md:hidden text-xs text-gray-500 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FiClock size={12} />
            <span>{currentTime}</span>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAttendanceModal}
          className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm shadow-md hover:shadow-lg transition-all"
        >
          <FiClock className="text-sm md:text-base" />
          <span className="hidden sm:inline">Absen</span>
        </motion.button>

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

      <AnimatePresence>
        {showAttendanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
            onClick={() => {
              setAttendanceType(null);
              setShowAttendanceModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {!attendanceType ? (
                <>
                  <h3 className="text-xl font-bold text-[#0f355d] mb-4 flex items-center gap-2">
                    <FiClock className="text-[#0f355d]" />
                    <span>Presensi Karyawan</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAttendanceAction("checkin")}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium flex flex-col items-center justify-center gap-2 shadow-md"
                    >
                      <FiClock size={20} />
                      <span>Check In</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAttendanceAction("checkout")}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium flex flex-col items-center justify-center gap-2 shadow-md"
                    >
                      <FiClock size={20} />
                      <span>Check Out</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAttendanceAction("izin")}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-medium flex flex-col items-center justify-center gap-2 shadow-md"
                    >
                      <FiCalendar size={20} />
                      <span>Izin</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAttendanceAction("sakit")}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium flex flex-col items-center justify-center gap-2 shadow-md"
                    >
                      <FiHeart size={20} />
                      <span>Sakit</span>
                    </motion.button>

                    <motion.div className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 py-3 rounded-lg font-medium flex flex-col items-center justify-center gap-2 shadow-md cursor-not-allowed relative col-span-2">
                      <div className="absolute top-2 right-2 bg-gray-100 rounded-full p-1">
                        <FiLock size={12} className="text-gray-500" />
                      </div>
                      <FiUmbrella size={20} />
                      <span>Cuti (Segera Hadir)</span>
                      <span className="text-xs">Fitur dalam pengembangan</span>
                    </motion.div>
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
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#0f355d] flex items-center gap-2">
                      {attendanceType === "izin" ? (
                        <>
                          <FiCalendar className="text-yellow-500" />
                          <span>Form Izin</span>
                        </>
                      ) : (
                        <>
                          <FiHeart className="text-purple-500" />
                          <span>Form Sakit</span>
                        </>
                      )}
                    </h3>
                    <button
                      onClick={() => setAttendanceType(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan {attendanceType === "izin" ? "Izin" : "Sakit"}
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f355d]"
                      rows={3}
                      placeholder={`Masukkan alasan ${
                        attendanceType === "izin" ? "izin" : "sakit"
                      } Anda`}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAttendanceType(null)}
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReasonSubmit}
                      disabled={!reason.trim() || isSubmitting}
                      className={`px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 ${
                        attendanceType === "izin"
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                          : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      } disabled:opacity-70`}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="inline-block"
                          >
                            ↻
                          </motion.span>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          Submit
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
