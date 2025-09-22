"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const pathname = usePathname()

  // Don't show header on landing page
  if (pathname === "/") return null

  const isAdmin = pathname.startsWith("/admin")
  const isAuth = pathname === "/login" || pathname === "/signup"
  const isMessages = pathname.startsWith("/messages")
  const isSchedule = pathname.startsWith("/schedule")
  const isFiles = pathname.startsWith("/files")

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TT</span>
              </div>
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
                    href="/dashboard"
                    className={`text-sm font-medium ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Dashboard
                  </Link>
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
                  <Link
                    href="/profile"
                    className={`text-sm font-medium ${pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Profile
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
              <Button onClick={() => (window.location.href = "/")} variant="outline" size="sm">
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
