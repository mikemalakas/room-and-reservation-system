import type { RouteObject } from "react-router-dom";

export type SidebarItem = {
  path: string;
  label: string;
  icon?: string;
};

export function extractSidebarItems(
  routes: RouteObject[],
  userRole: string,
): SidebarItem[] {
  const items: SidebarItem[] = [];

  function walk(routes: RouteObject[], parentPath = "") {
    for (const route of routes) {
      const fullPath = route.path
        ? `${parentPath}/${route.path}`.replace(/\/+/g, "/")
        : parentPath;

      const handle = route.handle as any;

      const allowedRoles = handle?.roles;

      const isAllowed = !allowedRoles || allowedRoles.includes(userRole);

      if (handle?.showInSidebar && isAllowed) {
        items.push({
          path: fullPath,
          label: handle.label,
          icon: handle.icon,
        });
      }

      if (route.children) {
        walk(route.children, fullPath);
      }
    }
  }

  walk(routes);

  return items;
}
