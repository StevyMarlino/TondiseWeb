import NotFound from "@/NotFound";
import { createBrowserRouter } from "react-router-dom"
import TopMenu from "@/layouts/TopMenu";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Product from "@/pages/Product";


// Define the router
// Add all routes that you need here
const routes = [

	{
		path: "/",
		element: <TopMenu />,
		children: [
			{
				path: "",
				element: <Home />,
			},
			{
				path: "shop",
				element: <Shop />,
			},
			{
				path: "blog",
				element: <Blog />,
			},
			{
				path: "contact",
				element: <Contact />,
			},
			{
				path: "products/:id",
				element: <Product />,
			},
			{
				path: "about",
				element: <About />
			}
		]
	},
	// Not found route
	{
		path: "*",
		element: <NotFound />
	},
];

export const router = createBrowserRouter(routes, {
	future: {
	  v7_relativeSplatPath: true,
	},
  });
  
