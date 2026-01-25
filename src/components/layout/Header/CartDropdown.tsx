import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export function CartDropdown() {
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    total,
    updateQuantity,
    removeItem,
    isOpen,
    toggleCart,
    closeCart,
  } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR");
  };

  return (
    <Popover open={isOpen} onOpenChange={toggleCart}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-transparent bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[11px] font-semibold text-white flex items-center justify-center">
              {itemsCount > 99 ? "99+" : itemsCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="w-[380px] p-0 overflow-hidden"
      >
        <div className="p-4 border-b dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Mon panier</h3>
            <span className="text-sm text-neutral-500">
              {itemsCount} article{itemsCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500 text-sm mb-4">Votre panier est vide</p>
            <NavLink to="/shop" onClick={closeCart}>
              <Button variant="outline" size="sm">
                Découvrir nos produits
              </Button>
            </NavLink>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {formatPrice(item.unitPrice)} FCFA / unité
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatPrice(item.totalPrice)} FCFA
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-neutral-800 p-4 space-y-3 bg-neutral-50 dark:bg-neutral-900">
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
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)} FCFA</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <NavLink to="/cart" onClick={closeCart}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Voir le panier
                  </Button>
                </NavLink>
                <NavLink to="/checkout" onClick={closeCart}>
                  <Button className="w-full rounded-xl">
                    Commander
                  </Button>
                </NavLink>
              </div>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
