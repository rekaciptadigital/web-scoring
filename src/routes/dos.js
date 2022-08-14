import PageDosDashboard from "../pages/dashboard/dos";
import PageDosQualification from "pages/dashboard/dos/qualification";
import PageDosElimination from "pages/dashboard/dos/elimination";

const dosRoutes = [
  { path: "/dashboard/event/:event_id/dos", component: PageDosDashboard },
  { path: "/dashboard/event/:event_id/dos-qualification", component: PageDosQualification },
  { path: "/dashboard/event/:event_id/:date_event/dos-elimination", component: PageDosElimination },
];

export default dosRoutes;
