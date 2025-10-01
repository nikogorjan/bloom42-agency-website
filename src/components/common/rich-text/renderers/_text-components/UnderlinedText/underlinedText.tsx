'use client';

import { motion } from 'motion/react';

interface UnderlinedTextProps {
  text: string;
}

export const UnderlinedText = ({ text }: UnderlinedTextProps) => {
  return (
    <div className="inline-block">
      <span className="inline-block relative mx-1">
        {text}
        <motion.img
          src="/icons/underline.svg"
          alt="Underline"
          className="absolute left-0 bottom-[-6px] w-full h-auto"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </span>
    </div>
  );
};
