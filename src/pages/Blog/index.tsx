import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/helper";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";
import { Bookmark, Clock, Heart, MessagesSquare, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Blog {
    image?: string;
    titre?: string;
    description?: string;
    date?: Date;
    likes?: number;
    comments?: number;
}

export default function Main() {

    const [blogs, setBlogs] = useState<Blog[]>([])


    const getBlogs = () => {
        setBlogs([])
        const tBlogs: Blog[] = []


        for (let i = 0; i < 6; i++) {

            tBlogs.push({
                image: faker.image.urlLoremFlickr(),
                titre: faker.lorem.sentence({ min: 3, max: 5 }),
                description: faker.lorem.paragraph(10),
                date: faker.date.anytime(),
                likes: faker.number.int({min: 100, max: 1000000}),
                comments: faker.number.int({min: 100, max: 1000000})
            })
        }
        setBlogs(tBlogs)
    }

    const [blog, setBlog] = useState<Blog | undefined>(undefined)

    useEffect(()=> {
        if (blogs.length <= 0) getBlogs()
    },[])

    return (
        <div className="flex flex-col lg:px-20 2xl:max-w-[1200px] w-screen overflow-hidden 2xl:mx-auto lg:py-5 gap-y-10">
            <section className="flex w-full gap-6">
               <div className="flex flex-col flex-1 gap-3 bg-white rounded-2xl p-6">
                    {blog && (
                        <div className="flex gap-6 items-stretch mb-6">
                            <img src={blog ? blog.image : ""} alt="" className="w-[400px] h-[400px] object-cover bg-neutral-100 dark:bg-white/10 rounded-2xl" />
                            <div className="flex flex-col flex-1">
                                <span className="font-semibold text-xl">{blog.titre}</span>
                                <span className="flex items-center text-sm text-neutral-500 gap-2 mt-3">
                                    <Clock size={13}/>
                                    <span>Posted at {format(blog.date!, "dd/MM/yyyy "+"à"+" hh:mm")}</span>
                                </span>
                                <span className="flex items-center text-sm text-neutral-500 gap-2 mt-3">
                                    <UserCircle size={13}/>
                                    <span>Posted By <b className="text-neutral-950">User123</b></span>
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center text-sm gap-2 mt-3 bg-neutral-100 p-2 rounded-xl">
                                        <Heart size={13}/>
                                        <span>{formatCurrency(blog.likes!)}</span>
                                    </span>
                                    <span className="flex items-center text-sm gap-2 mt-3 bg-neutral-100 p-2 rounded-xl">
                                        <MessagesSquare size={13}/>
                                        <span>{formatCurrency(blog.comments!)}</span>
                                    </span>
                                </div>
                                <p className="mt-4 text-justify text-xs text-neutral-700 leading-6">{ blog.description }</p>
                                <div className="flex items-center gap-3 mt-4 justify-end">
                                    <Button className="rounded-xl mt-3" variant="outline" size="icon">
                                        <Heart />
                                    </Button>
                                    <Button className="flex items-center text-sm gap-2 mt-3 p-2 rounded-xl w-1/2">
                                        <Bookmark size={13}/>
                                        <span>Read more</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                        <span className="font-bold text-2xl mb-4">Most popular</span>
                        <div className="grid grid-cols-12 gap-3">
                        {blogs.map(bl=> (
                                <div onClick={(e)=> setBlog(bl)} key={bl.titre!} className="col-span-12 lg:col-span-4 flex flex-col gap-y-3 cursor-pointer bg-white p-3 fadein rounded-2xl border">
                                    <img src={bl.image!} alt="" className="w-full h-48 object-cover bg-neutral-100 dark:bg-white/10 rounded-2xl" />
                                    <div className="flex flex-col">
                                        <span className="text-neutral-950 text-md font-bold mb-1 text-neutral-950 dark:text-white/80">{bl.titre}</span>
                                        <span className="flex items-center text-xs text-neutral-500 gap-2 mt-3">
                                            <Clock size={13}/>
                                            <span>Posted at {format(bl.date!, "dd/MM/yyyy "+"à"+" hh:mm")}</span>
                                        </span>
                                        <span className="flex items-center text-xs text-neutral-500 gap-2 mt-1">
                                            <UserCircle size={13}/>
                                            <span>Posted By <b className="text-neutral-950">User123</b></span>
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center text-sm gap-2 mt-3 bg-neutral-100 p-2 rounded-xl">
                                                <Heart size={13}/>
                                                <span>{formatCurrency(bl.likes!)}</span>
                                            </span>
                                            <span className="flex items-center text-sm gap-2 mt-3 bg-neutral-100 p-2 rounded-xl">
                                                <MessagesSquare size={13}/>
                                                <span>{formatCurrency(bl.comments!)}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 justify-end">
                                            <Button className="rounded-xl mt-3" variant="outline" size="icon">
                                                <Heart />
                                            </Button>
                                            <Button className="flex items-center text-sm gap-2 mt-3 p-2 rounded-xl w-1/2">
                                                <Bookmark size={13}/>
                                                <span>Read more</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                       </div>
                    </div>
               </div>
               <div className="flex flex-col w-1/5 bg-white rounded-xl">
                  <span className="font-semibold text-neutral-950 text-lg p-3">Filter By:</span>
                  <Separator />
                    <div className="flex flex-col p-6 gap-8">
                        <div className="flex items-center gap-3">
                            <Checkbox id="cartes" />
                            <Label htmlFor="cartes">Date</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Publicité" />
                            <Label htmlFor="Publicité">Title</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="Etiquettes et stickers" />
                            <Label htmlFor="Etiquettes et stickers">Type</Label>
                        </div>
                    </div>
               </div>
            </section>
        </div>
    )

}