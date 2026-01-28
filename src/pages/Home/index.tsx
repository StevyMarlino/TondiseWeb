import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getColor } from "@/utils/colors";
import { currencyFormat } from "@/utils/helper";
import { Settings2, Sparkles, ChevronRight, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "@/lib/axios";

// Types basés sur l'API
interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parent_id: number | null;
    sort_order: number;
    children?: ApiCategory[];
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

interface Slider {
    image?: string;
    heading1?: string;
    heading2?: string;
    buttonText?: string;
    color?: string;
}

export default function Home() {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Sliders statiques (peuvent être remplacés par une API de banners plus tard)
    const sliders: Slider[] = [
        {
            image: "/src/assets/images/cart.png",
            heading1: "Impression Premium",
            heading2: "Cartes de Visite",
            buttonText: "Découvrir",
            color: getColor("slate.50")
        },
        {
            image: "/src/assets/images/cart-2.png",
            heading1: "Personnalisation",
            heading2: "T-shirts & Textiles",
            buttonText: "Commander",
            color: getColor("pink.50")
        },
        {
            image: "/src/assets/images/cart.png",
            heading1: "Marketing",
            heading2: "Flyers & Affiches",
            buttonText: "Créer",
            color: getColor("purple.50")
        },
        {
            image: "/src/assets/images/cart-2.png",
            heading1: "Événements",
            heading2: "Banderoles & Kakemonos",
            buttonText: "Explorer",
            color: getColor("green.50")
        }
    ];

    // Fetch categories from API
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

    // Fetch products from API
    const fetchProducts = async (page: number = 1, append: boolean = false) => {
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoadingProducts(true);
        }

        try {
            const response = await api.get('/products', {
                params: { page, per_page: 12 }
            });

            const data = response.data.data || response.data;
            const newProducts = Array.isArray(data) ? data : [];

            if (append) {
                setProducts(prev => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            // Check if there are more products
            const meta = response.data.meta;
            if (meta) {
                setHasMoreProducts(meta.current_page < meta.last_page);
            } else {
                setHasMoreProducts(newProducts.length === 12);
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

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!carouselApi) return;

        setCurrentSlide(carouselApi.selectedScrollSnap());
        carouselApi.on("select", () => {
            setCurrentSlide(carouselApi.selectedScrollSnap());
        });
    }, [carouselApi]);

    const formatPrice = (price: string | number) => {
        const num = typeof price === "string" ? parseFloat(price) : price;
        return currencyFormat(num);
    };

    return (
        <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] bg-white dark:bg-card w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10">

            {/* Hero Carousel */}
            <section className="flex flex-col lg:px-6 xl:px-6 h-[600px] items-center w-full">
                <Carousel
                    setApi={setCarouselApi}
                    opts={{ align: "start" }}
                    orientation="horizontal"
                    className="w-full [&>div]:!h-full [&>div]:flex-1 h-full"
                >
                    <CarouselContent className="ml-0 space-x-0.5 !overflow-visible h-full">
                        {sliders.map((slider, idx) => (
                            <CarouselItem
                                key={idx}
                                className="rounded-3xl flex overflow-hidden"
                                style={{ backgroundColor: slider.color }}
                            >
                                <div className="flex flex-col w-full justify-center gap-y-4 py-20 pl-20">
                                    <span className="font-medium text-3xl">{slider.heading1}</span>
                                    <span className="font-bold text-5xl">{slider.heading2}</span>
                                    <span className="font-medium text-3xl">Jusqu'à 40% de réduction</span>

                                    <NavLink to="/shop">
                                        <Button className="w-[fit-content] rounded-lg h-12 mt-10 flex items-center gap-2">
                                            <span>{slider.buttonText}</span>
                                            <ChevronRight />
                                        </Button>
                                    </NavLink>
                                </div>
                                <div className="flex items-end justify-center w-full">
                                    <img
                                        src={slider.image}
                                        alt=""
                                        className="w-[90%] object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Carousel dots */}
                <div className="w-full max-w-[1000px] flex items-center justify-center space-x-3 mt-10">
                    {sliders.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => carouselApi?.scrollTo(idx)}
                            className={cn(
                                "h-3 rounded-sm transition-all duration-500 ease-in hover:bg-neutral-400 cursor-pointer",
                                currentSlide === idx ? "bg-neutral-800 w-10" : "bg-neutral-200 w-3"
                            )}
                        />
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section className="flex 2xl:px-6 gap-x-6">
                <Card className="flex flex-col flex-1 p-3 w-full gap-3 overflow-hidden border-transparent dark:border-transparent shadow-none">
                    {/* Categories header */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-neutral-500">Catégories</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline" className="bg-neutral-100 rounded-xl border-transparent size-9">
                                    <Settings2 />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[250px]">
                                {isLoadingCategories ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="p-4 text-center text-neutral-500">
                                        Aucune catégorie
                                    </div>
                                ) : (
                                    categories.map((category, index) => (
                                        <div key={category.id}>
                                            <DropdownMenuItem asChild>
                                                <NavLink
                                                    to={`/category/${category.slug}`}
                                                    className="flex flex-col items-start cursor-pointer"
                                                >
                                                    <span className="font-medium">{category.name}</span>
                                                    {category.description && (
                                                        <span className="text-xs text-neutral-500">{category.description}</span>
                                                    )}
                                                </NavLink>
                                            </DropdownMenuItem>
                                            {index < categories.length - 1 && <DropdownMenuSeparator />}
                                        </div>
                                    ))
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Categories carousel */}
                    <Carousel
                        opts={{ align: "start" }}
                        orientation="horizontal"
                        className="flex-1 lg:max-w-full [&>div]:!overflow-visible"
                    >
                        <CarouselContent className="-ml-4 h-full space-x-0.5 !overflow-visible">
                            <CarouselItem className="basis-1/7">
                                <NavLink to="/shop">
                                    <Button className={cn(
                                        buttonVariants({ size: "sm", variant: "outline" }),
                                        "!whitespace-pre-wrap rounded-xl !border-transparent flex !h-[auto] items-center !font-medium text-neutral-700 dark:hover:!text-black",
                                    )}>
                                        <p className="font-semibold text-neutral-950 dark:text-white/70">Tous les produits</p>
                                    </Button>
                                </NavLink>
                            </CarouselItem>

                            {isLoadingCategories ? (
                                <CarouselItem className="basis-1/7 flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </CarouselItem>
                            ) : (
                                categories.map((category) => (
                                    <CarouselItem key={category.id} className="basis-1/7">
                                        <NavLink to={`/category/${category.slug}`}>
                                            <Button className={cn(
                                                buttonVariants({ size: "sm", variant: "outline" }),
                                                "!whitespace-pre-wrap rounded-xl !border-transparent flex !h-[auto] items-center !font-medium text-neutral-700 dark:hover:!text-black",
                                            )}>
                                                <div className="w-6 h-6 border rounded-lg flex bg-white dark:bg-white items-center justify-center">
                                                    <Package className="w-4 h-4 text-neutral-600" />
                                                </div>
                                                <p className="font-semibold text-neutral-950 dark:text-white/70">{category.name}</p>
                                            </Button>
                                        </NavLink>
                                    </CarouselItem>
                                ))
                            )}
                        </CarouselContent>
                    </Carousel>

                    {/* Products grid */}
                    <div className="grid grid-cols-12 gap-x-8 gap-y-6 mt-2">
                        {isLoadingProducts ? (
                            <div className="col-span-12 flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="col-span-12 flex flex-col items-center justify-center py-20 text-neutral-500">
                                <Package className="h-12 w-12 mb-4" />
                                <p>Aucun produit disponible</p>
                            </div>
                        ) : (
                            products.map((product) => (
                                <NavLink
                                    to={`/products/${product.id}`}
                                    key={product.id}
                                    className="col-span-12 lg:col-span-3 flex flex-col gap-y-3 cursor-pointer group"
                                >
                                    <div className="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-white/10">
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
                                        <span className="text-neutral-950 text-sm mb-1 dark:text-white/80 line-clamp-1">
                                            {product.name}
                                        </span>
                                        <span className="text-xs text-neutral-400 dark:text-white/40 flex items-center">
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
                                        <span className="text-neutral-950 text-lg font-semibold dark:text-white/80">
                                            {formatPrice(product.base_price)} FCFA
                                        </span>
                                    </div>
                                </NavLink>
                            ))
                        )}
                    </div>

                    {/* Load more button */}
                    {hasMoreProducts && products.length > 0 && (
                        <div className="flex items-center justify-center pt-20">
                            <Button
                                className="rounded-xl h-12 !px-6"
                                variant="secondary"
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
                </Card>
            </section>

            {/* Partners Section */}
            <section className="flex 2xl:px-6 gap-x-10 bg-purple-50/60 p-10 items-center rounded-3xl">
                <div className="flex flex-1">
                    <span className="text-3xl">
                        Nos partenaires :
                        <b className="ml-2">100+</b> entreprises nous font confiance pour leurs impressions.
                    </span>
                </div>
                <div className="flex flex-1 justify-end">
                    <div className="grid grid-cols-12 gap-10 mt-2">
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/im1.png" className="w-20" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/im2.png" className="w-20" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/im3.png" className="w-20" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-4.webp" className="w-14" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-5.webp" className="w-14" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-6.webp" className="w-14" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-7.webp" className="w-14" alt="Partner" />
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-8.webp" className="w-14" alt="Partner" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
