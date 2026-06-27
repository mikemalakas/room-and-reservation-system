import type { RouteObject } from "react-router-dom"

import s from "@/router/modules/student"
import a from "@/router/modules/admin"
import p from "@/router/modules/public"
import e from "@/router/modules/error"
import f from "@/router/modules/faculty"

const routes: RouteObject[] = [...s, ...a, ...p, ...e, ...f]

export default routes
