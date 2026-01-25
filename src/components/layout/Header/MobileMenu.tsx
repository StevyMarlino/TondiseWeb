import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { categories } from "./MegaMenu";
import { useAuthStore } from "@/stores/authStore";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  const toggleCategory = (slug: string) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedCategory(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-4 border-b dark:border-neutral-800">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <nav className="flex-1 overflow-auto py-4">
            {/* Catégories */}
            <div className="px-4 mb-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Catégories
              </p>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <button
                      onClick={() => toggleCategory(category.slug)}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {category.icon}
                        {category.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedCategory === category.slug && "rotate-180"
                        )}
                      />
                    </button>
                    {expandedCategory === category.slug && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {category.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <NavLink
                              to={`/category/${category.slug}/${sub.slug}`}
                              onClick={closeMenu}
                              className="block py-1.5 px-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                        <li>
                          <NavLink
                            to={`/category/${category.slug}`}
                            onClick={closeMenu}
                            className="block py-1.5 px-3 text-sm text-primary font-medium"
                          >
                            Voir tout
                          </NavLink>
                        </li>
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Liens rapides */}
            <div className="px-4 border-t dark:border-neutral-800 pt-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Liens utiles
              </p>
              <ul className="space-y-1">
                <li>
                  <NavLink
                    to="/shop"
                    onClick={closeMenu}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Tous les produits
                    <ChevronRight className="h-4 w-4" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blog"
                    onClick={closeMenu}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Blog
                    <ChevronRight className="h-4 w-4" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    onClick={closeMenu}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Contact
                    <ChevronRight className="h-4 w-4" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    onClick={closeMenu}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    À propos
                    <ChevronRight className="h-4 w-4" />
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>

          {/* Footer du menu */}
          <div className="p-4 border-t dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{user?.full_name || `${user?.first_name} ${user?.last_name}`}</p>
                  <NavLink
                    to="/account"
                    onClick={closeMenu}
                    className="text-xs text-primary"
                  >
                    Voir mon compte
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <NavLink to="/auth/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </NavLink>
                <NavLink to="/auth/register" onClick={closeMenu}>
                  <Button className="w-full">
                    Inscription
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
