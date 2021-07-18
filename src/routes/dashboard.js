import React from "react"
import { Redirect } from "react-router-dom"
// Dashboard
import Dashboard from "../pages/dashboard"

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

export default dashboardRoutes
