// Dashboard
import Dashboard from "../pages/dashboard"
import ListEvent from "../pages/dashboard/events"
import ListMember from "../pages/dashboard/member"
import EventsNew from "../pages/dashboard/events/new"
import ListCategory from "../pages/dashboard/category"
import ListScoring from "../pages/dashboard/scoring"
import ListResult from "pages/dashboard/results"
import Bagan from "pages/dashboard/results/bagan"
import EditResult from "pages/dashboard/results/edit"
import ScoringNew from "pages/dashboard/scoring/new"
import EventsNewFullday from "pages/dashboard/events/new/fullday";
import EventsNewMarathon from "pages/dashboard/events/new/marathon";
import React from "react";
import { Redirect } from "react-router-dom";

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard/events", component: ListEvent},
  { path: "/dashboard/member", component: ListMember},
  { path: "/dashboard/category", component: ListCategory},
  { path: "/dashboard/scoring", component: ListScoring},
  { path: "/dashboard/scoring/new", component: ScoringNew},
  { path: "/dashboard/result", component: ListResult},
  { path: "/dashboard/result/bagan", component: Bagan},
  { path: "/dashboard/result/edit", component: EditResult},
  
  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
  { path: "/dashboard/events/new", component: EventsNew },
  { path: "/dashboard/events/new/fullday", component: EventsNewFullday },
  { path: "/dashboard/events/new/marathon", component: EventsNewMarathon },
];

export default dashboardRoutes;
