import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProductSearch } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useProductSearch(debouncedQuery);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un produit..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10 pr-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 border-transparent focus:border-primary"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 h-8 w-8 rounded-full"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Résultats de recherche */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <ul className="max-h-80 overflow-auto">
                {data.data.slice(0, 6).map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                    >
                      {product.mainImage && (
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-neutral-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-neutral-500">
                          À partir de {product.basePrice.toLocaleString()} FCFA
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {data.pagination.total > 6 && (
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full p-3 text-sm text-primary font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 border-t dark:border-neutral-800"
                >
                  Voir les {data.pagination.total} résultats
                </button>
              )}
            </>
          ) : (
            <div className="p-6 text-center text-neutral-500 text-sm">
              Aucun résultat pour "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
