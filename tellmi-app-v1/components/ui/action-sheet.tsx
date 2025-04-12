"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function ActionSheet({ isOpen, onClose, children }: ActionSheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-auto"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

