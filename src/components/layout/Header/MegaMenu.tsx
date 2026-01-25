import { cn } from "@/lib/utils";
import { CreditCard, Megaphone, Tag, Shirt, ShoppingBag, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface CategoryItem {
  slug: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  subcategories: { slug: string; label: string }[];
}

const categories: CategoryItem[] = [
  {
    slug: "cartes-de-visite",
    label: "Cartes de visite",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Cartes professionnelles pour votre business",
    subcategories: [
      { slug: "standard", label: "Cartes standards" },
      { slug: "premium", label: "Cartes premium" },
      { slug: "luxe", label: "Cartes de luxe" },
      { slug: "pliees", label: "Cartes pliées" },
      { slug: "rondes", label: "Cartes rondes" },
    ],
  },
  {
    slug: "marketing",
    label: "Marketing & Publicité",
    icon: <Megaphone className="h-5 w-5" />,
    description: "Supports marketing pour promouvoir votre activité",
    subcategories: [
      { slug: "flyers", label: "Flyers" },
      { slug: "brochures", label: "Brochures" },
      { slug: "affiches", label: "Affiches" },
      { slug: "depliants", label: "Dépliants" },
      { slug: "banderoles", label: "Banderoles" },
      { slug: "rollups", label: "Roll-ups" },
    ],
  },
  {
    slug: "etiquettes-stickers",
    label: "Étiquettes & Stickers",
    icon: <Tag className="h-5 w-5" />,
    description: "Personnalisez vos produits",
    subcategories: [
      { slug: "etiquettes-produits", label: "Étiquettes produits" },
      { slug: "stickers", label: "Stickers personnalisés" },
      { slug: "autocollants", label: "Autocollants" },
      { slug: "etiquettes-rouleaux", label: "Étiquettes en rouleaux" },
    ],
  },
  {
    slug: "textile",
    label: "Textile & Vêtements",
    icon: <Shirt className="h-5 w-5" />,
    description: "Habillez votre équipe avec style",
    subcategories: [
      { slug: "t-shirts", label: "T-shirts" },
      { slug: "polos", label: "Polos" },
      { slug: "sweats", label: "Sweats & Hoodies" },
      { slug: "casquettes", label: "Casquettes" },
      { slug: "tabliers", label: "Tabliers" },
    ],
  },
  {
    slug: "objets-publicitaires",
    label: "Objets publicitaires",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Goodies et objets promotionnels",
    subcategories: [
      { slug: "mugs", label: "Mugs" },
      { slug: "stylos", label: "Stylos" },
      { slug: "sacs", label: "Sacs" },
      { slug: "carnets", label: "Carnets" },
      { slug: "calendriers", label: "Calendriers" },
    ],
  },
];

export function MegaMenu() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10">
            Nos produits
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[800px] grid-cols-3 gap-4 p-6">
              {categories.map((category) => (
                <div key={category.slug} className="space-y-3">
                  <NavLink
                    to={`/category/${category.slug}`}
                    className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white hover:text-primary transition-colors"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {category.icon}
                    </span>
                    {category.label}
                  </NavLink>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {category.description}
                  </p>
                  <ul className="space-y-1">
                    {category.subcategories.slice(0, 4).map((sub) => (
                      <li key={sub.slug}>
                        <NavLink
                          to={`/category/${category.slug}/${sub.slug}`}
                          className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
                        >
                          {sub.label}
                        </NavLink>
                      </li>
                    ))}
                    {category.subcategories.length > 4 && (
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
                </div>
              ))}
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

export { categories };
