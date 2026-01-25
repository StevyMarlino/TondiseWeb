import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

interface Order {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  total: string;
  items_count: number;
  created_at: string;
}

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    } else {
      setIsLoading(false);
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await api.get("/orders");
      const orders = response.data.data || response.data;
      const foundOrder = orders.find((o: Order) => o.order_number === orderNumber);
      setOrder(foundOrder || null);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-neutral-500 mb-8">
          Merci pour votre commande. Vous recevrez un email de confirmation.
        </p>

        {order && (
          <Card className="mb-8 text-left">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-sm text-neutral-500">{order.status_label}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Articles</p>
                  <p className="font-medium">{order.items_count} article(s)</p>
                </div>
                <div>
                  <p className="text-neutral-500">Total</p>
                  <p className="font-medium">{parseFloat(order.total).toLocaleString("fr-FR")} FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink to="/account/orders">
            <Button variant="outline" className="w-full sm:w-auto">
              Voir mes commandes
            </Button>
          </NavLink>
          <NavLink to="/shop">
            <Button className="w-full sm:w-auto">
              Continuer mes achats
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
