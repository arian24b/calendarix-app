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
  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Prevent iOS Safari overscroll
      document.documentElement.style.position = "fixed"
      document.documentElement.style.width = "100%"
      document.documentElement.style.height = "100%"
      document.documentElement.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.documentElement.style.top
      document.body.style.overflow = "auto"
      document.documentElement.style.position = ""
      document.documentElement.style.width = ""
      document.documentElement.style.height = ""
      document.documentElement.style.top = ""
      window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
    }

    return () => {
      document.body.style.overflow = "auto"
      document.documentElement.style.position = ""
      document.documentElement.style.width = ""
      document.documentElement.style.height = ""
      document.documentElement.style.top = ""
    }
  }, [isOpen])

  // Handle hardware back button on Android
  React.useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (isOpen) {
        e.preventDefault()
        onClose()
        // Push a new state to replace the one we just popped
        window.history.pushState(null, "", window.location.href)
      }
    }

    if (isOpen) {
      // Push state when opening to enable back button to close
      window.history.pushState(null, "", window.location.href)
      window.addEventListener("popstate", handleBackButton)
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 touch-none"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-auto safe-area-bottom"
            style={{ touchAction: "pan-y" }}
          >
            {/* Handle for dragging */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
