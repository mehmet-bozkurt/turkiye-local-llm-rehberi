import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionProps {
  id: string;
  children: ReactNode;
}

export function Section({ id, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="scroll-mt-24 py-14 first:pt-4"
    >
      {children}
    </motion.section>
  );
}
