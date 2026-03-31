"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  pl: { label: "Polski", flag: "🇵🇱" },
};

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-charcoal-800/60 border border-charcoal-700/40 hover:border-gold-500/30 transition-all duration-300 text-sm"
        aria-label="Select language"
        id="language-switcher"
      >
        <Globe className="w-4 h-4 text-gold-500" />
        <span className="text-cream-200 text-xs font-heading">
          {localeLabels[locale].flag}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-charcoal-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 end-0 bg-charcoal-800 border border-charcoal-700/50 rounded-xl overflow-hidden shadow-xl shadow-black/20 min-w-[160px] z-50"
          >
            {(Object.entries(localeLabels) as [Locale, typeof localeLabels.en][]).map(
              ([key, { label, flag }]) => (
                <button
                  key={key}
                  onClick={() => handleLocaleChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                    key === locale
                      ? "bg-gold-500/10 text-gold-400"
                      : "text-cream-200 hover:bg-charcoal-700/50 hover:text-gold-400"
                  }`}
                >
                  <span className="text-base">{flag}</span>
                  <span className="font-heading font-medium">{label}</span>
                  {key === locale && (
                    <span className="ms-auto w-1.5 h-1.5 rounded-full bg-gold-500" />
                  )}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
