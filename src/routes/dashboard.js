// Dashboard
import Dashboard from "pages/dashboard";
import EventsNew from "pages/dashboard/events/new";
import EventsNewFullday from "pages/dashboard/events/new/fullday";
import EventsNewMarathon from "pages/dashboard/events/new/marathon";
import React from "react";
import { Redirect } from "react-router-dom";

const dashboardRoutes = [
  { path: "/dashboard", component: Dashboard },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
  { path: "/dashboard/events/new", component: EventsNew },
  { path: "/dashboard/events/new/fullday", component: EventsNewFullday },
  { path: "/dashboard/events/new/marathon", component: EventsNewMarathon },
];

export default dashboardRoutes;
