import { useState, useEffect } from 'react';
import { paymentService, PaymentConfig, PaymentMethod } from '@/services/payment.service';

export const usePaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentConfig = async () => {
      try {
        const [configRes, methodsRes] = await Promise.all([
          paymentService.getConfig(),
          paymentService.getMethods(),
        ]);

        setConfig(configRes);
        setMethods(methodsRes);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des méthodes de paiement');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentConfig();
  }, []);

  return { methods, config, loading, error };
};
