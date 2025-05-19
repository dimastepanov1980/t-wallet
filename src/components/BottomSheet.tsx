import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 m-0 p-0"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-4"
          >
            <div className="mb-8 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={onClose} className="bg-transparent text-gray-500">
                  ✕
                </button>
              </div>
              <h2 className="text-sm font-light">{subtitle}</h2>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 