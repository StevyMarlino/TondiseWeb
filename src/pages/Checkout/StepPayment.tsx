import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CreditCard, Smartphone, Loader2, Lock, AlertCircle } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CheckoutData } from "./index";
import { useCart } from "@/hooks/useCart";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { orderService } from "@/services/order.service";
import { paymentService, PaymentMethod } from "@/services/payment.service";
import { MobileMoneyForm } from "@/components/payment/MobileMoneyForm";

// Options de style pour CardElement
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
  hidePostalCode: true,
};

// Icônes par gateway
const gatewayIcons: Record<string, React.ReactNode> = {
  stripe: <CreditCard className="h-5 w-5" />,
  orange_money: <Smartphone className="h-5 w-5" />,
  mtn_momo: <Smartphone className="h-5 w-5" />,
  wave: <Smartphone className="h-5 w-5" />,
};

// Couleurs par gateway
const gatewayColors: Record<string, string> = {
  stripe: 'bg-indigo-500',
  orange_money: 'bg-orange-500',
  mtn_momo: 'bg-yellow-500',
  wave: 'bg-blue-500',
};

interface StepPaymentProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (data: Partial<CheckoutData>) => void;
  onPrev: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onCheckoutCompleted: () => void;
}

type PaymentStatus = 'idle' | 'creating_order' | 'creating_intent' | 'processing' | 'confirming' | 'success' | 'error';

