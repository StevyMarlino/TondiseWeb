import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Package, Search, Filter, ChevronRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountLayout } from "./AccountLayout";
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

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "pending", label: "En attente" },
  { value: "processing", label: "En cours" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      const data = response.data.data || response.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let result = [...orders];

    if (searchQuery) {
      result = result.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(result);
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
    });
  };

  return (
    <AccountLayout
      title="Mes commandes"
      description="Consultez l'historique de vos commandes"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Rechercher par numéro de commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <NavLink
              key={order.id}
              to={`/account/orders/${order.id}`}
              className="block bg-white dark:bg-neutral-900 rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-neutral-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{order.order_number}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status_label}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {order.items_count} article(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">
                    {parseFloat(order.total).toLocaleString("fr-FR")} FCFA
                  </span>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border">
          <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          {orders.length === 0 ? (
            <>
              <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
              <p className="text-neutral-500 mb-6">
                Vous n'avez pas encore passé de commande
              </p>
              <NavLink to="/shop">
                <Button>Commencer vos achats</Button>
              </NavLink>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
              <p className="text-neutral-500">
                Aucune commande ne correspond à vos critères de recherche
              </p>
            </>
          )}
        </div>
      )}
    </AccountLayout>
  );
}
