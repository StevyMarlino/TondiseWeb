import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getColor } from "@/utils/colors";
import { currencyFormat } from "@/utils/helper";
import { faker } from "@faker-js/faker";
import { CreditCard, Settings2, Construction, Tag, Shirt, Briefcase, Sparkles, Minus, Plus, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export interface Category {
    icon?: any;
    label?: string;
    subCategory?: string[]
}

export interface Product {
    id: string;
    image?: string;
    name?: string;
    price?: number;
    count?: number;
    category?: string;
    subCategory?: string;
}

interface Slider {
    image?: string;
    heading1?: string;
    heading2?: string;
    buttonText?: string;
    color?: string;
}

export default function Main() {

    const transparentPngUrls = [
        "/src/assets/images/cart.png", // shopping cart
        "/src/assets/images/cart-2.png", // shopping cart
        "/src/assets/images/cart.png", // shopping cart
      ];
      
      function getRandomTransparentImage(): string {
        return (faker.helpers as any).arrayElement(transparentPngUrls);
      }

    const categories: Category[] = [
        {
            icon: <CreditCard />,
            label: "Cartes de visites",
            subCategory: [
                "Cartes standards",
                "Cartes de luxe",
                "Cartes pliées",
                "Cartes transparantes"
            ]
        },
        {
            icon: <Construction />,
            label: "Publicités",
            subCategory: [
                "Flyers",
                "Brochures",
                "Affiches",
                "Banderoles",
                "Kakemonos"
            ]
        },
        {
            icon: <Tag />,
            label: "Etiquettes & Stickers",
            subCategory: [
                "Etiquettes produits",
                "Stickers décoratifs",
                "Etiquettes industrielles",
                "Autocollants personalisés"
            ]
        },
        {
            icon: <Shirt />,
            label: "Vêtements",
            subCategory: [
                "T-shirt",
                "Pull-overs",
                "Polos",
                "Chemises",
                "Vestes",
                "Polaires et tricots"
            ]
        },
        {
            icon: <Briefcase />,
            label: "Sacs",
            subCategory: [
                "Sacs en toile",
                "Sacs en cordon",
                "Sacs à dos",
                "Sacs isothermes",
            ]
        }
    ]

    const [products, setProducts] = useState<Product[]>([])

    const getProducts = () => {
        setProducts([])
        const tProduits: Product[] = []


        for (let i = 0; i < 12; i++) {
            // find diff
            let difference = categories.length - 0;

            // generate random number 
            let rand = Math.random();

            // multiply with difference 
            rand = Math.floor( rand * difference);

            // add with min value 
            rand = rand + 0;

            tProduits.push({
                id: faker.string.uuid(),
                image: faker.image.urlPicsumPhotos(),
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({min: 500, max: 50000})),
                count: 1,
                category: categories[rand].label,
                subCategory: faker.commerce.productAdjective()
            })
        }
        setProducts(tProduits)
    }

    useEffect(()=> {
        getProducts()
    },[])

    const sliders: Slider[] = [
        {
            image: faker.image.urlLoremFlickr({category: "product"}),
            heading1: "Classic Exclusive",
            heading2: "Summer's Collection",
            buttonText: "Go Shopping",
            color: getColor("slate.50")
        },
        {
            image: faker.image.urlLoremFlickr({category: "product"}),
            heading1: "Classic Exclusive",
            heading2: "Summer's Collection",
            buttonText: "Go Shopping",
            color: getColor("pink.50")
        },
        {
            image: faker.image.urlLoremFlickr({category: "product"}),
            heading1: "Classic Exclusive",
            heading2: "Summer's Collection",
            buttonText: "Go Shopping",
            color: getColor("purple.50")
        },
        {
            image: faker.image.urlLoremFlickr({category: "product"}),
            heading1: "Classic Exclusive",
            heading2: "Summer's Collection",
            buttonText: "Go Shopping",
            color: getColor("green.50")
        }
    ]

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] bg-white dark:bg-card w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10">

            <section className="flex flex-col lg:px-6 xl:px-6 h-[600px] items-center w-full">
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                    }}
                    orientation={"horizontal"}
                    className="w-full [&>div]:!h-full [&>div]:flex-1 h-full"
                >
                    <CarouselContent className="ml-0 space-x-0.5 !overflow-visible h-full">
                    {sliders.map((slider)=> (
                        <CarouselItem key={slider.heading1} className={cn([
                            "rounded-3xl flex overflow-hidden",
                        ])} style={{ backgroundColor: slider.color}}>
                            <div className="flex flex-col w-full justify-center gap-y-4 py-20 pl-20">
                                <span className="font-medium text-3xl">{ slider.heading1 }</span>
                                <span className="font-bold text-5xl">{ slider.heading2 }</span>
                                <span className="font-medium text-3xl">Up To 40% OFF</span>

                                <Button className="w-[fit-content] rounded-lg h-12 mt-10 flex items-center gap-2">
                                    <span>{ slider.buttonText}</span>
                                    <ChevronRight />
                                </Button>
                            </div>
                            <div className="flex items-end justify-center w-full">
                                <img 
                                  src={getRandomTransparentImage()} alt=""
                                  className="w-[90%] object-cover" />
                            </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
                <div className="w-full max-w-[1000px] flex items-center justify-center space-x-3 mt-10">
                    {
                        sliders.map((item, idx)=>(
                            <div onClick={(e)=> {
                                api?.scrollTo(idx)
                            }} key={`image-${idx}`} className={cn([
                                "h-3 rounded-sm transition-all duration-500 ease-in hover:bg-neutral-400 cursor-pointer",
                                (current-1) === idx ? "bg-neutral-800 w-10":"bg-neutral-200 w-3"
                            ])}></div>
                        ))
                    }
                </div>
            </section>

            <section className="flex 2xl:px-6 gap-x-6">
                <Card className="flex flex-col flex-1 p-3 w-full gap-3 overflow-hidden border-transparent dark:border-transparent shadow-none">
                    <div className="flex items-center justify-between">
                       <span className="text-lg font-medium text-neutral-500">Categories</span>
                       <DropdownMenu>
                           <DropdownMenuTrigger>
                              <Button size="icon" variant="outline" className="bg-neutral-100 rounded-xl border-transparent size-9">
                                <Settings2 />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-[250px]">
                             {categories.map((category)=>(
                                <>
                                 <DropdownMenuItem className="flex flex-col items-start" key={category.label!}>
                                    <span className="text-neutral-500 mb-2">{ category.label }</span>
                                    {
                                        category.subCategory?.map((subCategory)=> (
                                            <span className="">{ subCategory }</span>
                                        ))
                                    }
                                 </DropdownMenuItem>
                                 {category !== categories[categories.length-1] && (<DropdownMenuSeparator />)}
                                </>
                             ))}
                           </DropdownMenuContent>
                       </DropdownMenu>
                    </div>

                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        orientation={"horizontal"}
                        className="flex-1 lg:max-w-full [&>div]:!overflow-visible"
                    >
                        <CarouselContent className="-ml-4 h-full space-x-0.5 !overflow-visible">
                            <CarouselItem className={cn([
                                "basis-1/7",
                            ])}>

                                <Button className={cn([
                                    buttonVariants({ size: "sm", variant: "outline" }),
                                    "!whitespace-pre-wrap rounded-xl !border-transparent flex !h-[auto] items-center !font-medium text-neutral-700 dark:hover:!text-black",
                                ])}>
                                    <p className="font-semibold text-neutral-950 dark:text-white/70">All Categories</p>
                                </Button>
                            </CarouselItem>
                            {categories.map((category)=> (
                                <CarouselItem key={category.label!} className={cn([
                                    "basis-1/7",
                                ])}>
    
                                    <Button className={cn([
                                        buttonVariants({ size: "sm", variant: "outline" }),
                                        "!whitespace-pre-wrap rounded-xl !border-transparent flex !h-[auto] items-center !font-medium text-neutral-700 dark:hover:!text-black",
                                    ])}>
                                        <div className="w-6 h-6 border rounded-lg flex bg-white dark:bg-white items-center justify-center">
                                          { category.icon! }
                                        </div>
                                        <p className="font-semibold text-neutral-950 dark:text-white/70">{ category.label! }</p>
                                    </Button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="grid grid-cols-12 gap-x-8 gap-y-6 mt-2">
                        {products.map((product) => (
                            <NavLink to={`/products/${product.id}`} key={product.name!} className="col-span-12 lg:col-span-3 flex flex-col gap-y-3 cursor-pointer">
                                <img src={product.image!} alt="" className="zoom-in !shadow-none w-full h-56 object-cover bg-neutral-100 dark:bg-white/10 rounded-2xl" />
                                <div className="flex flex-col">
                                    <span className="text-neutral-950 text-sm mb-1 text-neutral-950 dark:text-white/80">{ product.name }</span>
                                    <span className="text-xs text-neutral-400 dark:text-white/40 flex items-center">{ product.category } <span className="font-medium text-neutral-950 dark:text-white ml-2 mr-1">{ product.subCategory! }</span><Sparkles size={15} strokeWidth={0.5} className="fill-yellow-500 stroke-yellow-500" /></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-950 text-lg font-semibold dark:text-white/80">{currencyFormat(product.price!)} FCFA</span>
                                    <div className="flex items-center bg-neutral-100 dark:bg-white/10 rounded-xl p-1 gap-x-3">
                                        <Button variant="outline" size="icon" className="size-6 rounded-lg">
                                            <Minus />
                                        </Button>
                                        <span className="text-neutral-950 text-sm font-medium">1</span>
                                        <Button variant="default" size="icon" className="size-6 rounded-lg">
                                            <Plus />
                                        </Button>
                                    </div>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                    <div className="flex items-center justify-center pt-20">
                        <Button className="rounded-xl h-12 !px-6" variant="secondary">
                            <span className="text-md font-semibold">Loading more</span>
                        </Button>
                    </div>
                </Card>
            </section>

            <section className="flex 2xl:px-6 gap-x-10 bg-purple-50/60 p-10 items-center rounded-3xl">
                <div className="flex flex-1">
                    <span className="text-3xl">
                    Our Patners is
                    <b className="ml-2">100</b> of companies have been powered by <b>ShopUs</b>.
                    </span>
                </div>
                <div className="flex flex-1 justify-end">
                    <div className="grid grid-cols-12 gap-10 mt-2">
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/im1.png" className="w-20" />
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/im2.png" className="w-20"/>
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/im3.png" className="w-20"/>
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-4.webp" className="w-14"/>
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-5.webp" className="w-14"/>
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-6.webp" className="w-14"/>
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-7.webp" className="w-14"/>
                       </div>
                       <div className="col-span-12 lg:col-span-3 flex flex-col gap-y-3">
                            <img src="./src/assets/images/brand-img-8.webp" className="w-14"/>
                       </div>
                    </div>
                </div>
            </section>

        </div>
    )

}