import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useAuthStore } from "@/stores/authStore";
import { cartService } from "@/services/cart.service";
import { toast } from "sonner";
import { StepAddress } from "./StepAddress";
import { StepShipping } from "./StepShipping";
import { StepPayment } from "./StepPayment";
import { OrderSummary } from "./OrderSummary";
import { StripeProvider } from "@/components/providers/StripeProvider";

export type CheckoutData = {
  shippingAddressId: number | null;
  billingAddressId: number | null;
  shippingMethod: string;
  paymentMethod: string;
  notes: string;
};

const steps = [
  { id: 1, name: "Adresse", description: "Adresse de livraison" },
  { id: 2, name: "Livraison", description: "Mode de livraison" },
  { id: 3, name: "Paiement", description: "Méthode de paiement" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, itemsCount } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncingCart, setIsSyncingCart] = useState(false);
  const [cartSynced, setCartSynced] = useState(false);

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddressId: null,
    billingAddressId: null,
    shippingMethod: "standard",
    paymentMethod: "card",
    notes: "",
  });

  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!checkoutCompleted && itemsCount === 0 && !isSyncingCart) {
      navigate("/cart");
    }
  }, [itemsCount, navigate, isSyncingCart, setCheckoutCompleted]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login?redirect=/checkout");
    }
  }, [isAuthenticated, navigate]);

  // Sync local cart to API when entering checkout
  useEffect(() => {
    const syncCartToAPI = async () => {
      if (!isAuthenticated || cartSynced || items.length === 0) return;

      setIsSyncingCart(true);
      let failedItems = 0;
      let successItems = 0;

      try {
        // Check current server cart first
        try {
          const currentCart = await cartService.getCart();
        } catch (e) {
          console.log('[Checkout] Error getting current cart:', e);
        }

        // Add each local item to the server cart (don't clear first)
        for (const item of items) {
          try {

            const result = await cartService.addItem({
              product_id: item.productId,
              quantity: item.quantity,
              selected_options: item.selectedOptionsApi || {},
              design_id: item.designId || null,
            });

            // Immediately check if the item is in the cart
            const cartAfterAdd = await cartService.getCart();

            successItems++;

          } catch (e: any) {
            failedItems++;
          }
        }

        // Verify cart after sync
        try {
          const serverCart = await cartService.getCart();

        } catch (e) {
          console.error('[Checkout] Error fetching cart after sync:', e);
        }

        setCartSynced(true);

        if (failedItems > 0) {
          toast.warning(`${failedItems} produit(s) n'ont pas pu être synchronisés`);
        } else if (successItems > 0) {
          toast.success(`${successItems} produit(s) synchronisé(s)`);
        }
      } catch (error) {

        toast.error('Erreur lors de la synchronisation du panier');
      } finally {
        setIsSyncingCart(false);
      }
    };

    syncCartToAPI().then(r => {return true;});
  }, [isAuthenticated, cartSynced, items]);

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  if (!isAuthenticated || (itemsCount === 0 && !isSyncingCart)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSyncingCart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-neutral-500">Synchronisation du panier...</p>
      </div>
    );
  }

  return (
    <StripeProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Finaliser la commande</h1>

        {/* Stepper */}
        <nav className="mb-8">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={cn(
                  "flex items-center",
                  index < steps.length - 1 && "flex-1"
                )}
              >
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={step.id > currentStep}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    step.id < currentStep && "text-primary cursor-pointer",
                    step.id === currentStep && "text-primary",
                    step.id > currentStep && "text-neutral-400 cursor-not-allowed"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      step.id < currentStep && "border-primary bg-primary text-white",
                      step.id === currentStep && "border-primary text-primary",
                      step.id > currentStep && "border-neutral-300 text-neutral-400"
                    )}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </span>
                  <span className="hidden sm:block">{step.name}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="mx-4 h-5 w-5 text-neutral-300 flex-shrink-0" />
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].description}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 1 && (
                  <StepAddress
                    checkoutData={checkoutData}
                    updateCheckoutData={updateCheckoutData}
                    onNext={nextStep}
                  />
                )}
                {currentStep === 2 && (
                  <StepShipping
                    checkoutData={checkoutData}
                    updateCheckoutData={updateCheckoutData}
                    onNext={nextStep}
                    onPrev={prevStep}
                  />
                )}
                {currentStep === 3 && (
                  <StepPayment
                    checkoutData={checkoutData}
                    updateCheckoutData={updateCheckoutData}
                    onPrev={prevStep}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    onCheckoutCompleted={() => setCheckoutCompleted(true)}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary shippingMethod={checkoutData.shippingMethod} />
          </div>
        </div>
      </div>
    </StripeProvider>
  );
}
