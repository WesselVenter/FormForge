'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Layout, 
  Zap, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Forms', href: '/dashboard/forms', icon: FileText },
  { name: 'Templates', href: '/dashboard/templates', icon: Layout },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Zap },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-medium flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-800">FormForge</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-medium transition-colors duration-150 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-small font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/forms/new"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Form</span>
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-medium hover:bg-neutral-50 transition-colors duration-150">
                <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-neutral-600" />
                </div>
                <span className="hidden sm:block text-small font-medium text-neutral-700">
                  {session?.user?.name || session?.user?.email}
                </span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-large shadow-lg border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                <div className="py-2">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-small text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2 border-neutral-200" />
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-2 px-4 py-2 text-small text-neutral-700 hover:bg-neutral-50 transition-colors duration-150 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-neutral-200 bg-white">
        <div className="px-4 py-2">
          <div className="flex space-x-4 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-medium whitespace-nowrap transition-colors duration-150 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-small font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}