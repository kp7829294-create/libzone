"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lock, LogOut, User, Library } from "lucide-react";
import { useState } from "react";
import { ProfileModal } from "@/components/modals/ProfileModal";
import { PasswordModal } from "@/components/modals/PasswordModal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPublic = pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/about" || pathname === "/contact";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 min-h-14 sm:min-h-16">
          <Link href="/" className="flex items-center cursor-pointer gap-2 shrink-0">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <Library className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900">Libzone</span>
          </Link>

          {isPublic || !user ? (
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/about" className={cn("text-xs sm:text-sm font-medium transition-colors shrink-0 py-2 px-2 sm:px-0 -mx-1 rounded-lg sm:rounded-none hover:bg-slate-50 sm:hover:bg-transparent", pathname === "/about" ? "text-primary" : "text-slate-600 hover:text-primary")}>
                About
              </Link>
              <Link href="/contact" className={cn("text-xs sm:text-sm font-medium transition-colors shrink-0 py-2 px-2 sm:px-0 -mx-1 rounded-lg sm:rounded-none hover:bg-slate-50 sm:hover:bg-transparent", pathname === "/contact" ? "text-primary" : "text-slate-600 hover:text-primary")}>
                Contact
              </Link>
              <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary hover:bg-blue-50 text-sm">Log in</Button>
                </Link>
              <div className="hidden md:flex items-center gap-2 sm:gap-4">
                
                <Link href="/signup">
                  <Button size="sm" className="bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-200 text-sm">Get Started</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-6 min-w-0">
              <nav className="hidden lg:flex items-center gap-1 shrink-0">
                {pathname?.startsWith("/student") ? (
                  <>
                    <Link href="/student" className={cn("px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0", pathname === "/student" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}>
                      Browse
                    </Link>
                    <Link href="/student/borrowed" className={cn("px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0", pathname === "/student/borrowed" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}>
                      My Books
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/admin" className={cn("px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0", pathname === "/admin" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}>
                      Dashboard
                    </Link>
                    <Link href="/admin/books" className={cn("px-4 py-2 text-sm font-medium rounded-full transition-colors shrink-0", pathname === "/admin/books" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50")}>
                      Inventory
                    </Link>
                  </>
                )}
              </nav>
              <DashboardUserMenu user={user} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DashboardUserMenu({ user }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-offset-2 ring-transparent hover:ring-primary/20 transition-all shrink-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatar || "/avatar-1.png"} alt={user?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4 shrink-0" />
            <span>Change Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowPassword(true)}>
            <Lock className="mr-2 h-4 w-4 shrink-0" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 shrink-0" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileModal open={showProfile} onOpenChange={setShowProfile} user={user} />
      <PasswordModal open={showPassword} onOpenChange={setShowPassword} />
    </div>
  );
}
