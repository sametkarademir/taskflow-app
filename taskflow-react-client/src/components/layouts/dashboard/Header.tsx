import { useLocation } from "react-router-dom";

import { Search, Bell, Plus, Menu } from "lucide-react";

import { useSidebar } from "../../../contexts/sidebarContext";
import { useLocale } from "../../../features/common/hooks/useLocale";

import { Button } from "../../form/button";
import { LanguageSwitcher } from "../../../features/auth/components/LanguageSwitcher";

export const Header = () => {
  const { isMobile, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const { t } = useLocale();

  // Get page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/" || path === "/home") {
      return t("components.layouts.dashboard.sidebar.navigation.home");
    } else if (path.startsWith("/tasks")) {
      return t("components.layouts.dashboard.sidebar.navigation.tasks");
    } else if (path.startsWith("/roles")) {
      return t("components.layouts.dashboard.sidebar.navigation.roles");
    } else if (path.startsWith("/users")) {
      return t("components.layouts.dashboard.sidebar.navigation.users");
    } else if (path.startsWith("/categories")) {
      return t("components.layouts.dashboard.sidebar.navigation.categories");
    }

    return t("components.layouts.dashboard.sidebar.navigation.home");
  };

  const pageTitle = getPageTitle();

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm z-10 shrink-0">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg md:text-xl font-bold text-white">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Notifications */}
        <button className="size-9 hidden mr-2 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#6366f1]/50 transition-colors relative">
          <Bell className="text-lg md:text-xl" />
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-zinc-900" />
        </button>

      </div>
    </header>
  );
};

