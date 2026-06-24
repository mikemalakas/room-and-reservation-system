import type { RouteObject } from "react-router-dom"
import LandingPage from "@/components/layout/LandingPage"
import React from "react"
import PublicRoute from "@/components/guard/PublicRoute"

const routes: RouteObject[] = []

Object.values(
  import.meta.glob("@/modules/Public/*/router/router.ts", {
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
    path: "/",
    element: React.createElement(
      PublicRoute,
      null,
      React.createElement(LandingPage)
    ),
    children: routes,
  },
]
