import DashboardDos from "../pages/dashboard/dos";
import PageDosQualification from "pages/dashboard/dos/qualification";

const dosRoutes = [
  { path: "/dashboard/event/:event_id/dos", component: DashboardDos},
  { path: "/dashboard/event/:event_id/:date_event/dos-qualification", component: PageDosQualification },
];

export default dosRoutes;