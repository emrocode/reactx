import React from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "@/components";
import { Home, Home } from "@/pages";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Home /> }],
  },
];

export const router = createBrowserRouter(routes);
