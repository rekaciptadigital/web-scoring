import React from "react"
import { Redirect } from "react-router-dom"
// Dashboard
import Dashboard from "../pages/dashboard"
import ListEvent from "../pages/dashboard/event"
import ListMember from "../pages/dashboard/member"

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/event", component: ListEvent},
  { path: "/dashboard/member", component: ListMember},

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

export default dashboardRoutes
