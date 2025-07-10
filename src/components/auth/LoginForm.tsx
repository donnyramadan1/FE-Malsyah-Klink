"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import { FiLogIn, FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";

// Variants untuk animasi
const successMessageVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};


const checkmarkVariants: Variants = {
  hidden: { pathLength: 0 },
  visible: {
    pathLength: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut" as const,
    } as Transition,
  },
};

// Variants untuk efek shake
const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0], // Gerakan dari kiri ke kanan
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isSuccess: boolean;
  error: string; // Tambahkan prop error
  variants: {
    itemVariants: Variants;
  };
}

export default function LoginForm({
  onSubmit,
  isLoading,
  showPassword,
  setShowPassword,
  isSuccess,
  error, // Terima prop error
  variants: { itemVariants },
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(username, password);
  };

  return (
    <div className="relative">
      {/* Success Message */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            key="success-message"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={successMessageVariants}
            className="absolute -top-20 left-0 right-0 bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg text-sm z-10"
          >
            <div className="flex items-center justify-center gap-2">
              <motion.svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                initial="hidden"
                animate="visible"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkmarkVariants}
                />
              </motion.svg>
              <span>Login berhasil! Mengarahkan ke dashboard...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 relative"
        variants={shakeVariants}
        animate={error ? "shake" : ""}
        initial={false}
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
            disabled={isLoading || isSuccess}
            className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#0f355d] to-[#1a4b7e] hover:from-[#1a4b7e] hover:to-[#0f355d] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
              isLoading || isSuccess ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
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
            ) : isSuccess ? (
              <>
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
                <span>Berhasil</span>
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
    </div>
  );
}
