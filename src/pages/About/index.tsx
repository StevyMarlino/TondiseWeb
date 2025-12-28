import { Button } from "@/components/ui/button";
import { Check, ChevronRight, HandCoins, PackageSearch, Quote, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Blog {
    image: string;
    description: string;
    rank: number;
    name: string;
    profil: string;
}

export default function Main() {

    const [blogs, setBlogs] = useState<Blog[]>([])


    const getBlogs = () => {
        setBlogs([])
        const tBlogs: Blog[] = []
        const rank: number[] = [1, 2, 3, 5, 5]


        for (let i = 0; i < 6; i++) {

            // find diff
            let difference = rank.length - 0;

            // generate random number 
            let rand = Math.random();

            // multiply with difference 
            rand = Math.floor( rand * difference);

            // add with min value 
            rand = rand + 0;

            tBlogs.push({
                image: faker.image.personPortrait(),
                description: faker.lorem.paragraph(3),
                rank: rank[rand],
                name: faker.person.firstName(),
                profil: faker.person.jobTitle()
            })
        }
        setBlogs(tBlogs)
    }

    useEffect(()=> {
        if (blogs.length <= 0) getBlogs()
    },[])

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
        <div className="flex flex-col">
             <div className="flex items-center justify-center w-full py-20 bg-slate-100">
                <span className="text-3xl font-bold">About</span>
            </div>
            <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] w-screen overflow-hidden 2xl:mx-auto lg:py-5 gap-y-10 bg-white">
               <div className="flex items-center w-full py-20">
                   <div className="flex-1">

                   </div>
                   <div className="flex flex-col flex-1 gap-6 justify-end">
                      <span className="text-4xl font-bold">Know More About Us?</span>
                      <p className="text-justify text-sm text-neutral-700 leading-6">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It is a long established fact a that a reader will be distracted by the readable content of a page when our looking at its layout.</p>
                      <div className="flex items-center gap-2">
                        <div className="size-6 bg-neutral-800 flex items-center justify-center rounded-full">
                            <Check color="#FFFFFF" size={15}/>
                        </div>
                        <span className="text-md font-semibold">Complete Sanitization and cleaning of bathroom</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-6 bg-neutral-800 flex items-center justify-center rounded-full">
                            <Check color="#FFFFFF" size={15}/>
                        </div>
                        <span className="text-md font-semibold">when looking at its layout. It is a long established fact</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-6 bg-neutral-800 flex items-center justify-center rounded-full">
                            <Check color="#FFFFFF" size={15}/>
                        </div>
                        <span className="text-md font-semibold">Complete Sanitization and cleaning of bathroom</span>
                      </div>
                      <Button size="lg" className="w-[min-content] rounded-full mt-6">
                        <span>Contact Us</span>
                      </Button>
                   </div>
               </div>

               <section className="flex 2xl:px-6 bg-purple-50/60 p-20 items-center rounded-3xl divider-x-1 divide-x">
                    <div className="flex flex-1 flex-col items-center justify-center gap-3">
                        <div className="size-24 bg-neutral-800 flex items-center justify-center rounded-full">
                            <PackageSearch size={45} color="#fff"/>
                        </div>
                        <span className="text-2xl font-bold">Choose product</span>
                        <p className="text-neutral-500 px-10 text-center line-clamp-3">If you are going to use a passage of you need to be sure there isn't anything emc barrassing hidden in the middle</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-3">
                        <div className="size-24 bg-neutral-800 flex items-center justify-center rounded-full">
                            <HandCoins size={45} color="#fff"/>
                        </div>
                        <span className="text-2xl font-bold">Make Your Payment</span>
                        <p className="text-neutral-500 px-10 text-center line-clamp-3">Experience hassle-free online shopping with our service! Simply choose the product you want</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center gap-3">
                        <div className="size-24 bg-neutral-800 flex items-center justify-center rounded-full">
                            <Truck size={45} color="#fff"/>
                        </div>
                        <span className="text-2xl font-bold">Fast Delivery</span>
                        <p className="text-neutral-500 px-10 text-center line-clamp-3">Experience hassle-free online shopping with our service! enjoy fast delivery right to your doorstep.</p>
                    </div>
                </section>

                <section className="flex flex-col 2xl:px-6 p-20 items-center rounded-3xl">
                    
                <Carousel
                setApi={setApi}
                    opts={{
                        align: "start",
                    }}
                    orientation={"horizontal"}
                    className="w-full [&>div]:!h-full [&>div]:flex-1 h-full select-none"
                >
                    <CarouselContent>
                    {blogs.map((blog)=> (
                        <CarouselItem key={blog.name} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="flex flex-col p-6 gap-6 shadow-none">
                                <Quote />

                                <p className="text-neutral-500 line-clamp-3">{ blog.description }</p>

                                <Separator />
                                <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(star=>(
                                    <Star key={star} size={15} fill={blog.rank >= star ? "#000":"transparent"}/>
                                ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <img src={blog.image} className="size-12 rounded-full"/>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold">{ blog.name }</span>
                                        <span className="text-neutral-500">{ blog.profil }</span>
                                    </div>
                                </div>
                            </Card>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
                <div className="w-full max-w-[1000px] flex items-center justify-center space-x-3 mt-10">
                    {
                        blogs.map((item, idx)=>(
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
            </div>
        </div>
    )

}