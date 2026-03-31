"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Layers */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video1.mp4" type="video/mp4" />
        </video>

        {/* Base gradient / Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950/80 via-charcoal-950/70 to-charcoal-900/60" />

        {/* Geometric accent shapes */}
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-gradient-to-bl from-gold-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 start-0 w-[500px] h-[500px] bg-gradient-to-tr from-gold-600/4 to-transparent rounded-full blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Floating gold orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 end-1/4 w-2 h-2 bg-gold-500/30 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 start-1/3 w-3 h-3 bg-gold-500/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 start-1/5 w-1.5 h-1.5 bg-gold-400/25 rounded-full blur-sm"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Brand label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block text-xs font-heading font-semibold tracking-[0.4em] uppercase text-gold-500/80 mb-8">
            AMP EMPIRE
          </span>
        </motion.div>

        {/* Main Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
        >
          <span className="text-cream-100">{t("tagline").split(" ").slice(0, -2).join(" ")}</span>{" "}
          <span className="text-gradient-gold">
            {t("tagline").split(" ").slice(-2).join(" ")}
          </span>
        </motion.h1>

        {/* Gold Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="gold-line max-w-32 mx-auto mb-6"
        />

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-charcoal-400 font-light tracking-wider uppercase mb-10 font-heading"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Button href="/contact" size="lg">
            {t("cta")}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-heading tracking-[0.3em] uppercase text-charcoal-500">
          {t("scrollDown")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-gold-500/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
