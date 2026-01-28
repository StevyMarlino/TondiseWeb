import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Expand, Heart, Loader2, Package, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyFormat } from "@/utils/helper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavLink, useSearchParams } from "react-router-dom";
import api from "@/lib/axios";

interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

interface ApiProduct {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    base_price: string;
    main_image: string | null;
    images: string[];
    is_featured: boolean;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [sortBy, setSortBy] = useState<string>("default");

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const data = response.data.data || response.data;
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Fetch products with filters
    const fetchProducts = async (page: number = 1, append: boolean = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoadingProducts(true);
        }

        try {
            const params: Record<string, any> = {
                page,
                per_page: 12,
            };

            // Add category filter
            if (selectedCategories.length > 0) {
                params.category_id = selectedCategories[0]; // API might support single category
            }

            // Add price filter
            if (priceRange[0] > 0) {
                params.min_price = priceRange[0];
            }
            if (priceRange[1] < 100000) {
                params.max_price = priceRange[1];
            }

            // Add sorting
            if (sortBy === "name") {
                params.sort = "name";
                params.order = "asc";
            } else if (sortBy === "price_asc") {
                params.sort = "base_price";
                params.order = "asc";
            } else if (sortBy === "price_desc") {
                params.sort = "base_price";
                params.order = "desc";
            } else if (sortBy === "newest") {
                params.sort = "created_at";
                params.order = "desc";
            }

            const response = await api.get('/products', { params });

            const data = response.data.data || response.data;
            const newProducts = Array.isArray(data) ? data : [];

            if (append) {
                setProducts(prev => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            // Handle pagination meta
            if (response.data.meta) {
                setMeta(response.data.meta);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoadingProducts(false);
            setIsLoadingMore(false);
        }
    };

    // Load more products
    const loadMoreProducts = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchProducts(nextPage, true);
    };

    // Handle category toggle
    const toggleCategory = (categoryId: number) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    // Handle price range change
    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0] * 1000, value[1] * 1000]);
    };

    // Apply filters
    const applyFilters = () => {
        setCurrentPage(1);
        fetchProducts(1, false);
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 100000]);
        setSortBy("default");
        setCurrentPage(1);
        fetchProducts(1, false);
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // Re-fetch when sort changes
    useEffect(() => {
        if (!isLoadingProducts && !isLoadingCategories) {
            setCurrentPage(1);
            fetchProducts(1, false);
        }
    }, [sortBy]);

    const formatPrice = (price: string | number) => {
        const num = typeof price === "string" ? parseFloat(price) : price;
        return currencyFormat(num);
    };

    const hasMoreProducts = meta ? meta.current_page < meta.last_page : false;

    return (
        <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10">
            <section className="flex w-full gap-3">
                {/* Sidebar Filters */}
                <div className="flex flex-col bg-white w-64 rounded-xl sticky top-4 h-fit">
                    <div className="flex items-center justify-between p-3">
                        <span className="font-bold text-neutral-950 text-lg">Filtres</span>
                        <Button variant="ghost" size="sm" onClick={resetFilters}>
                            Réinitialiser
                        </Button>
                    </div>
                    <Separator />

                    {/* Categories */}
                    <div className="flex flex-col p-6 gap-4">
                        <span className="font-bold text-neutral-950 text-md">Catégories</span>
                        {isLoadingCategories ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        ) : categories.length === 0 ? (
                            <span className="text-neutral-500 text-sm">Aucune catégorie</span>
                        ) : (
                            categories.map((category) => (
                                <div key={category.id} className="flex items-center gap-3">
                                    <Checkbox
                                        id={`cat-${category.id}`}
                                        checked={selectedCategories.includes(category.id)}
                                        onCheckedChange={() => toggleCategory(category.id)}
                                    />
                                    <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                                        {category.name}
                                    </Label>
                                </div>
                            ))
                        )}
                    </div>
                    <Separator />

                    {/* Price Range */}
                    <div className="flex flex-col p-6 gap-4">
                        <span className="font-bold text-neutral-950 text-md">Fourchette de prix</span>
                        <div className="flex flex-col gap-4">
                            <Slider
                                defaultValue={[0, 100]}
                                max={100}
                                step={1}
                                onValueChange={handlePriceChange}
                            />
                            <span className="text-neutral-700 text-sm">
                                Prix: <b className="text-black">{formatPrice(priceRange[0])} FCFA</b> - <b className="text-black">{formatPrice(priceRange[1])} FCFA</b>
                            </span>
                        </div>
                    </div>
                    <Separator />

                    {/* Apply button */}
                    <div className="p-6">
                        <Button onClick={applyFilters} className="w-full">
                            Appliquer les filtres
                        </Button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex flex-col flex-1 gap-3">
                    {/* Header */}
                    <div className="flex items-center bg-white p-3 rounded-xl justify-between">
                        <span className="font-semibold text-neutral-950 text-lg">
                            {meta ? `${meta.total} produits` : "Produits"}
                        </span>
                        <div className="flex items-center justify-end gap-3">
                            <span className="font-medium text-neutral-950 text-md">Trier par :</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="!w-auto focus-visible:!ring-0 focus-visible:!ring-offset-0 !space-x-0 focus:!ring-0 focus:!ring-offset-0">
                                    <SelectValue placeholder="Par défaut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Par défaut</SelectItem>
                                    <SelectItem value="name">Nom</SelectItem>
                                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                                    <SelectItem value="newest">Plus récent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Products */}
                    {isLoadingProducts ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                            <Package className="h-16 w-16 text-neutral-300 mb-4" />
                            <p className="text-neutral-500 text-lg">Aucun produit trouvé</p>
                            <p className="text-neutral-400 text-sm mt-2">Essayez de modifier vos filtres</p>
                            <Button variant="outline" className="mt-4" onClick={resetFilters}>
                                Réinitialiser les filtres
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-12 gap-3">
                                {products.map((product) => (
                                    <NavLink
                                        to={`/products/${product.id}`}
                                        key={product.id}
                                        className="col-span-12 lg:col-span-3 flex flex-col gap-y-3 cursor-pointer bg-white p-3 rounded-xl group hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
                                            <img
                                                src={product.main_image || "/placeholder.png"}
                                                alt={product.name}
                                                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {product.is_featured && (
                                                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                                                    Vedette
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-neutral-950 text-sm mb-1 line-clamp-1">
                                                {product.name}
                                            </span>
                                            <span className="text-xs text-neutral-400 flex items-center">
                                                {product.category?.name || "Non catégorisé"}
                                                {product.is_featured && (
                                                    <>
                                                        <span className="ml-2 mr-1">Premium</span>
                                                        <Sparkles size={15} strokeWidth={0.5} className="fill-yellow-500 stroke-yellow-500" />
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-950 text-lg font-semibold">
                                                {formatPrice(product.base_price)} FCFA
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-end rounded-xl p-1 gap-x-2">
                                            <Button variant="outline" size="icon" className="size-8 rounded-xl">
                                                <Expand className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="size-8 rounded-xl">
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>

                            {/* Load more */}
                            {hasMoreProducts && (
                                <div className="flex items-center justify-center py-10">
                                    <Button
                                        className="rounded-xl h-12 !px-6"
                                        variant="outline"
                                        onClick={loadMoreProducts}
                                        disabled={isLoadingMore}
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Chargement...
                                            </>
                                        ) : (
                                            <span className="text-md font-semibold">Voir plus de produits</span>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
