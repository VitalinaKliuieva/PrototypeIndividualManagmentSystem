import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Calendar } from "./pages/Calendar";
import { Goals } from "./pages/Goals";
import { Analytics } from "./pages/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "calendar", Component: Calendar },
      { path: "goals", Component: Goals },
      { path: "analytics", Component: Analytics },
    ],
  },
]);
