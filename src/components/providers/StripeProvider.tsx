import { ReactNode, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { paymentService } from '@/services/payment.service';
import { Loader2 } from 'lucide-react';

interface StripeProviderProps {
  children: ReactNode;
}

let stripePromise: Promise<Stripe | null> | null = null;

export function StripeProvider({ children }: StripeProviderProps) {
  const [stripe, setStripe] = useState<Promise<Stripe | null> | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeAvailable, setStripeAvailable] = useState(true);

  useEffect(() => {
    const initStripe = async () => {
      try {
        // Réutiliser l'instance existante si déjà initialisée
        if (stripePromise) {
          setStripe(stripePromise);
          setLoading(false);
          return;
        }

        const config = await paymentService.getConfig();

        // Vérifier si Stripe est disponible
        if (!config.publishable_key || !config.available_gateways?.includes('stripe')) {
          setStripeAvailable(false);
          setLoading(false);
          return;
        }

        stripePromise = loadStripe(config.publishable_key);
        setStripe(stripePromise);
      } catch (err: any) {
        console.error('Erreur initialisation Stripe:', err);
        // Ne pas bloquer si Stripe n'est pas disponible
        setStripeAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si Stripe n'est pas disponible, on rend quand même les children
  // pour que les autres méthodes de paiement fonctionnent
  if (!stripeAvailable) {
    return <>{children}</>;
  }

  return (
    <Elements stripe={stripe}>
      {children}
    </Elements>
  );
}
