import type { RouteObject } from "react-router-dom"

import Index from "../Index"

const routes: RouteObject[] = [
  {
    index: true,
    Component: Index,
    handle: {
      label: "Dashboard",
      icon: "LayoutDashboard",
      showInSidebar: true,
      roles: ["student"],
    },
  },
]

export default routes
