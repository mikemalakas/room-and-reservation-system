import routes from "./router/routes.ts"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

export function App() {
  const router = createBrowserRouter(routes)

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
