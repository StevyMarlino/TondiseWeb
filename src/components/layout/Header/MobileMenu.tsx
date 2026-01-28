import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Package,
  Loader2,
  CreditCard,
  Megaphone,
  Tag,
  Shirt,
  ShoppingBag,
  Gift,
  Printer,
  PenTool,
  BookOpen,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/axios";

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryWithSubs extends ApiCategory {
  subcategories: ApiCategory[];
  subcategoriesLoaded: boolean;
}

// Icônes par catégorie
const getCategoryIcon = (slug: string, name: string) => {
  const lowerSlug = slug.toLowerCase();
  const lowerName = name.toLowerCase();

  if (lowerSlug.includes('carte') || lowerName.includes('carte') || lowerSlug.includes('card')) return <CreditCard className="h-4 w-4" />;
  if (lowerSlug.includes('market') || lowerSlug.includes('pub') || lowerName.includes('marketing') || lowerName.includes('publicité')) return <Megaphone className="h-4 w-4" />;
  if (lowerSlug.includes('etiquette') || lowerSlug.includes('sticker') || lowerName.includes('étiquette') || lowerName.includes('sticker')) return <Tag className="h-4 w-4" />;
  if (lowerSlug.includes('textile') || lowerSlug.includes('vetement') || lowerName.includes('textile') || lowerName.includes('vêtement') || lowerName.includes('t-shirt')) return <Shirt className="h-4 w-4" />;
  if (lowerSlug.includes('objet') || lowerSlug.includes('goodies') || lowerName.includes('objet') || lowerName.includes('cadeau')) return <Gift className="h-4 w-4" />;
  if (lowerSlug.includes('sac') || lowerName.includes('sac') || lowerName.includes('bag')) return <ShoppingBag className="h-4 w-4" />;
  if (lowerSlug.includes('flyer') || lowerSlug.includes('brochure') || lowerSlug.includes('affiche')) return <BookOpen className="h-4 w-4" />;
  if (lowerSlug.includes('banner') || lowerSlug.includes('rollup') || lowerSlug.includes('kakemono')) return <Flag className="h-4 w-4" />;
  if (lowerSlug.includes('impression') || lowerSlug.includes('print')) return <Printer className="h-4 w-4" />;
  if (lowerSlug.includes('design') || lowerSlug.includes('creation')) return <PenTool className="h-4 w-4" />;
  return <Package className="h-4 w-4" />;
};

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState<number | null>(null);

  // Fetch categories quand le menu s'ouvre
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen || categories.length > 0) return;
      setIsLoading(true);

      try {
        const response = await api.get('/categories');
        const data = response.data.data || response.data;
        const cats: CategoryWithSubs[] = (Array.isArray(data) ? data : []).map((cat: ApiCategory) => ({
          ...cat,
          subcategories: [],
          subcategoriesLoaded: false
        }));
        setCategories(cats);
      } catch (error) {
        console.error('Erreur fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  // Toggle et fetch des sous-catégories
  const toggleCategory = async (categoryId: number, slug: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }

    setExpandedCategory(categoryId);

    const category = categories.find(c => c.id === categoryId);
    if (!category || category.subcategoriesLoaded) return;

    setLoadingSubcategories(categoryId);
    try {
      const response = await api.get(`/categories/${slug}/subcategories`);

      // Gestion de différentes structures de réponse API
      let subcats: ApiCategory[] = [];
      if (Array.isArray(response.data?.data)) {
        subcats = response.data.data;
      } else if (Array.isArray(response.data?.subcategories)) {
        subcats = response.data.subcategories;
      } else if (Array.isArray(response.data)) {
        subcats = response.data;
      }

      setCategories(prev =>
        prev.map(c =>
          c.id === categoryId
            ? { ...c, subcategories: subcats, subcategoriesLoaded: true }
            : c
        )
      );
    } catch (error) {
      console.error('Erreur fetch sous-catégories:', error);
      setCategories(prev =>
          prev.map(c =>
              c.id === categoryId
                  ? { ...c, subcategories: [], subcategoriesLoaded: true }
                  : c
          )
      );
    } finally {
      setLoadingSubcategories(null);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedCategory(null);
  };

  return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
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
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-neutral-500 py-2">Aucune catégorie</p>
                ) : (
                    <ul className="space-y-1">
                      {categories.map((category) => (
                          <li key={category.id}>
                            <button
                                onClick={() => toggleCategory(category.id, category.slug)}
                                className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                        <span className="flex items-center gap-2">
                          {getCategoryIcon(category.slug, category.name)}
                          {category.name}
                        </span>
                              <ChevronDown
                                  className={cn(
                                      "h-4 w-4 transition-transform",
                                      expandedCategory === category.id && "rotate-180"
                                  )}
                              />
                            </button>

                            {expandedCategory === category.id && (
                                <ul className="ml-8 mt-1 space-y-1">
                                  {loadingSubcategories === category.id ? (
                                      <li className="flex items-center py-2 px-3">
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                      </li>
                                  ) : category.subcategories.length > 0 ? (
                                      <>
                                        {category.subcategories.map((sub) => (
                                            <li key={sub.id}>
                                              <NavLink
                                                  to={`/category/${sub.slug}`}
                                                  onClick={closeMenu}
                                                  className="block py-1.5 px-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
                                              >
                                                {sub.name}
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
                                      </>
                                  ) : (
                                      <li>
                                        <NavLink
                                            to={`/category/${category.slug}`}
                                            onClick={closeMenu}
                                            className="block py-1.5 px-3 text-sm text-primary font-medium"
                                        >
                                          Voir les produits
                                        </NavLink>
                                      </li>
                                  )}
                                </ul>
                            )}
                          </li>
                      ))}
                    </ul>
                )}
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
                      <NavLink to="/account" onClick={closeMenu} className="text-xs text-primary">
                        Voir mon compte
                      </NavLink>
                    </div>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <NavLink to="/auth/login" onClick={closeMenu}>
                      <Button variant="outline" className="w-full">Connexion</Button>
                    </NavLink>
                    <NavLink to="/auth/register" onClick={closeMenu}>
                      <Button className="w-full">Inscription</Button>
                    </NavLink>
                  </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
  );
}
