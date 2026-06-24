import type { RouteObject } from "react-router-dom"

import Index from "../Index"

const routes: RouteObject[] = [
  {
    path: "users",
    Component: Index,
    handle: {
      label: "Users",
      icon: "User",
      showInSidebar: true,
      roles: ["admin"],
      group: "Management",
    },
  },
]

export default routes
