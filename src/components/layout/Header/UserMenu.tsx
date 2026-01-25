import { User, LogOut, Package, Heart, MapPin, Settings, ChevronRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <NavLink to="/auth/login">
          <Button variant="ghost" size="sm" className="rounded-xl">
            Connexion
          </Button>
        </NavLink>
        <NavLink to="/auth/register">
          <Button size="sm" className="rounded-xl">
            Inscription
          </Button>
        </NavLink>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 pl-1 pr-3 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user ? getInitials(user.first_name, user.last_name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-xs font-semibold leading-none">
              {user?.first_name}
            </span>
            <span className="text-[10px] text-neutral-500 leading-none mt-0.5">
              Mon compte
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {user?.full_name || `${user?.first_name} ${user?.last_name}`}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/account" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mon compte</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/account/orders" className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            <span>Mes commandes</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/account/favorites" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Mes favoris</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavLink to="/account/addresses" className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Mes adresses</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/account/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
