import React from "react";
import UnauthorizedPage from "@/components/ErrorPage/Unauthorized";

export default [
  {
    path: "/unauthorized",
    element: React.createElement(UnauthorizedPage),
  },
];
