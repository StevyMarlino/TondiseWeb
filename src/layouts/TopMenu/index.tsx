import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currencyFormat, setDarkModeClass } from "@/utils/helper";
import { ico, logo } from "@/utils/images";
import { ArrowUp, ChevronRight, Contrast, Heart, LucideShoppingCart, Minus, Plus, Search, Settings2, ShoppingBag, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScroll } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { selectDarkMode, setDarkMode } from "@/stores/darkModeSlice";
import { FormattedMenu, nestedMenu } from "./top-menu";
import { selectTopMenu } from "@/stores/topBarMenuSlice";
import { Input } from "@/components/ui/input";
import { faker } from "@faker-js/faker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Category, Product } from "@/pages/Home";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Footer from "../footer";

export default function TopMenu() {

    const [open, setOpen] = useState<boolean>(false)

    const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu>>([]);
    const topBarMenuStore = useAppSelector(selectTopMenu);
    const topBarMenu = () => nestedMenu(topBarMenuStore, location);
    const [user, setUser] = useState<{image: string; name: string; email: string}>({
        image: faker.image.personPortrait(),
        name: faker.person.firstName(),
        email: faker.internet.email()
    })
    

    // get queryParams of router
    const [params, setSearchParams] = useSearchParams()

    const locale = useTranslation();

    const isMobile = useIsMobile()

    const { scrollY } = useScroll();
    const [sY, setSY] = useState(0)

    useEffect(()=> {
        const unsubscribe = scrollY.on("change", (y) => {
            setSY(y)
        });

       return () => unsubscribe()
    },[sY])

    // dispatch
   const dispatch = useAppDispatch();

   // Dark mode slice
   const darkMode = useAppSelector(selectDarkMode);

   // Set default mode or current mode
   setDarkModeClass(darkMode);

   const switchMode = () => {
    dispatch(setDarkMode(!darkMode));
    setDarkModeClass(!darkMode);
   };

   useEffect(()=>{
    setFormattedMenu(topBarMenu())
   },[location.pathname])

    const categories: Category[] = [
        {
            label: "Cartes de visites"
        },
        {
            label: "Publicités"
        },
        {
            label: "Etiquettes & Stickers"
        },
        {
            label: "Vêtements"
        },
        {
            label: "Sacs"
        }
    ]

    const [products, setProducts] = useState<Product[]>([])

    const getProducts = () => {
        setProducts([])
        const tProduits: Product[] = []


        for (let i = 0; i < 7; i++) {
            // find diff
            let difference = categories.length - 0;

            // generate random number 
            let rand = Math.random();

            // multiply with difference 
            rand = Math.floor( rand * difference);

            // add with min value 
            rand = rand + 0;

            tProduits.push({
                image: faker.image.urlPicsumPhotos(),
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({min: 500, max: 5000})),
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

    return (
        <div className={cn([
            "bg-background relative z-10 flex min-h-svh flex-col",
        ])}>
            <header className={cn([
                "sticky top-0 z-50 w-full backdrop-blur bg-card dark:bg-card"
            ])}>
                <div className="container-wrapper 3xl:fixed:px-0 px-6">
                    <div className="3xl:fixed:container flex h-[56px] items-center gap-2 **:data-[slot=separator]:!h-4 2xl:w-[1200px] lg:px-10 2xl:mx-auto">
                        <a href="/"
                            onClick={(e)=> {
                                e.preventDefault()
                                window.scroll(0, 0)
                            }}
                            className={cn([
                                buttonVariants({ size: "sm", variant: "outline" }),
                                "!border-transparent !bg-transparent hover:!bg-transparent !h-8 lg:flex hidden"
                            ])}>
                            <img src={logo} alt="" className="w-32 rounded-md dark:invert" />
                        </a>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger className="flex items-center lg:hidden" asChild>
                                <Button variant="outline" size="sm" className="!border-transparent !bg-transparent !px-0 flex items-center dark:focus:!bg-transparent dark:hover:!bg-transparent">
                                    <div className="relative flex h-8 w-4 items-center justify-center">
                                        <div className="relative size-4">
                                            <span className={cn([
                                                "bg-neutral-900 absolute left-0 block h-0.5 w-4 transition-all duration-100",
                                                open ? "top-[0.4rem] -rotate-45":"top-1"
                                            ])}></span>
                                            <span className={cn([
                                                "bg-neutral-900 absolute left-0 block h-0.5 w-4 transition-all duration-100",
                                                open ? "top-[0.4rem] rotate-45":"top-2.5"
                                            ])}></span>
                                        </div>
                                        <span className="sr-only">Toggle Menu</span>
                                    </div>
                                    <span className="flex h-8 items-center text-lg leading-none font-medium">Menu</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-screen mt-0 !border-transparent flex flex-col gap-12 overflow-auto px-6 py-6">
                                <div className="flex flex-col gap-4">
                                    <div className="text-muted-foreground text-sm font-medium">Menu</div>
                                    <div className="flex flex-col gap-3">
                                        <a href="#projects"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setOpen(false)
                                            }} className="text-2xl font-medium">{ locale.i18n.t('projects') }</a>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <div className="lg:flex hidden items-center text-muted-foreground px-1 text-center !text-xs leading-loose sm:text-sm flex-wrap justify-center mr-10">
                         <div className="bg-neutral-100 dark:bg-white/10 w-[400px] rounded-full flex items-center px-1 gap-x-1">
                              <Input placeholder="What are you looking for ?" className="bg-transparent dark:bg-transparent flex-1 !ring-0 focus:!ring-0 !border-transparent focus:!ring-offset-0"/>
                              
                              <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="outline" size="sm" className="flex items-center h-8 bg-transparent dark:bg-transparent !py-0 pr-1 pl-2 gap-1 text-sm border-transparent rounded-xl hover:bg-neutral-200 focus:bg-neutral-200 focus-visible:bg-neutral-200">
                                            <span>Categories</span>
                                            <ChevronRight />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            All Categories
                                        </DropdownMenuItem>
                                        {categories.map((category)=>(
                                            <DropdownMenuItem key={category.label!}>
                                                { category.label! }
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                              <Button size="icon" className="flex rounded-full size-8">
                                 <Search />
                              </Button>
                         </div>
                        </div>
                        <nav className="items-center gap-0.5 hidden lg:flex">
                            {formattedMenu.map((menu)=> (
                                <NavLink
                                    key={menu.label!}
                                    to={menu.pathname!}
                                    onClick={(e)=> {
                                        
                                    }}
                                    className={cn([
                                        buttonVariants({ size: "sm", variant: "outline" }),
                                        "rounded-xl !border-transparent flex items-center !font-semibold",
                                        menu.active ? "text-neutral-950 dark:text-white":"text-neutral-800 dark:text-white/50"
                                    ])}>
                                    <span className="!font-semibold">{ menu.label! }</span>
                                </NavLink>
                            ))}
                        </nav>
                        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
                           <div className="flex items-center gap-2">
                               <Button
                                    onClick={(e)=> {
                                        
                                    }}
                                    className={cn([
                                        buttonVariants({ size: "icon", variant: "outline" }),
                                        "rounded-xl !border-transparent flex items-center !font-medium text-neutral-600 dark:text-white/80 bg-neutral-100",
                                    ])}>
                                        <Heart />
                                </Button>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="flex items-start justify-end">
                                            <Button
                                                onClick={(e) => {

                                                }}
                                                className={cn([
                                                    buttonVariants({ size: "icon", variant: "outline" }),
                                                    "rounded-xl !border-transparent flex items-center !font-medium text-neutral-600 dark:text-white/80 bg-neutral-100",
                                                ])}>
                                                <LucideShoppingCart />
                                                
                                            </Button>
                                            <div className="w-[fit-content] bg-primary text-xs absolute -mr-1 -mt-1 cursor-pointer text-white font-semibold px-1 rounded-md">{ products.length }</div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent side="bottom" align="end" className="w-[400px] !overflow-auto space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-medium text-neutral-500">Order Details</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Ordered menu</span>
                                            <span className="text-sm font-medium text-neutral-400">12 items</span>
                                        </div>
                                        <Card className="shadow-none rounded-2xl border-transparent dark:border-transparent overflow-auto max-h-[300px]">
                                            {products.map((product)=> (
                                                <div key={product.name!} className="flex space-x-3 hover:bg-neutral-100 p-3 rounded-2xl relative">
                                                    <img src={product.image!} className="size-14 object-cover bg-neutral-100 dark:bg-white/10 rounded-xl" />
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-neutral-950 text-sm text-neutral-950 dark:text-white/80 w-[80%] text-ellipsis overflow-hidden whitespace-nowrap">{ product.name }</span>
                                                        <span className="text-xs text-neutral-400 dark:text-white/40 flex items-center">{currencyFormat(product.price!)} FCFA x4</span>
                                                        <div className="flex items-center justify-end w-[fit-content] bg-neutral-100 dark:bg-white/10 rounded-xl gap-x-3">
                                                            <Button variant="outline" size="icon" className="size-4 rounded-md">
                                                                <Minus size={18} />
                                                            </Button>
                                                            <span className="text-neutral-950 text-sm font-medium">1</span>
                                                            <Button variant="default" size="icon" className="size-4 rounded-md">
                                                                <Plus size={18}/>
                                                            </Button>
                                                            <Trash2 size={15} className="absolute -mr-6 text-red-500 cursor-pointer"/>
                                                        </div>
                                                    </div>
                                                    <span className="text-neutral-950 text-md font-semibold dark:text-white/80 text-right">{currencyFormat(product.price!*4)} FCFA</span>
                                                </div>
                                            ))}
                                        </Card>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Payments Details</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-neutral-400">Subtotal</span>
                                            <span className="text-sm font-medium">{ currencyFormat(150000) } FCFA</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-neutral-400">Taxes</span>
                                            <span className="text-sm font-medium">5%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-neutral-400">Additional fee</span>
                                            <span className="text-sm font-medium">-</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Total</span>
                                            <span className="text-sm font-medium">{ currencyFormat(150000+(150000*0.05)) } FCFA</span>
                                        </div>
                                        <Button className="w-full rounded-3xl h-12">
                                            Confirm
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                           </div>
                           <div className="border-neutral-200 border rounded-full flex items-center p-1 pr-5 gap-x-2 justify-center">
                             <img src={user.image} alt="" className="size-8 bg-neutral-200 rounded-full" />
                             <div className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold leading-none">{ user.name }</span>
                                <span className="text-[10px] font-regular text-neutral-500 leading-none">Account</span>
                             </div>
                           </div>
                            {/**<Button 
                              variant="outline"
                              size="icon"
                              onClick={switchMode}
                             className={cn([
                                 "rounded-lg !border-transparent !h-8"
                            ])}>
                                <Contrast />
                            </Button> */}
                        </div>
                    </div>
                </div>
            </header>
            <Outlet />
            <Footer />
           {
            sY > 0 && (
                <Button 
                onClick={(e)=>{
                    window.scroll(0, 0)
                }} className="w-8 h-8 rounded-xl fixed bottom-[20px] right-[20px] fadein !z-[999999]"
                variant="default"
                size="icon"
                >
                    <ArrowUp />
                </Button>
            )
           }
        </div>
    )
}

//