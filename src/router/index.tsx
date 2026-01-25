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
