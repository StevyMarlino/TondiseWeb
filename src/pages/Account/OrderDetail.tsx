import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AccountLayout } from "./AccountLayout";
import api from "@/lib/axios";

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  options: Record<string, string> | null;
}

interface OrderAddress {
  id: number;
  full_name: string;
  phone: string;
  full_address: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  subtotal: string;
  discount: string;
  shipping_cost: string;
  total: string;
  payment_method: string;
  payment_method_label: string;
  shipping_method: string;
  shipping_method_label: string;
  notes: string | null;
  items: OrderItem[];
  shipping_address: OrderAddress;
  billing_address: OrderAddress | null;
  created_at: string;
  updated_at: string;
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      const data = response.data.order || response.data;
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return num.toLocaleString("fr-FR");
  };

  if (isLoading) {
    return (
      <AccountLayout title="Chargement..." description="">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout title="Commande introuvable" description="">
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Commande introuvable</h3>
          <p className="text-neutral-500 mb-6">
            Cette commande n'existe pas ou a été supprimée
          </p>
          <NavLink to="/account/orders">
            <Button>Retour aux commandes</Button>
          </NavLink>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title={`Commande ${order.order_number}`}
      description={`Passée le ${formatDate(order.created_at)}`}
    >
      {/* Back button */}
      <NavLink to="/account/orders" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux commandes
      </NavLink>

      {/* Status */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{order.order_number}</p>
              <p className="text-sm text-neutral-500">
                {order.items.length} article(s)
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-sm px-4 py-2`}>
            {order.status_label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <div className="w-20 h-20 bg-neutral-200 rounded-lg overflow-hidden shrink-0">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <p className="text-sm text-neutral-500 mt-1">
                          {Object.entries(item.options)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" | ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-neutral-500">
                          {formatPrice(item.unit_price)} FCFA x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.total_price)} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Order Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Sous-total</span>
                  <span>{formatPrice(order.subtotal)} FCFA</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction</span>
                    <span>-{formatPrice(order.discount)} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Livraison</span>
                  <span>
                    {parseFloat(order.shipping_cost) === 0 ? (
                      <span className="text-green-600">Gratuit</span>
                    ) : (
                      `${formatPrice(order.shipping_cost)} FCFA`
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total)} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shipping_address.full_name}</p>
              <p className="text-sm text-neutral-500 mt-1">
                {order.shipping_address.full_address}
              </p>
              <p className="text-sm text-neutral-500">
                {order.shipping_address.phone}
              </p>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Méthode de livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shipping_method_label}</p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Méthode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.payment_method_label}</p>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-500">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
