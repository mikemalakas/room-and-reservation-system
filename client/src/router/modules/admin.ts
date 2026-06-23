import type { RouteObject } from "react-router-dom";
import AdminLayout from "@/components/Layout/AdminLayout";
import ProtectedRoute from "@/components/Guard/ProtectedRoute";
import React from "react";

const routes: RouteObject[] = [];

Object.values(
  import.meta.glob("@/modules/Admin/*/router/router.ts", {
    eager: true,
  }),
).forEach((mod) => {
  const r = (mod as { default: RouteObject | RouteObject[] }).default;
  if (Array.isArray(r)) {
    routes.push(...r);
  } else {
    routes.push(r);
  }
});

export default [
  {
    path: "/admin",
    element: React.createElement(
      ProtectedRoute,
      { allowedRoles: ["admin"] },
      React.createElement(AdminLayout),
    ),
    children: routes,
  },
];
