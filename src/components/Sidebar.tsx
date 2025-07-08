"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiUsers,
  FiUserPlus,
  FiCalendar,
  FiClock,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiUserCheck,
  FiShoppingBag,
  FiCreditCard,
  FiBarChart2,
  FiHeart,
  FiDatabase,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAuthMenus } from "@/utils/auth.utils";

interface MenuItem {
  id: number;
  parentId: number | null;
  title: string;
  icon: string;
  path: string;
  orderNum: number;
  isActive: boolean;
  subItems?: MenuItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  FiHome: <FiHome className="text-lg" />,
  FiUser: <FiUser className="text-lg" />,
  FiUsers: <FiUsers className="text-lg" />,
  FiUserPlus: <FiUserPlus className="text-lg" />,
  FiCalendar: <FiCalendar className="text-lg" />,
  FiClock: <FiClock className="text-lg" />,
  FiSettings: <FiSettings className="text-lg" />,
  FiLogOut: <FiLogOut className="text-lg" />,
  FiFileText: <FiFileText className="text-lg" />,
  FiUserCheck: <FiUserCheck className="text-lg" />,
  FiShoppingBag: <FiShoppingBag className="text-lg" />,
  FiCreditCard: <FiCreditCard className="text-lg" />,
  FiBarChart2: <FiBarChart2 className="text-lg" />,
  FiHeart: <FiHeart className="text-lg" />,
  FiDatabase: <FiDatabase className="text-lg" />,
};

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const menus = getAuthMenus();
    const parentMenus = menus.filter((m: MenuItem) => m.parentId === null);
    const structured = parentMenus.map((parent: MenuItem) => ({
      ...parent,
      icon: parent.icon,
      subItems: menus.filter((m: MenuItem) => m.parentId === parent.id),
    }));
    setMenuItems(structured);
  }, []);

  const toggleSubMenu = (itemName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const isActivePath = (path: string) => {
    return pathname === path || (path !== "/" && pathname.startsWith(path));
  };

  return (
    <motion.aside className="h-full flex flex-col bg-gradient-to-b from-[#0f355d] to-[#1a4b7e] text-white shadow-xl">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 border-b border-white/10 flex justify-center"
      >
        <Link href="/" onClick={onClose} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-32 h-32"
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
          <div key={item.id} className="overflow-hidden">
            <motion.div whileHover={{ scale: 1.01 }}>
              <Link
                href={item.path}
                onClick={(e) => {
                  if (item.subItems?.length) {
                    toggleSubMenu(item.title, e);
                  } else {
                    onClose?.();
                  }
                }}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActivePath(item.path)
                    ? "bg-white text-[#0f355d] font-medium shadow-md"
                    : "hover:bg-white/10 hover:text-blue-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  {iconMap[item.icon] ?? ""}
                  {item.title}
                </div>
                {item.subItems && item.subItems.length > 0 && (
                  <motion.div
                    animate={{ rotate: expandedItems[item.title] ? 90 : 0 }}
                  >
                    <FiChevronRight className="text-sm" />
                  </motion.div>
                )}
              </Link>
            </motion.div>

            {item.subItems && item.subItems.length > 0 && (
              <AnimatePresence>
                {expandedItems[item.title] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-1 space-y-1"
                  >
                    {item.subItems.map((subItem) => (
                      <motion.div
                        key={subItem.id}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={subItem.path}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                            isActivePath(subItem.path)
                              ? "bg-white/20 text-white font-medium"
                              : "hover:bg-white/5 hover:text-blue-100"
                          }`}
                        >
                          {iconMap[subItem.icon] ?? ""}
                          {subItem.title}
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
    </motion.aside>
  );
};

export default Sidebar;
