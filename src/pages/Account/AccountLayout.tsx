import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

const menuItems = [
  { path: "/account", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { path: "/account/orders", label: "Mes commandes", icon: Package },
  { path: "/account/addresses", label: "Mes adresses", icon: MapPin },
  { path: "/account/favorites", label: "Mes favoris", icon: Heart },
  { path: "/account/settings", label: "Paramètres", icon: Settings },
];

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AccountLayout({ children, title, description }: AccountLayoutProps) {
  const navigate = useNavigate();
  const { user, logout, isHydrated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate("/");
      toast.success("Déconnexion réussie");
    } catch (error) {
      logout();
      navigate("/");
    }
  };

  // Wait for hydration before checking auth
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border p-6 sticky top-24">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold">{user.full_name || `${user.first_name} ${user.last_name}`}</p>
                <p className="text-sm text-neutral-500">{user.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-neutral-500 mt-1">{description}</p>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
