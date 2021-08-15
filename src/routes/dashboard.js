import React from "react"
import { Redirect } from "react-router-dom"
// Dashboard
import Dashboard from "../pages/dashboard"
import EventsNew from "../pages/dashboard/events/new"

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
  { path: "/dashboard/events/new", component: EventsNew },
]

export default dashboardRoutes
