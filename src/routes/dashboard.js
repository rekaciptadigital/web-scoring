import React from "react"
import { Redirect } from "react-router-dom"
// Dashboard
import Dashboard from "../pages/dashboard"
import ListEvent from "../pages/dashboard/events"
import ListMember from "../pages/dashboard/member"
import EventsNew from "../pages/dashboard/events/new"
import ListCategory from "../pages/dashboard/category"
import ListScoring from "../pages/dashboard/scoring"

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/events", component: ListEvent},
  { path: "/dashboard/member", component: ListMember},
  { path: "/dashboard/category", component: ListCategory},
  { path: "/dashboard/scoring", component: ListScoring},
  
  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
  { path: "/dashboard/events/new", component: EventsNew },
]

export default dashboardRoutes