export function StepPayment({
  checkoutData,
  updateCheckoutData,
  onPrev,
  isSubmitting,
  setIsSubmitting,
  onCheckoutCompleted,
}: StepPaymentProps) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, promoCode } = useCart();
  const { methods, loading: loadingMethods, error: methodsError } = usePaymentMethods();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // Sélectionner la première méthode par défaut
  useEffect(() => {
    if (methods.length > 0 && !selectedMethod) {
      setSelectedMethod(methods[0]);
    }
  }, [methods, selectedMethod]);

  const isStripePayment = selectedMethod?.gateway === 'stripe';
  const isMobileMoneyPayment = ['orange_money', 'mtn_momo', 'wave'].includes(selectedMethod?.gateway || '');

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setCardError(null);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCheckoutData({ notes: e.target.value });
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'creating_order': return 'Création de la commande...';
      case 'creating_intent': return 'Préparation du paiement...';
      case 'processing': return 'Traitement du paiement...';
      case 'confirming': return 'Confirmation...';
      default: return 'Traitement...';
    }
  };

  // Créer la commande (utilisé par tous les gateways)
  // extrait uniquement des parties corrigées (le reste est identique)

  const createOrder = async () => {
    if (!selectedMethod) {
      throw new Error("Méthode de paiement manquante");
    }

    setPaymentStatus('creating_order');

    const order = await orderService.createOrder({
      shipping_address_id: checkoutData.shippingAddressId!,
      billing_address_id:
          checkoutData.billingAddressId || checkoutData.shippingAddressId!,
      shipping_method: checkoutData.shippingMethod,
      payment_method: selectedMethod.method,
      promo_code: promoCode?.code,
      notes: checkoutData.notes,
    });

    if (!order?.id) {
      throw new Error("ID de commande manquant après création");
    }

    setCreatedOrderId(order.id);
    return order;
  };


  // Paiement Stripe
  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Le service de paiement n'est pas disponible");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Erreur avec le formulaire de paiement");
      return;
    }

    setIsSubmitting(true);
    setCardError(null);

    try {
      // Étape 1: Créer la commande
      const order = await createOrder();

      // Étape 2: Créer le PaymentIntent
      setPaymentStatus('creating_intent');
      const { payment_intent } = await paymentService.createIntent(order.id, 'stripe');

      // Étape 3: Confirmer avec Stripe
      setPaymentStatus('processing');
      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        payment_intent.client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!confirmedIntent || confirmedIntent.status !== 'succeeded') {
        throw new Error("Le paiement n'a pas abouti");
      }

      // Étape 4: Confirmer côté serveur
      setPaymentStatus('confirming');
      const result = await paymentService.confirm(confirmedIntent.id, 'stripe');
      console.log('CONFIRM RESULT', result, 'Order', order.orderNumber);

      if (!result.success) {
        throw new Error(result.message || 'Erreur de confirmation');
      }

      setPaymentStatus('success');
      toast.success("Paiement réussi !");

      onCheckoutCompleted();

      navigate(`/checkout/success?order=${order.orderNumber}`, {
        replace: true,
      });

    } catch (error: any) {
      setPaymentStatus('error');
      const message = error.response?.data?.message || error.message || "Erreur lors du paiement";
      setCardError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Callback succès Mobile Money
  const handleMobileMoneySuccess = (result: any) => {
    clearCart();
    toast.success("Paiement réussi !");
    navigate(`/checkout/success?order=${createdOrderId}`, {
      replace: true,
    });
  };

  // Callback erreur Mobile Money
  const handleMobileMoneyError = (message: string) => {
    toast.error(message);
  };

  // Handler pour créer la commande avant Mobile Money
  const handleMobileMoneyStart = async () => {
    if (!checkoutData.shippingAddressId) {
      toast.error("Veuillez sélectionner une adresse de livraison");
      return null;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder();
      return order.id;
    } catch (error: any) {
      const message = error.response?.data?.message || "Erreur lors de la création de la commande";
      toast.error(message);
      return null;
    } finally {
      setIsSubmitting(false);
      setPaymentStatus('idle');
    }
  };

  const handleSubmitOrder = async () => {
    if (!checkoutData.shippingAddressId) {
      toast.error("Veuillez sélectionner une adresse de livraison");
      return;
    }

    if (!selectedMethod) {
      toast.error("Veuillez sélectionner une méthode de paiement");
      return;
    }

    if (isStripePayment) {
      if (!cardComplete) {
        toast.error("Veuillez compléter les informations de votre carte");
        return;
      }
      await handleStripePayment();
    }
    // Mobile Money est géré par son propre composant
  };

  const canSubmit = isStripePayment
    ? (stripe && elements && cardComplete && !isSubmitting)
    : !isSubmitting;

  // Render loading state
  if (loadingMethods) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render error state
  if (methodsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500">{methodsError}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sélection de la méthode de paiement */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Méthode de paiement
        </Label>
        <RadioGroup
          value={selectedMethod ? `${selectedMethod.gateway}-${selectedMethod.method}` : ''}
          onValueChange={(value) => {
            const method = methods.find(m => `${m.gateway}-${m.method}` === value);
            if (method) handleMethodChange(method);
          }}
          className="space-y-3"
        >
          {methods.map((method) => {
            const isSelected = selectedMethod?.gateway === method.gateway && selectedMethod?.method === method.method;

            return (
              <label
                key={`${method.gateway}-${method.method}`}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                <RadioGroupItem value={`${method.gateway}-${method.method}`} />
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-white",
                    gatewayColors[method.gateway] || "bg-neutral-500"
                  )}
                >
                  {gatewayIcons[method.gateway] || <CreditCard className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{method.label}</p>
                  <p className="text-sm text-neutral-500">
                    {method.gateway === 'stripe' && 'Visa, Mastercard, etc.'}
                    {method.gateway === 'orange_money' && 'Paiement mobile Orange'}
                    {method.gateway === 'mtn_momo' && 'Paiement mobile MTN'}
                    {method.gateway === 'wave' && 'Paiement mobile Wave'}
                  </p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Formulaire Stripe Card Element */}
      {isStripePayment && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Informations de carte</Label>
          <div className={cn(
            "p-4 border rounded-xl bg-white dark:bg-neutral-900 transition-colors",
            cardError ? "border-red-500" : "border-neutral-200"
          )}>
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span>{cardError}</span>
            </div>
          )}
          <p className="text-xs text-neutral-500">
            Utilisez <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">4242 4242 4242 4242</code> pour tester
          </p>
        </div>
      )}

      {/* Formulaire Mobile Money */}
      {isMobileMoneyPayment && selectedMethod && createdOrderId && (
        <MobileMoneyForm
          orderId={createdOrderId}
          gateway={selectedMethod.gateway}
          onSuccess={handleMobileMoneySuccess}
          onError={handleMobileMoneyError}
        />
      )}

      {/* Bouton pour créer la commande avant Mobile Money */}
      {isMobileMoneyPayment && !createdOrderId && (
        <Button
          onClick={async () => {
            const orderId = await handleMobileMoneyStart();
            if (orderId) setCreatedOrderId(orderId);
          }}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Création de la commande...
            </>
          ) : (
            'Continuer vers le paiement'
          )}
        </Button>
      )}

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

        {isStripePayment && (
          <Button
            onClick={handleSubmitOrder}
            disabled={!canSubmit}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {getStatusMessage()}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Payer maintenant
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
