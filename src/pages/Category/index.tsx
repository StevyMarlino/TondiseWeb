import { useState, useMemo } from "react";
import { useParams, NavLink, useSearchParams } from "react-router-dom";
import { ChevronRight, Filter, Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { categories } from "@/components/layout/Header/MegaMenu";

// Mock products pour la démo
const generateProducts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.commerce.productName(),
    slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
    basePrice: parseFloat(faker.commerce.price({ min: 5000, max: 50000 })),
    mainImage: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
    category: faker.helpers.arrayElement(["Standard", "Premium", "Luxe"]),
    rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
    reviewsCount: faker.number.int({ min: 5, max: 200 }),
  }));
};

const sortOptions = [
  { value: "popular", label: "Popularité" },
  { value: "newest", label: "Nouveautés" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "name", label: "Nom A-Z" },
];

const finishes = [
  { id: "mat", label: "Mat" },
  { id: "brillant", label: "Brillant" },
  { id: "soft-touch", label: "Soft Touch" },
  { id: "vernis", label: "Vernis sélectif" },
  { id: "gaufrage", label: "Gaufrage" },
];

const formats = [
  { id: "standard", label: "Standard" },
  { id: "carre", label: "Carré" },
  { id: "rond", label: "Rond" },
  { id: "slim", label: "Slim" },
  { id: "plie", label: "Plié" },
];

export default function Category() {
  const { slug, subSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sort = searchParams.get("sort") || "popular";

  // Trouver la catégorie actuelle
  const currentCategory = categories.find((c) => c.slug === slug);
  const currentSubcategory = currentCategory?.subcategories.find((s) => s.slug === subSlug);

  // Générer des produits mock
  const products = useMemo(() => generateProducts(12), [slug, subSlug]);

  const formatPrice = (price: number) => price.toLocaleString("fr-FR");

  const handleSortChange = (value: string) => {
    setSearchParams({ sort: value });
  };

  const toggleFinish = (finishId: string) => {
    setSelectedFinishes((prev) =>
      prev.includes(finishId)
        ? prev.filter((id) => id !== finishId)
        : [...prev, finishId]
    );
  };

  const toggleFormat = (formatId: string) => {
    setSelectedFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((id) => id !== formatId)
        : [...prev, formatId]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedFinishes([]);
    setSelectedFormats([]);
  };

  const activeFiltersCount =
    selectedFinishes.length +
    selectedFormats.length +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Prix */}
      <div>
        <h3 className="font-semibold mb-4">Prix</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          step={1000}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>{formatPrice(priceRange[0])} FCFA</span>
          <span>{formatPrice(priceRange[1])} FCFA</span>
        </div>
      </div>

      <Separator />

      {/* Formats */}
      <div>
        <h3 className="font-semibold mb-4">Format</h3>
        <div className="space-y-3">
          {formats.map((format) => (
            <div key={format.id} className="flex items-center space-x-2">
              <Checkbox
                id={format.id}
                checked={selectedFormats.includes(format.id)}
                onCheckedChange={() => toggleFormat(format.id)}
              />
              <Label htmlFor={format.id} className="text-sm cursor-pointer">
                {format.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Finitions */}
      <div>
        <h3 className="font-semibold mb-4">Finition</h3>
        <div className="space-y-3">
          {finishes.map((finish) => (
            <div key={finish.id} className="flex items-center space-x-2">
              <Checkbox
                id={finish.id}
                checked={selectedFinishes.includes(finish.id)}
                onCheckedChange={() => toggleFinish(finish.id)}
              />
              <Label htmlFor={finish.id} className="text-sm cursor-pointer">
                {finish.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full"
            onClick={clearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Effacer les filtres ({activeFiltersCount})
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <NavLink to="/" className="hover:text-primary">
          Accueil
        </NavLink>
        <ChevronRight className="h-4 w-4" />
        {currentCategory ? (
          <>
            <NavLink to={`/category/${currentCategory.slug}`} className="hover:text-primary">
              {currentCategory.label}
            </NavLink>
            {currentSubcategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-neutral-900 dark:text-white">
                  {currentSubcategory.label}
                </span>
              </>
            )}
          </>
        ) : (
          <span className="text-neutral-900 dark:text-white capitalize">
            {slug?.replace(/-/g, " ")}
          </span>
        )}
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {currentSubcategory?.label || currentCategory?.label || slug?.replace(/-/g, " ")}
          </h1>
          <p className="text-neutral-500 mt-1">
            {products.length} produits
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile filter button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View mode */}
          <div className="hidden sm:flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filtres - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <FilterSidebar />
            </CardContent>
          </Card>
        </aside>

        {/* Grille produits */}
        <div className="flex-1">
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            )}
          >
            {products.map((product) => (
              <NavLink
                key={product.id}
                to={`/products/${product.id}`}
                className={cn(
                  "group",
                  viewMode === "list" && "flex gap-4"
                )}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className={cn("p-0", viewMode === "list" && "flex")}>
                    <div
                      className={cn(
                        "relative overflow-hidden bg-neutral-100",
                        viewMode === "grid" ? "aspect-square" : "w-48 h-48 flex-shrink-0"
                      )}
                    >
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-neutral-300 fill-neutral-300"
                              )}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-neutral-500">
                          ({product.reviewsCount})
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-neutral-500">
                        À partir de
                      </p>
                      <p className="font-bold text-lg">
                        {formatPrice(product.basePrice)} FCFA
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg" className="rounded-xl">
              Charger plus de produits
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
