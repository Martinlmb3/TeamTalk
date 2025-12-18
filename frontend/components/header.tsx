"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/stores/authStore"
import { useThemeStore } from "@/stores/themeStore"

export function Header() {
  const pathname = usePathname()

  // Zustand stores - optimized selectors
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const logout = useAuthStore(state => state.logout)

  const resolvedTheme = useThemeStore(state => state.resolvedTheme)
  const mounted = useThemeStore(state => state.mounted)

  // Don't show header on landing page
  if (pathname === "/") return null

  const isAdmin = pathname.startsWith("/admin")
  const isAuth = pathname === "/login" || pathname === "/signup"
  const isMessages = pathname.startsWith("/messages")
  const isSchedule = pathname.startsWith("/schedule")
  const isFiles = pathname.startsWith("/files")

  const logoSrc = resolvedTheme === "dark"
    ? "/TeamTalk - logo - darkMode.svg"
    : "/TeamTalk - logo - lightMode.svg"

  // Logo href: if authenticated go to dashboard, otherwise go to home
  const logoHref = isAuthenticated ? "/dashboard" : "/"

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={logoHref} className="flex items-center space-x-2">
              {mounted && <Image src={logoSrc} alt="TeamTalk Logo" width={32} height={32} className="w-8 h-8" />}
              <span className="text-xl font-bold text-foreground">TeamTalk</span>
            </Link>
          </div>

          {!isAuth && (
            <nav className="hidden md:flex items-center space-x-8">
              {isAdmin ? (
                <>
                  <Link
                    href="/admin"
                    className={`text-sm font-medium ${pathname === "/admin" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/teams"
                    className={`text-sm font-medium ${pathname === "/admin/teams" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Teams
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`text-sm font-medium ${pathname === "/admin/users" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Users
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/messages"
                    className={`text-sm font-medium ${isMessages ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Messages
                  </Link>
                  <Link
                    href="/schedule"
                    className={`text-sm font-medium ${isSchedule ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Schedule
                  </Link>
                  <Link
                    href="/files"
                    className={`text-sm font-medium ${isFiles ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Files
                  </Link>
                  <Link
                    href="/pricing"
                    className={`text-sm font-medium ${pathname === "/pricing" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/support"
                    className={`text-sm font-medium ${pathname === "/support" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Support
                  </Link>
                  <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">
                    Admin
                  </Link>
                </>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuth ? (
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Home
                </Button>
              </Link>
            ) : (
              <>
                {isAuthenticated && user && (
                  <Link href="/profile">
                    <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={user.profilePicture || undefined} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Link>
                )}
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
