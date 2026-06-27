import type { RouteObject } from "react-router-dom"

import Index from "../Index.tsx"
import Show from "../Show.tsx"

const routes: RouteObject[] = [
  {
    path: "equipment",
    Component: Index,
    handle: {
      label: "Equipment",
      icon: "Toolbox",
      showInSidebar: true,
      roles: ["admin"],
      group: "Management",
    },
    children: [
      {
        path: ":id",
        Component: Show,
      },
    ],
  },
]

export default routes
