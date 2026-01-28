import { useEffect, useMemo, useState } from "react";
import { useParams, NavLink, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/axios";

/* =======================
   Types
======================= */
interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  children?: ApiCategory[];
}

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  base_price: number;
  main_image: string;
  images?: string[];
  is_featured: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

const sortOptions = [
  { value: "popular", label: "Popularité" },
  { value: "newest", label: "Nouveautés" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "name", label: "Nom A-Z" },
];

export default function Category() {
  const { slug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sort = searchParams.get("sort") || "popular";

  /* =======================
     Fetch categories (avec sous-catégories)
  ======================== */
  useEffect(() => {
    api.get("/categories").then((res) => {
      const data = res.data.data || res.data;
      setCategories(Array.isArray(data) ? data : []);
    }).catch(err => console.error("Erreur fetch categories :", err));
  }, []);

  /* =======================
     Fetch produits de la catégorie
  ======================== */
  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    api.get(`/categories/${slug}/products`)
        .then((res) => {
          const data = res.data.data || res.data;
          setProducts(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Erreur fetch produits :", err))
        .finally(() => setIsLoading(false));
  }, [slug]);

  const currentCategory = categories.find((c) => c.slug === slug);
  const currentSubcategory = currentCategory?.children?.find(
      (s) => s.slug === subSlug
  );

  const formatPrice = (price: number) => price.toLocaleString("fr-FR");

  const handleSortChange = (value: string) => {
    setSearchParams({ sort: value });
  };

  /* =======================
     Render
  ======================== */
  return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <NavLink to="/" className="hover:text-primary">Accueil</NavLink>
          <ChevronRight className="h-4 w-4" />
          {currentCategory && (
              <>
                <NavLink to={`/category/${currentCategory.slug}`} className="hover:text-primary">
                  {currentCategory.name}
                </NavLink>
                {currentSubcategory && (
                    <>
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-neutral-900 dark:text-white">{currentSubcategory.name}</span>
                    </>
                )}
              </>
          )}
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {currentSubcategory?.name || currentCategory?.name}
            </h1>
            <p className="text-neutral-500 mt-1">{products.length} produits</p>
          </div>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Produits */}
        {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        ) : products.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              Aucun produit disponible
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                  <NavLink key={product.id} to={`/products/${product.id}`}>
                    <Card className="hover:shadow-lg transition">
                      <CardContent className="p-0">
                        <img
                            src={product.main_image}
                            alt={product.name}
                            className="aspect-square object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="font-bold mt-2">{formatPrice(product.base_price)} FCFA</p>
                        </div>
                      </CardContent>
                    </Card>
                  </NavLink>
              ))}
            </div>
        )}
      </div>
  );
}
