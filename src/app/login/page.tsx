"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiLogIn, FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";

export default function HalamanLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tampilkanPassword, setTampilkanPassword] = useState(false);
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangMemproses(true);
    setError("");
    setSukses(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (username === "admin" && password === "12345") {
        setSukses(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError("Username atau password salah.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSedangMemproses(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const shakeVariants: Variants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  const successVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f355d] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Enhanced Logo Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#0f355d] to-[#0a2a4a] p-8 md:p-12 flex items-center justify-center md:w-1/3"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              className="w-full h-full flex items-center justify-center"
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
            >
              <div className="relative">
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  className="w-full max-w-[200px] h-auto object-contain drop-shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-300 rounded-full blur-xl opacity-0 hover:opacity-15 -z-10"
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Form Panel */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 md:p-12 md:w-2/3"
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-bold text-gray-800 mb-1"
            >
              Selamat Datang
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-500 mb-6">
              Masuk ke akun Anda
            </motion.p>

            <AnimatePresence>
              {sukses && (
                <motion.div
                  key="sukses"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={successVariants}
                  className="bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4"
                >
                  ✅ Login berhasil! Mengarahkan ke dashboard...
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-5"
              variants={shakeVariants}
              animate={error ? "shake" : ""}
            >
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-[#0f355d] focus:ring-1 focus:ring-[#0f355d] bg-gray-50"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={tampilkanPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-gray-800 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-[#0f355d] focus:ring-1 focus:ring-[#0f355d] bg-gray-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setTampilkanPassword(!tampilkanPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {tampilkanPassword ? (
                      <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={sedangMemproses}
                  className={`w-full flex items-center justify-center gap-2 bg-[#0f355d] hover:bg-[#0a2a4a] text-white font-medium py-3 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f355d] ${
                    sedangMemproses ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {sedangMemproses ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Sedang masuk...</span>
                    </>
                  ) : (
                    <>
                      <FiLogIn />
                      <span>Masuk</span>
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="text-center text-gray-400 text-xs pt-4 border-t border-gray-100 mt-6"
            >
              &copy; {new Date().getFullYear()} Klinik Malsyah. Hak cipta
              dilindungi.
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
