// Dashboard
import Dashboard from "../pages/Dashboard"
import ListEvent from "../pages/Dashboard/events"
import ListMember from "../pages/Dashboard/member"
import EventsNew from "../pages/Dashboard/events/new"
import ListCategory from "../pages/Dashboard/category"
import ListScoring from "../pages/Dashboard/scoring"
import ScoringNew from "pages/Dashboard/scoring/new"
import EventsNewFullday from "pages/Dashboard/events/new/fullday";
import EventsNewMarathon from "pages/Dashboard/events/new/marathon";
import React from "react";
import { Redirect } from "react-router-dom";

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/events", component: ListEvent},
  { path: "/dashboard/member", component: ListMember},
  { path: "/dashboard/category", component: ListCategory},
  { path: "/dashboard/scoring", component: ListScoring},
  { path: "/dashboard/scoring/new", component: ScoringNew},
  
  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
  { path: "/dashboard/events/new", component: EventsNew },
  { path: "/dashboard/events/new/fullday", component: EventsNewFullday },
  { path: "/dashboard/events/new/marathon", component: EventsNewMarathon },

];

export default dashboardRoutes;
