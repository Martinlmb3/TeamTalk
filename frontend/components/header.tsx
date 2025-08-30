"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  // Don't show header on landing page
  if (pathname === "/") return null

  const isAdmin = pathname.startsWith("/admin")
  const isAuth = pathname === "/login" || pathname === "/signup"

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="text-xl font-bold text-gray-900">TeamTalk</span>
            </Link>
          </div>

          {!isAuth && (
            <nav className="hidden md:flex items-center space-x-8">
              {isAdmin ? (
                <>
                  <Link
                    href="/admin"
                    className={`text-sm font-medium ${pathname === "/admin" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/teams"
                    className={`text-sm font-medium ${pathname === "/admin/teams" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                  >
                    Teams
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`text-sm font-medium ${pathname === "/admin/users" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                  >
                    Users
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium ${pathname === "/dashboard" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                  >
                    Dashboard
                  </Link>
                  <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                </>
              )}
            </nav>
          )}

          <div className="flex items-center space-x-4">
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
