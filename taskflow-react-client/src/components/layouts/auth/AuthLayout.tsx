import { Outlet } from "react-router-dom";

import { useLocale } from "../../../features/common/hooks/useLocale";

export const AuthLayout = () => {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="relative order-2 md:order-1">
          <Outlet />
        </div>

        <div className="order-1 md:order-2 space-y-6 md:space-y-8 text-left md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/70 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-300 shadow-sm shadow-black/40">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#6366f1] shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
            <span>{t("components.layouts.auth.labels.badge")}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {t("components.layouts.auth.labels.title")}
            </h1>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md">
              {t("components.layouts.auth.labels.subtitle")}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-2 max-w-xs">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-semibold text-zinc-300">
                TF
              </span>
              <div>
                <p className="font-medium text-zinc-200">
                  {t("components.layouts.auth.labels.highlightTitle")}
                </p>
                <p className="text-zinc-500">
                  {t("components.layouts.auth.labels.highlightDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

