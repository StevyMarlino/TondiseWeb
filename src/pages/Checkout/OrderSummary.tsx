import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { shippingMethods } from "./StepShipping";

interface OrderSummaryProps {
  shippingMethod: string;
}

export function OrderSummary({ shippingMethod }: OrderSummaryProps) {
  const { items, subtotal, discount, promoCode } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString("fr-FR");
  };

  const shippingCost = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;
  const total = subtotal - discount + shippingCost;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Récapitulatif</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3 max-h-60 overflow-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 object-cover rounded-lg bg-neutral-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-neutral-500">Qté: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(item.totalPrice)} FCFA
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Sous-total</span>
            <span>{formatPrice(subtotal)} FCFA</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>
                Réduction
                {promoCode && (
                  <span className="ml-1 text-xs">({promoCode.code})</span>
                )}
              </span>
              <span>-{formatPrice(discount)} FCFA</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Livraison</span>
            <span>
              {shippingCost === 0 ? (
                <span className="text-green-600">Gratuit</span>
              ) : (
                `${formatPrice(shippingCost)} FCFA`
              )}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)} FCFA</span>
        </div>
      </CardContent>
    </Card>
  );
}
