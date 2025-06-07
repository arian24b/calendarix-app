"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
    children: React.ReactNode
}

const protectedPaths = ["/profile", "/calendar", "/events", "/tasks", "/alarms", "/categories"]
const authPaths = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")

            const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
            const isAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

            // Handle root path
            if (pathname === "/") {
                if (!hasCompletedOnboarding) {
                    router.replace("/onboarding")
                    return
                }
                if (token) {
                    router.replace("/calendar")
                    return
                }
                router.replace("/auth/login")
                return
            }

            // Handle onboarding
            if (pathname === "/onboarding") {
                if (hasCompletedOnboarding && token) {
                    router.replace("/calendar")
                    return
                }
                setIsLoading(false)
                return
            }

            // If user is authenticated and trying to access auth pages, redirect to calendar
            if (token && isAuthPath) {
                router.replace("/calendar")
                return
            }

            // If user is not authenticated and trying to access protected pages, redirect to login
            if (!token && isProtectedPath) {
                router.replace("/auth/login")
                return
            }

            setIsLoading(false)
        }

        checkAuth()
    }, [pathname, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return <>{children}</>
}
