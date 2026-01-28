import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AccountLayout } from "./AccountLayout";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import api from "@/lib/axios";

interface FavoriteProduct {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    sale_price: string | null;
    image: string | null;
    in_stock: boolean;
  };
  created_at: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      const data = response.data.data || response.data || [];
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (favoriteId: number) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      toast.success("Produit retiré des favoris");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (favorite: FavoriteProduct) => {
    const product = favorite.product;
    const price = product.sale_price
      ? parseFloat(product.sale_price)
      : parseFloat(product.price);

    addItem({
      productId: product.id,
      name: product.name,
      unitPrice: price,
      totalPrice: price,
      image: product.image || "/placeholder.png",
      quantity: 1,
    });
    toast.success("Produit ajouté au panier");
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return num.toLocaleString("fr-FR");
  };

  return (
    <AccountLayout
      title="Mes favoris"
      description="Vos produits enregistrés"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.product;
            const hasDiscount = product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price);

            return (
              <div
                key={favorite.id}
                className="bg-white dark:bg-neutral-900 rounded-xl border overflow-hidden group"
              >
                {/* Image */}
                <NavLink to={`/products/${product.id}`} className="block relative">
                  <div className="aspect-square bg-neutral-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-12 w-12 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                      Promo
                    </span>
                  )}
                  {!product.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-neutral-900 px-3 py-1 rounded text-sm font-medium">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                </NavLink>

                {/* Content */}
                <div className="p-4">
                  <NavLink
                    to={`/products/${product.id}`}
                    className="block font-medium hover:text-primary transition-colors line-clamp-2"
                  >
                    {product.name}
                  </NavLink>

                  <div className="flex items-center gap-2 mt-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.sale_price!)} FCFA
                        </span>
                        <span className="text-sm text-neutral-400 line-through">
                          {formatPrice(product.price)} FCFA
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        {formatPrice(product.price)} FCFA
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      size="sm"
                      disabled={!product.in_stock}
                      onClick={() => handleAddToCart(favorite)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setRemovingId(favorite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border">
          <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
          <p className="text-neutral-500 mb-6">
            Vous n'avez pas encore de produits favoris
          </p>
          <NavLink to="/shop">
            <Button>Découvrir nos produits</Button>
          </NavLink>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!removingId} onOpenChange={() => setRemovingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer des favoris ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ce produit sera retiré de vos favoris.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removingId && handleRemove(removingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountLayout>
  );
}
