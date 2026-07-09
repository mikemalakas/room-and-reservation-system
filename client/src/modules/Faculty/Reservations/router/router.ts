import type { RouteObject } from "react-router-dom"

import Index from "../Index"
// import Show from "../Show.tsx"

const routes: RouteObject[] = [
  {
    path: "reservations",
    Component: Index,
    handle: {
      label: "Reservations",
      icon: "Calendar",
      showInSidebar: true,
      roles: ["faculty"],
      group: "Management",
    },
    // children: [
    //   {
    //     path: ":id",
    //     Component: Show,
    //   },
    // ],
  },
]

export default routes
