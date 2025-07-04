"use client";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiActivity,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";

export default function DashboardPage() {
  const stats = [
    {
      title: "Pasien Terdaftar",
      value: "120",
      change: "+12% dari bulan lalu",
      icon: <FiUsers className="text-2xl" />,
      color: "text-[#0f355d]",
    },
    {
      title: "Jadwal Hari Ini",
      value: "5",
      change: "2 jadwal pagi, 3 sore",
      icon: <FiCalendar className="text-2xl" />,
      color: "text-[#3b82f6]",
    },
    {
      title: "Dokter Aktif",
      value: "3",
      change: "Semua tersedia hari ini",
      icon: <FiActivity className="text-2xl" />,
      color: "text-[#10b981]",
    },
  ];

  const upcomingAppointments = [
    {
      time: "08:30",
      patient: "Budi Santoso",
      doctor: "Dr. Ahmad",
      status: "confirmed",
    },
    {
      time: "10:15",
      patient: "Ani Wijaya",
      doctor: "Dr. Siti",
      status: "confirmed",
    },
    {
      time: "13:45",
      patient: "Citra Dewi",
      doctor: "Dr. Ahmad",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Utama</h1>
        <p className="text-gray-500 mt-1">
          Ringkasan aktivitas klinik hari ini
        </p>
      </motion.div>

      {/* Kartu Statistik */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#0f355d] hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs mt-2">{stat.change}</p>
              </div>
              <div
                className={`p-3 rounded-full ${stat.color.replace(
                  "text",
                  "bg"
                )} bg-opacity-10`}
              >
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Grid Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jadwal Mendatang */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiClock className="text-[#0f355d]" />
              Jadwal Mendatang
            </h2>
            <button className="text-sm text-[#0f355d] hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-l-4 ${
                  appointment.status === "confirmed"
                    ? "border-green-500 bg-green-50"
                    : "border-yellow-500 bg-yellow-50"
                } flex justify-between items-center`}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {appointment.patient}
                  </p>
                  <p className="text-sm text-gray-500">{appointment.doctor}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{appointment.time}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status === "confirmed"
                      ? "Dikonfirmasi"
                      : "Menunggu"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistik Cepat */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiTrendingUp className="text-[#0f355d]" />
            Statistik Cepat
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm">Pasien Baru Minggu Ini</p>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl font-bold text-[#0f355d]">8</p>
                <p className="text-sm text-green-500 flex items-center">
                  <span>↑ 2 dari minggu lalu</span>
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            <div>
              <p className="text-gray-500 text-sm">Rata-rata Waktu Tunggu</p>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl font-bold text-[#0f355d]">15m</p>
                <p className="text-sm text-green-500 flex items-center">
                  <span>↓ 5m dari bulan lalu</span>
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            <div>
              <p className="text-gray-500 text-sm">Kepuasan Pasien</p>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-2xl font-bold text-[#0f355d]">94%</p>
                <p className="text-sm text-green-500 flex items-center">
                  <span>↑ 3% dari bulan lalu</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
