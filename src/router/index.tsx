import { createBrowserRouter } from "react-router-dom";
import NotFound from "@/NotFound";
import TopMenu from "@/layouts/TopMenu";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Product from "@/pages/Product";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";
import { Login, Register, ForgotPassword } from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/Checkout/CheckoutSuccess";

// Account pages
import AccountDashboard from "@/pages/Account/Dashboard";
import AccountOrders from "@/pages/Account/Orders";
import AccountOrderDetail from "@/pages/Account/OrderDetail";
import AccountAddresses from "@/pages/Account/Addresses";
import AccountFavorites from "@/pages/Account/Favorites";
import AccountSettings from "@/pages/Account/Settings";

const routes = [
  {
    path: "/",
    element: <TopMenu />,
    children: [
      // Public pages
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },

      // Products
      { path: "products/:id", element: <Product /> },

      // Categories
      { path: "category/:slug", element: <Category /> },
      { path: "category/:slug/:subSlug", element: <Category /> },

      // Cart
      { path: "cart", element: <Cart /> },

      // Auth
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },
      { path: "auth/forgot-password", element: <ForgotPassword /> },

      // Checkout
      { path: "checkout", element: <Checkout /> },
      { path: "checkout/success", element: <CheckoutSuccess /> },

      // Account
      { path: "account", element: <AccountDashboard /> },
      { path: "account/orders", element: <AccountOrders /> },
      { path: "account/orders/:id", element: <AccountOrderDetail /> },
      { path: "account/addresses", element: <AccountAddresses /> },
      { path: "account/favorites", element: <AccountFavorites /> },
      { path: "account/settings", element: <AccountSettings /> },
    ],
  },
  // Not found
  { path: "*", element: <NotFound /> },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});
