"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <div className="p-4 flex items-center border-b">
        <button onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-medium flex-1 text-center">Privacy Policy</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="p-4 flex items-center justify-center mb-6">
        <div className="w-10 h-10 bg-[#5C6BC0] rounded flex items-center justify-center mr-2">
          <span className="text-white text-lg font-bold">C</span>
        </div>
        <span className="text-xl text-gray-700">Calendarix</span>
      </div>

      <div className="px-4 pb-4">
        <div className="prose prose-sm max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account, update your profile, create
            events, or interact with our services. This may include your name, email address, profile picture, and any
            other information you choose to provide.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to develop new features,
            and to protect Calendarix and our users.
          </p>

          <h2>3. Sharing Your Information</h2>
          <p>
            We do not share your personal information with companies, organizations, or individuals outside of
            Calendarix except in the following cases:
          </p>
          <ul>
            <li>With your consent</li>
            <li>For legal reasons</li>
            <li>With third-party service providers who work on our behalf</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We work hard to protect your information from unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>5. Changes to This Policy</h2>
          <p>
            We may change this privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page.
          </p>

          <h2>6. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at privacy@calendarix.com.</p>
        </div>
      </div>

      <BottomNav currentPath="/profile" />
    </div>
  )
}
