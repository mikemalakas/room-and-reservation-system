import type { RouteObject } from "react-router-dom"
import FacultyLayout from "@/components/layout/FacultyLayout"
import ProtectedRoute from "@/components/guard/ProtectedRoute"
import React from "react"

const routes: RouteObject[] = []

Object.values(
  import.meta.glob("@/modules/Faculty/*/router/router.ts", {
    eager: true,
  })
).forEach((mod) => {
  const r = (mod as { default: RouteObject | RouteObject[] }).default
  if (Array.isArray(r)) {
    routes.push(...r)
  } else {
    routes.push(r)
  }
})

export default [
  {
    path: "/faculty",
    element: React.createElement(
      ProtectedRoute,
      { allowedRoles: ["faculty"] },
      React.createElement(FacultyLayout)
    ),
    children: routes,
  },
]
