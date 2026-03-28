import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  PlusCircle,
  MessageSquare,
  LayoutDashboard,
  Users2,
  User2,
  WalletCards,
  Settings,
} from "lucide-react";

const MobileBottomNavbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isHiding, setIsHiding] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHiding(true);
      } else {
        setIsHiding(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "home", label: "Pano", href: "/pano", icon: LayoutDashboard },
    {
      id: "appointments",
      label: "Takvim",
      href: "/pano/randevular",
      icon: Calendar,
    },
    {
      id: "customers",
      label: "Müşteriler",
      href: "/pano/musteriler",
      icon: Users2,
    },
    {
      id: "staffs",
      label: "Personel",
      href: "/pano/personel",
      icon: User2,
    },
    {
      id: "services",
      label: "Hizmetler",
      href: "/pano/hizmetler",
      icon: WalletCards,
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: Settings,
    },
  ];

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 z-50 bg-linear-to-r from-blue-600 to-blue-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <PlusCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {!isHiding && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg z-40"
          >
            <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto border rounded-2xl ml-2 mr-2 border-gray-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      relative flex flex-col items-center justify-center flex-1 py-1
                      transition-all duration-200 group
                      ${isActive ? "text-blue-600" : "text-gray-500"}
                    `}
                  >
                    <div className="relative">
                      <Icon
                        size={22}
                        className={`
                          transition-all duration-200
                          ${isActive ? "scale-110 text-blue-600" : "group-hover:scale-105 group-hover:text-gray-700"}
                        `}
                      />
                    </div>

                    <span
                      className={`text-xs mt-1 font-medium transition-colors duration-200 ${isActive ? "text-blue-600" : "text-gray-500"}`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileBottomNavbar;
