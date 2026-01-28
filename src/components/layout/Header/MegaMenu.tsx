import { cn } from "@/lib/utils";
import {
  CreditCard,
  Megaphone,
  Tag,
  Shirt,
  ShoppingBag,
  ChevronRight,
  Loader2,
  Package,
  Printer,
  Gift,
  PenTool,
  BookOpen,
  Flag,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  children?: ApiCategory[];
}

const getCategoryIcon = (slug: string, name: string) => {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();

  if (s.includes("carte") || n.includes("carte") || s.includes("card"))
    return <CreditCard className="h-5 w-5" />;
  if (s.includes("market") || s.includes("pub") || n.includes("marketing"))
    return <Megaphone className="h-5 w-5" />;
  if (s.includes("etiquette") || s.includes("sticker"))
    return <Tag className="h-5 w-5" />;
  if (s.includes("textile") || s.includes("vetement") || n.includes("t-shirt"))
    return <Shirt className="h-5 w-5" />;
  if (s.includes("objet") || s.includes("goodies"))
    return <Gift className="h-5 w-5" />;
  if (s.includes("sac") || n.includes("bag"))
    return <ShoppingBag className="h-5 w-5" />;
  if (s.includes("flyer") || s.includes("brochure") || s.includes("affiche"))
    return <BookOpen className="h-5 w-5" />;
  if (s.includes("banner") || s.includes("rollup") || s.includes("kakemono"))
    return <Flag className="h-5 w-5" />;
  if (s.includes("impression") || s.includes("print"))
    return <Printer className="h-5 w-5" />;
  if (s.includes("design") || s.includes("creation"))
    return <PenTool className="h-5 w-5" />;

  return <Package className="h-5 w-5" />;
};

/* =======================
   MegaMenu
======================= */

export function MegaMenu() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        const data = response.data.data ?? response.data;
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur chargement catégories :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getGridCols = () => {
    if (categories.length <= 2) return "grid-cols-2";
    if (categories.length <= 3) return "grid-cols-3";
    if (categories.length <= 4) return "grid-cols-4";
    return "grid-cols-3";
  };

  const getWidth = () => {
    if (categories.length <= 2) return "500px";
    if (categories.length <= 3) return "700px";
    return "900px";
  };

  return (
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10">
              Nos produits
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <div
                  className={cn("grid gap-4 p-6", getGridCols())}
                  style={{ width: getWidth(), minWidth: "500px" }}
              >
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-neutral-500">
                      Aucune catégorie disponible
                    </div>
                ) : (
                    categories.map((category) => (
                        <div key={category.id} className="space-y-3">
                          <NavLink
                              to={`/category/${category.slug}`}
                              className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white hover:text-primary transition-colors"
                          >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {getCategoryIcon(category.slug, category.name)}
                      </span>
                            {category.name}
                          </NavLink>

                          {category.description && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                {category.description}
                              </p>
                          )}

                          {/* Sous-catégories */}
                          {category.children && category.children.length > 0 && (
                              <ul className="space-y-1">
                                {category.children.slice(0, 4).map((sub) => (
                                    <li key={sub.id}>
                                      <NavLink
                                          to={`/category/${sub.slug}`}
                                          className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
                                      >
                                        {sub.name}
                                      </NavLink>
                                    </li>
                                ))}

                                {category.children.length > 4 && (
                                    <li>
                                      <NavLink
                                          to={`/category/${category.slug}`}
                                          className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                                      >
                                        Voir tout <ChevronRight className="h-3 w-3" />
                                      </NavLink>
                                    </li>
                                )}
                              </ul>
                          )}
                        </div>
                    ))
                )}
              </div>

              <div className="border-t bg-neutral-50 dark:bg-neutral-900 p-4">
                <NavLink
                    to="/shop"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Voir tous les produits <ChevronRight className="h-4 w-4" />
                </NavLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
  );
}
