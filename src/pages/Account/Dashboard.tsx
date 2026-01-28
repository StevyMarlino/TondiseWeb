import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Package, MapPin, Heart, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountLayout } from "./AccountLayout";
import { useAuthStore } from "@/stores/authStore";
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

interface DashboardStats {
  orders_count: number;
  addresses_count: number;
  favorites_count: number;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    orders_count: 0,
    addresses_count: 0,
    favorites_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, addressesRes, favoritesRes] = await Promise.all([
        api.get("/orders?limit=3"),
        api.get("/addresses"),
        api.get("/favorites"),
      ]);

      const orders = ordersRes.data.data || ordersRes.data || [];
      const addresses = addressesRes.data.data || addressesRes.data || [];
      const favorites = favoritesRes.data.data || favoritesRes.data || [];

      setRecentOrders(Array.isArray(orders) ? orders.slice(0, 3) : []);
      setStats({
        orders_count: Array.isArray(orders) ? orders.length : 0,
        addresses_count: Array.isArray(addresses) ? addresses.length : 0,
        favorites_count: Array.isArray(favorites) ? favorites.length : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AccountLayout
      title={`Bonjour, ${user?.first_name || ""}!`}
      description="Bienvenue sur votre espace personnel"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.orders_count}</p>
                    <p className="text-sm text-neutral-500">Commandes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.addresses_count}</p>
                    <p className="text-sm text-neutral-500">Adresses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.favorites_count}</p>
                    <p className="text-sm text-neutral-500">Favoris</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Commandes récentes</CardTitle>
              <NavLink to="/account/orders">
                <Button variant="ghost" size="sm">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <NavLink
                      key={order.id}
                      to={`/account/orders/${order.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-neutral-500">
                            {formatDate(order.created_at)} · {order.items_count} article(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status_label}
                        </Badge>
                        <span className="font-semibold">
                          {parseFloat(order.total).toLocaleString("fr-FR")} FCFA
                        </span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 mb-4">
                    Vous n'avez pas encore de commandes
                  </p>
                  <NavLink to="/shop">
                    <Button>Commencer vos achats</Button>
                  </NavLink>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AccountLayout>
  );
}
