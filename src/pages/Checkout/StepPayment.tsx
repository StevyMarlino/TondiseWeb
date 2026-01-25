import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, Smartphone, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CheckoutData } from "./index";
import { useCart } from "@/hooks/useCart";
import api from "@/lib/axios";

const paymentMethods = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Visa, Mastercard, etc.",
    icon: CreditCard,
  },
  {
    id: "mobile_money",
    name: "Mobile Money",
    description: "MTN MoMo, Orange Money",
    icon: Smartphone,
  },
];

interface StepPaymentProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
  onPrev: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

export function StepPayment({
  checkoutData,
  updateCheckoutData,
  onPrev,
  isSubmitting,
  setIsSubmitting,
}: StepPaymentProps) {
  const navigate = useNavigate();
  const { clearCart, promoCode } = useCart();

  const handleMethodChange = (methodId: string) => {
    updateCheckoutData({ paymentMethod: methodId });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCheckoutData({ notes: e.target.value });
  };

  const handleSubmitOrder = async () => {
    if (!checkoutData.shippingAddressId) {
      toast.error("Veuillez sélectionner une adresse de livraison");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/orders", {
        shipping_address_id: checkoutData.shippingAddressId,
        billing_address_id: checkoutData.billingAddressId,
        shipping_method: checkoutData.shippingMethod,
        payment_method: checkoutData.paymentMethod,
        promo_code: promoCode?.code,
        notes: checkoutData.notes,
      });

      const order = response.data.order || response.data;

      // Clear the cart
      clearCart();

      // Redirect to success page
      navigate(`/checkout/success?order=${order.order_number}`);

      toast.success("Commande créée avec succès !");
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de la création de la commande";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Méthode de paiement
        </Label>
        <RadioGroup
          value={checkoutData.paymentMethod}
          onValueChange={handleMethodChange}
          className="space-y-3"
        >
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = checkoutData.paymentMethod === method.id;

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
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-100 text-neutral-500"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-neutral-500">{method.description}</p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Instructions de livraison (optionnel)</Label>
        <Textarea
          id="notes"
          placeholder="Ex: Appeler avant la livraison, laisser à la réception..."
          value={checkoutData.notes}
          onChange={handleNotesChange}
          rows={3}
        />
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
        <Lock className="h-4 w-4" />
        <span>Vos informations de paiement sont sécurisées et chiffrées.</span>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <Button onClick={handleSubmitOrder} disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Confirmer la commande
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
