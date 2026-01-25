import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import Footer from "../footer";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { selectDarkMode, setDarkMode } from "@/stores/darkModeSlice";
import { setDarkModeClass } from "@/utils/helper";

export default function TopMenu() {
  const { scrollY } = useScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dark mode
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  setDarkModeClass(darkMode);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setShowScrollTop(y > 400);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background relative z-10 flex min-h-svh flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-10 w-10 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
