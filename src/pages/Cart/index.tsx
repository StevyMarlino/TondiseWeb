import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    total,
    promoCode,
    updateQuantity,
    removeItem,
    setPromoCode,
    clearCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR");
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    try {
      // Simuler l'appel API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Pour la démo, on accepte "TONDISE10" comme code promo
      if (promoInput.toUpperCase() === "TONDISE10") {
        setPromoCode({
          code: "TONDISE10",
          discount: 10,
          type: "percentage",
        });
        toast.success("Code promo appliqué ! -10%");
      } else {
        toast.error("Code promo invalide");
      }
    } finally {
      setIsApplyingPromo(false);
      setPromoInput("");
    }
  };

  const handleRemovePromo = () => {
    setPromoCode(null);
    toast.success("Code promo retiré");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="h-24 w-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-neutral-500 mb-6">
            Découvrez nos produits et commencez à créer vos impressions personnalisées.
          </p>
          <NavLink to="/shop">
            <Button size="lg" className="rounded-xl">
              Découvrir nos produits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mon panier ({itemsCount} article{itemsCount > 1 ? "s" : ""})</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => {
            clearCart();
            toast.success("Panier vidé");
          }}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Vider le panier
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-neutral-500">
                          {formatPrice(item.unitPrice)} FCFA / unité
                        </p>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <p className="text-xs text-neutral-400 mt-1">
                            Options: {Object.values(item.selectedOptions).join(", ")}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-bold text-lg">
                        {formatPrice(item.totalPrice)} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Continuer les achats */}
          <div className="pt-4">
            <NavLink to="/shop">
              <Button variant="outline" className="rounded-xl">
                Continuer mes achats
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Code promo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Code promo</label>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">{promoCode.code}</span>
                      <span className="text-sm">
                        (-{promoCode.type === "percentage" ? `${promoCode.discount}%` : `${formatPrice(promoCode.discount)} FCFA`})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-700 hover:text-green-800 hover:bg-green-100"
                      onClick={handleRemovePromo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Entrez votre code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || !promoInput.trim()}
                    >
                      Appliquer
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Détails du prix */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Sous-total</span>
                  <span>{formatPrice(subtotal)} FCFA</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction</span>
                    <span>-{formatPrice(discount)} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Livraison</span>
                  <span className="text-neutral-500">Calculée à l'étape suivante</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)} FCFA</span>
              </div>

              <Button
                className="w-full rounded-xl h-12"
                size="lg"
                onClick={() => navigate("/checkout")}
              >
                Passer la commande
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-neutral-500 text-center">
                Paiement sécurisé • Livraison rapide
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
