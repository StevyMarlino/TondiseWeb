import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/stores/hooks";
import { selectTopMenu } from "@/stores/topBarMenuSlice";
import { logo } from "@/utils/images"
import { Facebook, Gitlab, Instagram, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FormattedMenu, nestedMenu } from "./TopMenu/top-menu";

export default function Footer() {

    const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu>>([]);
    const topBarMenuStore = useAppSelector(selectTopMenu);
    const topBarMenu = () => nestedMenu(topBarMenuStore, location);

    useEffect(()=>{
        setFormattedMenu(topBarMenu())
       },[location.pathname])
    
    return (
        <section className="flex flex-col lg:px-20 2xl:max-w-[1200px] bg-white dark:bg-card w-screen overflow-hidden 2xl:mx-auto lg:py-10 gap-y-10">
            <div className="flex flex-1 space-x-20">
                <a href="/"
                    onClick={(e) => {
                        e.preventDefault()
                        window.scroll(0, 0)
                    }}
                    className={cn([
                        buttonVariants({ size: "sm", variant: "outline" }),
                        "!border-transparent !bg-transparent hover:!bg-transparent !h-8 lg:flex hidden !px-0"
                    ])}>
                    <img src={logo} alt="" className="w-24 rounded-md dark:invert" />
                </a>
                <nav className="items-center gap-2 lg:flex">
                    {formattedMenu.map((menu)=> (
                        <NavLink
                            key={menu.label!}
                            to={menu.pathname!}
                            onClick={(e)=> {
                                
                            }}
                            className={cn([
                                buttonVariants({ size: "sm", variant: "outline" }),
                                "rounded-xl !border-transparent flex items-center !font-semibold text-neutral-950",
                            ])}>
                            <span className="!font-semibold">{ menu.label! }</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="flex items-center justify-end flex-1 gap-x-6">
                    <a href="#">
                        <Twitter fill="#000" size={20}/>
                    </a>
                    <a href="#">
                        <Facebook fill="#000" size={20}/>
                    </a>
                    <a href="#">
                        <Instagram size={20}/>
                    </a>
                    <a href="#">
                        <Gitlab size={20}/>
                    </a>
                </div>
            </div>
            <div className="flex flex-1 space-x-20 text-neutral-500 py-10">
                <span>© 2025 2025 Tondisè
                    <a href="#" className="mx-4">Terms</a>
                    <a href="#">Privacy</a>
                    <a href="#" className="mx-4">Cookies</a>
                </span>
                <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center gap-x-4">
                        <a href="#">Investors</a>
                        <a href="#">Patners</a>
                        <a href="#">Support</a>
                    </div>
                </div>
            </div>
        </section>
    )
}