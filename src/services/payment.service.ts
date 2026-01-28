import api from '@/lib/axios';

export interface PaymentConfig {
  publishable_key: string;
  default_gateway: string;
  available_gateways: string[];
}

export interface PaymentMethod {
  gateway: string;
  method: string;
  label: string;
}

export interface GatewayConfig {
  gateway: string;
  config: Record<string, any>;
  methods: string[];
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

export interface PaymentConfirmResult {
  success: boolean;
  transaction_id?: string;
  status: string;
  message: string;
}

export const paymentService = {
  /**
   * Récupère la configuration générale de paiement
   */
  async getConfig(): Promise<PaymentConfig> {
    const { data } = await api.get('/payments/config');
    return data;
  },

  /**
   * Récupère les méthodes de paiement disponibles
   */
  async getMethods(): Promise<PaymentMethod[]> {
    const { data } = await api.get('/payments/methods');
    return data.methods;
  },

  /**
   * Récupère la configuration d'un gateway spécifique
   */
  async getGatewayConfig(gateway: string): Promise<GatewayConfig> {
    const { data } = await api.get(`/payments/gateways/${gateway}`);
    return data;
  },

  /**
   * Crée un PaymentIntent pour une commande
   * @param orderId - ID de la commande
   * @param gateway - Gateway de paiement (optionnel)
   * @param phoneNumber - Numéro de téléphone (requis pour Mobile Money)
   */
  async createIntent(
    orderId: number,
    gateway?: string,
    phoneNumber?: string
  ): Promise<{ payment_intent: PaymentIntent; gateway: string }> {
    const { data } = await api.post('/payments/intent', {
      order_id: orderId,
      gateway,
      phone_number: phoneNumber,
    });
    return data;
  },

  /**
   * Confirme le paiement côté serveur
   * @param paymentIntentId - ID du PaymentIntent
   * @param gateway - Gateway de paiement (optionnel)
   */
  async confirm(paymentIntentId: string, gateway?: string): Promise<PaymentConfirmResult> {
    const { data } = await api.post('/payments/confirm', {
      payment_intent_id: paymentIntentId,
      gateway,
    });
    return data.result;
  },
};
