import type { RouteObject } from "react-router-dom"
import StudentLayout from "@/components/layout/StudentLayout"
import React from "react"

const routes: RouteObject[] = []

Object.values(
  import.meta.glob("@/modules/Student/*/router/router.ts", {
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
    path: "/student",
    element: React.createElement(StudentLayout),
    children: routes,
  },
]
