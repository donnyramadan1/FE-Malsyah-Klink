// components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiChevronRight,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <FiHome className="text-lg" />,
  },
  {
    name: "Pasien",
    href: "/patients",
    icon: <FiUser className="text-lg" />,
    subItems: [
      { name: "Daftar Pasien", href: "/patients/list", icon: <FiUser /> },
      { name: "Tambah Pasien", href: "/patients/add", icon: <FiUser /> },
    ],
  },
  {
    name: "Jadwal",
    href: "/schedule",
    icon: <FiCalendar className="text-lg" />,
    subItems: [
      { name: "Kalender", href: "/schedule/calendar", icon: <FiCalendar /> },
      {
        name: "Janji Temu",
        href: "/schedule/appointments",
        icon: <FiCalendar />,
      },
    ],
  },
];

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSubMenu = (itemName: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <motion.aside className="h-full flex flex-col bg-gradient-to-b from-[#0f355d] to-[#1a4b7e] text-white shadow-xl">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 border-b border-white/10 hover:text-blue-200 transition-colors flex justify-center"
      >
        <Link href="/" onClick={onClose} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-32 h-32" // Sesuaikan ukuran sesuai kebutuhan
          >
            <Image
              src="/logo.png"
              alt="Logo Klinik Malsyah"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </Link>
      </motion.div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name} className="overflow-hidden">
            <motion.div whileHover={{ scale: 1.01 }}>
              <Link
                href={item.href}
                onClick={onClose} // Tambahkan ini untuk menutup sidebar saat item diklik
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === item.href
                    ? "bg-white text-[#0f355d] font-medium shadow-md"
                    : "hover:bg-white/10 hover:text-blue-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.name}
                </div>
                {item.subItems && (
                  <motion.div
                    animate={{ rotate: expandedItems[item.name] ? 90 : 0 }}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubMenu(item.name);
                    }}
                  >
                    <FiChevronRight />
                  </motion.div>
                )}
              </Link>
            </motion.div>

            {item.subItems && (
              <AnimatePresence>
                {expandedItems[item.name] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-1 space-y-1"
                  >
                    {item.subItems.map((subItem) => (
                      <motion.div
                        key={subItem.name}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={subItem.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                            pathname === subItem.href
                              ? "bg-white/20 text-white font-medium"
                              : "hover:bg-white/5 hover:text-blue-100"
                          }`}
                        >
                          {subItem.icon}
                          {subItem.name}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <motion.div
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <FiSettings />
          <span>Pengaturan Akun</span>
        </motion.div>
        <motion.div
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white cursor-pointer"
        >
          <FiLogOut />
          <span>Keluar</span>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
