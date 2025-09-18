import { createBrowserRouter } from "react-router";
import { Layout } from "@/components";
import { Home } from "@/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
]);
