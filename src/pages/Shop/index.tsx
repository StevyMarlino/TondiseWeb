import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { Category, Product } from "../Home";
import { faker } from "@faker-js/faker";
import { Briefcase, Construction, CreditCard, Expand, Heart, Minus, Plus, RotateCcw, Shirt, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currencyFormat } from "@/utils/helper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavLink } from "react-router-dom";

export default function Main() {

    const [products, setProducts] = useState<Product[]>([])

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

    return (
        <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10">
            <section className="flex w-full gap-3">
                <div className="flex flex-col bg-white w-64 rounded-xl">
                    <span className="font-bold text-neutral-950 text-lg p-3">Product Categories</span>
                    <Separator />
                    <div className="flex flex-col p-6 gap-8">
                        <div className="flex items-center gap-3">
                            <Checkbox id="cartes" />
                            <Label htmlFor="cartes">Cartes de visite</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Publicité" />
                            <Label htmlFor="Publicité">Publicité</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Etiquettes et stickers" />
                            <Label htmlFor="Etiquettes et stickers">Etiquettes et stickers</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Vêtements" />
                            <Label htmlFor="Vêtements">Vêtements</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Sacs" />
                            <Label htmlFor="Sacs">Sacs</Label>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col p-6 gap-8">
                        <span className="font-bold text-neutral-950 text-lg">Price Range</span>
                        <div className="flex flex-col gap-6">
                            <Slider defaultValue={[33]} max={100} step={1} />
                            <span className="text-neutral-700">Price: <b className="text-black">$40</b> - <b className="text-black">$330</b> </span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col p-6 gap-8">
                        <span className="font-bold text-neutral-950 text-lg">Brands</span>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Refined Threads" />
                            <Label htmlFor="Refined Threads">Refined Threads</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Ethereal Chic" />
                            <Label htmlFor="Ethereal Chic">Ethereal Chic</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Yellow" />
                            <Label htmlFor="Yellow">Yellow</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Esctasy" />
                            <Label htmlFor="Esctasy">Esctasy</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Urban Hive" />
                            <Label htmlFor="Urban Hive">Urban Hive</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Velvet Vista" />
                            <Label htmlFor="Velvet Vista">Velvet Vista</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Boldly Blue" />
                            <Label htmlFor="Boldly Blue">Boldly Blue</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Minted Mode" />
                            <Label htmlFor="Minted Mode">Minted Mode</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Eclectic Ensemble" />
                            <Label htmlFor="Eclectic Ensemble">Eclectic Ensemble</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="BraveAlchemy Attire" />
                            <Label htmlFor="BraveAlchemy Attire">BraveAlchemy Attire</Label>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col p-6 gap-8">
                        <span className="font-bold text-neutral-950 text-lg">Color</span>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Red" />
                            <Label htmlFor="Red">Red</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Blue" />
                            <Label htmlFor="Blue">Blue</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Navy" />
                            <Label htmlFor="Navy">Navy</Label>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex flex-col p-6 gap-8">
                        <span className="font-bold text-neutral-950 text-lg">Size</span>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Small" />
                            <Label htmlFor="Small">Small</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Medium" />
                            <Label htmlFor="Medium">Medium</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Large" />
                            <Label htmlFor="Large">Large</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="XL" />
                            <Label htmlFor="XL">XL</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="2XL" />
                            <Label htmlFor="2XL">2XL</Label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-3">
                    <div className="flex items-center bg-white p-3 rounded-xl justify-between">
                       <span className="font-semibold text-neutral-950 text-lg">Showing</span>
                       <div className="flex items-center justify-end gap-3">
                        <span className="font-medium text-neutral-950 text-md">Sort By :</span>
                        <Select>
                            <SelectTrigger className="!w-auto focus-visible:!ring-0 focus-visible:!ring-offset-0 !space-x-0 focus:!ring-0 focus:!ring-offset-0">
                                <SelectValue placeholder={"Default"} className="focus-visible:!ring-0 focus-visible:!ring-offset-0 !space-x-0 focus:!ring-0 focus:!ring-offset-0" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Default">Default</SelectItem>
                                <SelectItem value="Name">Name</SelectItem>
                                <SelectItem value="Category">Category</SelectItem>
                            </SelectContent>
                        </Select>
                       </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3">
                        {products.map((product) => (
                            <NavLink to={`/products/${product.id}`} key={product.name!} className="col-span-12 lg:col-span-3 flex flex-col gap-y-3 cursor-pointer bg-white p-3 fadein rounded-xl zoom-in">
                                <img src={product.image!} alt="" className="w-full h-56 object-cover bg-neutral-100 dark:bg-white/10 rounded-2xl" />
                                <div className="flex flex-col">
                                    <span className="text-neutral-950 text-sm mb-1 text-neutral-950 dark:text-white/80">{product.name}</span>
                                    <span className="text-xs text-neutral-400 dark:text-white/40 flex items-center">{product.category} <span className="font-medium text-neutral-950 dark:text-white ml-2 mr-1">{product.subCategory!}</span><Sparkles size={15} strokeWidth={0.5} className="fill-yellow-500 stroke-yellow-500" /></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-950 text-lg font-semibold dark:text-white/80">{currencyFormat(product.price!)} FCFA</span>
                                </div>
                                <div className="flex items-center justify-end rounded-xl p-1 gap-x-3">
                                    <Button variant="outline" size="icon" className="size-8 rounded-xl">
                                        <Expand />
                                    </Button>
                                    <Button variant="outline" size="icon" className="size-8 rounded-xl">
                                        <Heart />
                                    </Button>
                                    <Button variant="outline" size="icon" className="size-8 rounded-xl">
                                        <RotateCcw />
                                    </Button>
                                </div>
                            </NavLink>
                        ))}
                    </div>
                    <div className="flex items-center justify-center py-10">
                        <Button className="rounded-xl h-12 !px-6" variant="outline">
                            <span className="text-md font-semibold">Loading more</span>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )

}