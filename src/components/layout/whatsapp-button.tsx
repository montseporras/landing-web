"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

/** Botón flotante de WhatsApp, discreto y accesible. */
export function WhatsAppButton({ href }: { href: string }) {
  if (!href) return null;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribime por WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lifted"
    >
      <MessageCircle size={26} aria-hidden />
    </motion.a>
  );
}
