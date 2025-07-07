"use client";

import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

export default function ProtectedNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center mt-32 text-center text-gray-600 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-red-100 text-red-500 rounded-full p-4 mb-6 shadow-md"
      >
        <FiAlertTriangle size={48} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-5xl font-bold mb-4 text-gray-800"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-lg max-w-md"
      >
        Halaman tidak ditemukan atau Anda tidak memiliki akses untuk melihat
        halaman ini.
      </motion.p>

      <motion.a
        href="/"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
      >
        Kembali ke Beranda
      </motion.a>
    </motion.div>
  );
}
