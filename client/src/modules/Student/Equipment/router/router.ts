import type { RouteObject } from "react-router-dom";

import Index from "../Index";

const routes: RouteObject[] = [
  {
    path: "equipment",
    Component: Index,
    handle: {
      label: "Equipment",
      icon: "construction",
      showInSidebar: true,
      roles: ["student"],
    },
  },
];

export default routes;
