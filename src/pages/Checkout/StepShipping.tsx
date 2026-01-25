import { ChevronLeft, ChevronRight, Truck, Zap, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CheckoutData } from "./index";

const shippingMethods = [
  {
    id: "standard",
    name: "Livraison standard",
    description: "Livraison en 3-5 jours ouvrés",
    price: 1500,
    icon: Truck,
  },
  {
    id: "express",
    name: "Livraison express",
    description: "Livraison en 1-2 jours ouvrés",
    price: 3500,
    icon: Zap,
  },
  {
    id: "pickup",
    name: "Retrait en magasin",
    description: "Récupérez votre commande gratuitement",
    price: 0,
    icon: Store,
  },
];

interface StepShippingProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function StepShipping({
  checkoutData,
  updateCheckoutData,
  onNext,
  onPrev,
}: StepShippingProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuit";
    return `${price.toLocaleString("fr-FR")} FCFA`;
  };

  const handleMethodChange = (methodId: string) => {
    updateCheckoutData({ shippingMethod: methodId });
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={checkoutData.shippingMethod}
        onValueChange={handleMethodChange}
        className="space-y-3"
      >
        {shippingMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = checkoutData.shippingMethod === method.id;

          return (
            <label
              key={method.id}
              className={cn(
                "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <RadioGroupItem value={method.id} />
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  isSelected ? "bg-primary/10 text-primary" : "bg-neutral-100 text-neutral-500"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{method.name}</p>
                <p className="text-sm text-neutral-500">{method.description}</p>
              </div>
              <span
                className={cn(
                  "font-semibold",
                  method.price === 0 ? "text-green-600" : ""
                )}
              >
                {formatPrice(method.price)}
              </span>
            </label>
          );
        })}
      </RadioGroup>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={onNext}>
          Continuer
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export { shippingMethods };
