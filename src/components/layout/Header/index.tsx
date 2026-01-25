import { NavLink } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MegaMenu } from "./MegaMenu";
import { SearchBar } from "./SearchBar";
import { CartDropdown } from "./CartDropdown";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { useAuthStore } from "@/stores/authStore";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-950/80",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile menu */}
          <MobileMenu />

          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Tondisè</span>
          </NavLink>

          {/* Mega Menu - Desktop */}
          <MegaMenu />

          {/* Navigation links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary"
                )
              }
            >
              Boutique
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary"
                )
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary"
                )
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Search bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Favoris - Desktop uniquement */}
            {isAuthenticated && (
              <NavLink to="/account/favorites" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-transparent bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </NavLink>
            )}

            {/* Panier */}
            <CartDropdown />

            {/* User menu */}
            <UserMenu />
          </div>
        </div>

        {/* Search bar - Mobile */}
        <div className="lg:hidden pb-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

export { MegaMenu } from "./MegaMenu";
export { SearchBar } from "./SearchBar";
export { CartDropdown } from "./CartDropdown";
export { UserMenu } from "./UserMenu";
export { MobileMenu } from "./MobileMenu";
