import { useState, useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';

export type PaymentStatus =
  | 'idle'
  | 'creating_order'
  | 'creating_intent'
  | 'processing'
  | 'success'
  | 'error';

interface CheckoutResult {
  success: boolean;
  order?: any;
  error?: string;
}

export const useCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

  const processCheckout = useCallback(async (
    shippingAddressId: number,
    billingAddressId: number | null = null,
    shippingMethod: string = 'standard',
    notes: string = ''
  ): Promise<CheckoutResult> => {
    if (!stripe || !elements) {
      setError('Stripe non initialisé');
      return { success: false, error: 'Stripe non initialisé' };
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Élément de carte non trouvé');
      return { success: false, error: 'Élément de carte non trouvé' };
    }

    setLoading(true);
    setError(null);

    try {
      // Étape 1: Créer la commande
      setPaymentStatus('creating_order');
      const newOrder = await orderService.createOrder({
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId || shippingAddressId,
        shipping_method: shippingMethod,
        payment_method: 'card',
        notes,
      });
      setOrder(newOrder);

      // Étape 2: Créer le PaymentIntent
      setPaymentStatus('creating_intent');
      const paymentIntent = await paymentService.createIntent(newOrder.id);

      // Étape 3: Confirmer avec Stripe
      setPaymentStatus('processing');
      const { error: stripeError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
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
        throw new Error('Le paiement n\'a pas abouti');
      }

      // Étape 4: Confirmer côté serveur
      const result = await paymentService.confirm(confirmedIntent.id);

      if (!result.success) {
        throw new Error(result.message || 'Erreur de confirmation');
      }

      setPaymentStatus('success');
      return { success: true, order: newOrder };

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue';
      setError(errorMessage);
      setPaymentStatus('error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [stripe, elements]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setOrder(null);
    setPaymentStatus('idle');
  }, []);

  const getStatusMessage = useCallback(() => {
    switch (paymentStatus) {
      case 'creating_order': return 'Création de la commande...';
      case 'creating_intent': return 'Préparation du paiement...';
      case 'processing': return 'Traitement du paiement...';
      default: return '';
    }
  }, [paymentStatus]);

  return {
    processCheckout,
    reset,
    loading,
    error,
    order,
    paymentStatus,
    getStatusMessage,
    isReady: !!stripe && !!elements,
  };
};
