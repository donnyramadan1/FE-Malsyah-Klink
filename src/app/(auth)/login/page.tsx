"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isLoading, error, isSuccess } = useAuth();

  return (
    <div
      id="login-container"
      className="min-h-screen flex bg-gradient-to-br from-[#0f355d] to-[#1a4b7e] transition-opacity duration-200"
    >
      {/* Left: Logo and Information */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 text-white space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-48 h-48"
        >
          <Image
            src="/logo.png"
            alt="Klinik Logo"
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
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isSuccess={isSuccess}
            error={error}
            variants={{
              itemVariants,
            }}
          />

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
