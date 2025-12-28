import { cn } from "@/lib/utils";
import { colorSchemes, ColorSchemes, selectColorScheme, setColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function ColorSwitcher(props: {onRemoveHandler: React.EventHandler<any>, onColorHandler: React.EventHandler<any>}) {

    const dispatch = useAppDispatch();
    const colorScheme = useAppSelector(selectColorScheme);
    const darkMode = useAppSelector(selectDarkMode);
  
    const setColorSchemeClass = () => {
      const el = document.querySelectorAll("html")[0];
      el.setAttribute("class", colorScheme);
      props.onColorHandler(
        colorScheme === "theme-1" ? "#6358f7":
                        colorScheme === "theme-2" ? "#456bf6":
                        colorScheme === "theme-3" ? "#1f9560":
                        colorScheme === "theme-4" ? "#d63664":"#000000"
      )
      darkMode && el.classList.add("dark");
    };
  
    const switchColorScheme = (colorScheme: ColorSchemes) => {
      dispatch(setColorScheme(colorScheme));
      localStorage.setItem("kodeaColorScheme", colorScheme);
      setColorSchemeClass();
    };
  
    setColorSchemeClass();
    
    return (
        <Card className="flex w-[fit-content] !shadow-none space-x-2 !rounded-3xl z-[9999] p-2 items-center justify-center h-10">
            {
                colorSchemes.map((item)=> (
                    <div key={item} 
                    onClick={()=> switchColorScheme(item)}
                      className={cn([
                        "flex justify-end w-6 h-6 rounded-full ring-2 ring-offset-2 cursor-pointer hover:opacity-50 transition-all duration-200 ease-in",
                        colorScheme === item ? "ring-black dark:!ring-neutral-800":"ring-transparent dark:!ring-transparent",
                        item === "theme-1" ? "bg-[#6358f7]":
                        item === "theme-2" ? "bg-[#456bf6]":
                        item === "theme-3" ? "bg-[#1f9560]":
                        item === "theme-4" ? "bg-[#d63664]":"bg-black"
                    ])}>
                        <div className={cn([
                            "w-1/2 h-full rounded-r-full bg-white/40"
                        ])}>
                        </div>
                    </div>
                ))
            }
            
        </Card>
    )
}