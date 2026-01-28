import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { paymentService } from '@/services/payment.service';

type PaymentStatus = 'idle' | 'creating' | 'pending' | 'checking' | 'success' | 'error';

interface MobileMoneyFormProps {
  orderId: number;
  gateway: string;
  onSuccess?: (result: any) => void;
  onError?: (message: string) => void;
}

const gatewayLabels: Record<string, string> = {
  orange_money: 'Orange Money',
  mtn_momo: 'MTN Mobile Money',
  wave: 'Wave',
};

const gatewayColors: Record<string, string> = {
  orange_money: 'bg-orange-500',
  mtn_momo: 'bg-yellow-500',
  wave: 'bg-blue-500',
};

export function MobileMoneyForm({ orderId, gateway, onSuccess, onError }: MobileMoneyFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('creating');
    setErrorMessage(null);

    try {
      // 1. Créer le PaymentIntent
      const { payment_intent } = await paymentService.createIntent(orderId, gateway, phoneNumber);

      setStatus('pending');

      // 2. Pour Mobile Money, le client_secret contient souvent une URL de redirection ou un code USSD
      if (payment_intent.client_secret.startsWith('http')) {
        // Redirection vers la page de paiement du provider
        window.location.href = payment_intent.client_secret;
      } else {
        // Polling pour vérifier le statut du paiement
        setStatus('checking');
        pollPaymentStatus(payment_intent.id);
      }
    } catch (error: any) {
      setStatus('error');
      const message = error.response?.data?.message || 'Erreur lors du paiement';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentIntentId: string) => {
    const maxAttempts = 60; // 5 minutes (5s interval)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const result = await paymentService.confirm(paymentIntentId, gateway);

        if (result.success) {
          setStatus('success');
          onSuccess?.(result);
          return;
        }

        if (result.status === 'failed') {
          setStatus('error');
          setErrorMessage(result.message);
          onError?.(result.message);
          return;
        }

        // Continuer le polling si toujours en attente
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setStatus('error');
          const message = "Délai d'attente dépassé. Vérifiez votre téléphone.";
          setErrorMessage(message);
          onError?.(message);
        }
      } catch (error: any) {
        setStatus('error');
        const message = error.message || 'Erreur de vérification';
        setErrorMessage(message);
        onError?.(message);
      }
    };

    checkStatus();
  };

  const renderStatus = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className={`h-16 w-16 rounded-full ${gatewayColors[gateway]} flex items-center justify-center mb-4`}>
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-4" />
            <p className="font-semibold">Vérifiez votre téléphone...</p>
            <p className="text-sm text-neutral-500 mt-2">
              Confirmez le paiement sur votre appareil
            </p>
          </div>
        );

      case 'checking':
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="font-semibold">Vérification du paiement en cours...</p>
            <p className="text-sm text-neutral-500 mt-2">Ne fermez pas cette page</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-semibold text-green-600">Paiement réussi !</p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="font-semibold text-red-600">Le paiement a échoué</p>
            {errorMessage && (
              <p className="text-sm text-neutral-500 mt-2">{errorMessage}</p>
            )}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setStatus('idle');
                setErrorMessage(null);
              }}
            >
              Réessayer
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (status !== 'idle' && status !== 'creating') {
    return renderStatus();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-10 w-10 rounded-full ${gatewayColors[gateway]} flex items-center justify-center`}>
          <Smartphone className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold">Payer avec {gatewayLabels[gateway]}</p>
          <p className="text-sm text-neutral-500">Entrez votre numéro de téléphone</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Ex: 6XXXXXXXX"
          required
          pattern="[0-9]{9}"
        />
        <p className="text-xs text-neutral-500">Format: 9 chiffres sans l'indicatif pays</p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !phoneNumber || phoneNumber.length !== 9}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          `Payer avec ${gatewayLabels[gateway]}`
        )}
      </Button>

      <p className="text-xs text-center text-neutral-500">
        Vous recevrez une notification sur votre téléphone pour confirmer le paiement.
      </p>
    </form>
  );
}
