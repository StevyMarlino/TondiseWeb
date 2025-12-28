import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Category, Product } from "../Home";
import { faker } from "@faker-js/faker";
import { Bookmark, Briefcase, Check, Construction, CreditCard, Expand, Heart, Minus, Plus, Quote, RotateCcw, Shirt, ShoppingBag, ShoppingCart, Sparkles, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyFormat } from "@/utils/helper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export default function Main() {

    const [product, setProduct] = useState<{
        id: string;
        image?: string;
        name?: string;
        price?: number;
        count?: number;
        category?: string;
        subCategory?: string;
        images?: string[];
    }>()

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

    const getProducts = () => {
        setProduct(undefined)
        let tProduits = {...product} as {
            id: string;
            image?: string;
            name?: string;
            price?: number;
            count?: number;
            category?: string;
            subCategory?: string;
            images?: string[];
        }


        for (let i = 0; i < 12; i++) {
            // find diff
            let difference = categories.length - 0;

            // generate random number 
            let rand = Math.random();

            // multiply with difference 
            rand = Math.floor( rand * difference);

            // add with min value 
            rand = rand + 0;

            let tabIm: string[] = []

            for (let j=0;j<7;j++){
                tabIm.push(faker.image.urlLoremFlickr())
            }

            tProduits = {
                id: faker.string.uuid(),
                image: faker.image.urlPicsumPhotos(),
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price({min: 500, max: 50000})),
                count: 1,
                category: categories[rand].label,
                images: tabIm,
                subCategory: faker.commerce.productAdjective()
            } 
        }
        setProduct(tProduits)
    }

    useEffect(()=> {
        if (!product) getProducts()
    },[product])

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
        <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10 w">
            <section className="flex w-full gap-3">
              <div className="flex flex-col bg-white flex-1 rounded-xl p-4 gap-4">
                <img src={product ? product.image:""} alt="" className="w-full h-[590px] object-cover bg-neutral-100 dark:bg-white/10 rounded-xl" />
                <div className="flex items-center w-full h-[100px] gap-4">
                {product && product.images!.map((pd)=> (
                        <img key={pd} src={pd} alt="" className="flex !h-24 !w-64 object-cover bg-neutral-100 dark:bg-white/10 rounded-xl" />
                    ))}
                </div>
              </div>
              <div className="flex flex-col bg-white w-1/3 rounded-xl p-6 gap-4">
                <span className="text-neutral-950 text-xl font-bold mb-1 text-neutral-950 dark:text-white/80">{product ? product.name: "Loading..."}</span>
                <p className="text-justify text-xs text-neutral-700 leading-6">Termes doloribus bellicus. Termes corona cubitum collum teneo cornu averto conforto ars vito. Colligo temeritas amitto vilitas cura reiciendis curatio cura suasoria angustus.</p>
                <span className="text-neutral-500 text-lg font-semibold line-through">{currencyFormat(5609)} FCFA</span>
                <span className="text-neutral-950 text-2xl"><span className="font-bold">{ currencyFormat(product ? product.price!: 0)} FCFA </span> <span className="text-neutral-400 text-xs !font-regular">(30%OFF)</span></span>
                <span className="text-neutral-950 text-md font-medium">Size &gt; M</span>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="rounded-2xl">
                        S
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-2xl">
                        M
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-2xl">
                        L
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-2xl">
                        XL
                    </Button>
                </div>
                <span className="text-neutral-950 text-md font-medium">Colors &gt; Dark</span>
                <div className="flex items-center gap-2">
                    <Button size="icon" variant="default" className="rounded-full bg-neutral-700">
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full bg-white">
                    </Button>
                    <Button size="icon" variant="default" className="rounded-full bg-purple-500">
                    </Button>
                    <Button size="icon" variant="default" className="rounded-full bg-amber-500">
                    </Button>
                    <Button size="icon" variant="default" className="rounded-full bg-red-200">
                    </Button>
                </div>
                <div className="flex items-center bg-neutral-100 dark:bg-white/10 rounded-xl p-1 gap-x-3 w-[min-content]">
                    <Button variant="outline" size="icon" className="size-6 rounded-lg">
                        <Minus />
                    </Button>
                    <span className="text-neutral-950 text-sm font-medium">1</span>
                    <Button variant="default" size="icon" className="size-6 rounded-lg">
                        <Plus />
                    </Button>
                </div>
                <span className="text-neutral-950 text-md font-medium">Quantity</span>
                <div className="flex items-center gap-2">
                <div className="size-6 border flex items-center justify-center rounded-full">
                    <Check color="#000" size={15}/>
                </div>
                <span className="text-xs">In Stock</span>
                </div>
                <div className="flex items-center gap-2">
                <div className="size-6 border flex items-center justify-center rounded-full">
                    <Check color="#000" size={15}/>
                </div>
                <span className="text-xs">Free Delivery Available</span>
                </div>
                <div className="flex items-center gap-2">
                <div className="size-6 border flex items-center justify-center rounded-full">
                    <Check color="#000" size={15}/>
                </div>
                <span className="text-xs">Sales 10% Off Use Code: CODE123</span>
                </div>

                <div className="flex items-center gap-3 mt-4 justify-end">
                    <Button className="flex items-center text-sm gap-2 mt-3 p-2 rounded-xl w-full">
                        <ShoppingCart size={13}/>
                        <span>Add to Cart</span>
                    </Button>
                    <Button className="rounded-xl mt-3" variant="outline" size="icon">
                        <Heart />
                    </Button>
                </div>
              </div>
            </section>
        </div>
    )

}