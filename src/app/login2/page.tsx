"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiLogIn, FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setIsSuccess(false);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      if (username === "admin" && password === "12345") {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError("Username atau kata sandi salah.");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f355d] to-[#1a4b7e]">
      {/* Left: Logo and Information */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 text-white space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-48 h-48"
        >
          <Image
            src="/logo.png" // Make sure to place your logo.png in the public folder
            alt="Klinik Malsyah Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Klinik Malsyah
          </h2>
          <p className="text-lg max-w-md text-blue-100">
            Selamat datang kembali! Silakan masuk untuk mengakses sistem
            manajemen klinik kami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-10 text-blue-100 text-sm"
        >
          &copy; {new Date().getFullYear()} Klinik Malsyah. All rights reserved.
        </motion.div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-6 sm:px-12 lg:px-24 bg-white rounded-l-3xl md:rounded-none">
        <div className="max-w-md w-full mx-auto py-8 space-y-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="text-center space-y-2"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold text-gray-800"
            >
              Selamat Datang
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-500">
              Masukkan kredensial Anda untuk melanjutkan
            </motion.p>
          </motion.div>

          {/* Messages */}
          <div className="space-y-4">
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  key="success"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={successVariants}
                  className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Login berhasil! Mengarahkan ke dashboard...</span>
                  </div>
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
                  className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={shakeVariants}
            animate={error ? "shake" : ""}
          >
            {/* Username Field */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Nama Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan nama pengguna"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f355d] focus:border-[#0f355d] transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f355d] focus:border-[#0f355d] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] hover:from-[#1a4b7e] hover:to-[#0f355d] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                  isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
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
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <FiLogIn className="text-lg" />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-400 text-xs pt-4 md:hidden"
          >
            &copy; {new Date().getFullYear()} Klinik Malsyah. All rights
            reserved.
          </motion.div>
        </div>
      </div>
    </div>
  );
}
