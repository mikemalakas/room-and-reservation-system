import type { RouteObject } from "react-router-dom"

import Index from "../Index.tsx"

const routes: RouteObject[] = [
  {
    path: "equipment",
    Component: Index,
    handle: {
      label: "Equipment",
      icon: "Toolbox",
      showInSidebar: true,
      roles: ["faculty"],
      group: "Management",
    },
  },
]

export default routes
