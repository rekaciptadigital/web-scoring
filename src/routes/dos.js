import PageDosDashboard from "../pages/dashboard/dos";
import PageDosQualification from "pages/dashboard/dos/qualification";
import PageDosElimination from "pages/dashboard/dos/elimination";
import PageDosMedalsByClub from "pages/dashboard/dos/medals-by-club";
import PageDosWinners from "pages/dashboard/dos/winners";

const dosRoutes = [
  { path: "/dashboard/event/:event_id/dos", component: PageDosDashboard },
  { path: "/dashboard/event/:event_id/dos-qualification", component: PageDosQualification },
  { path: "/dashboard/event/:event_id/dos-elimination", component: PageDosElimination },
  { path: "/dashboard/event/:event_id/dos-winners", component: PageDosWinners },
  { path: "/dashboard/event/:event_id/dos-medals-by-club", component: PageDosMedalsByClub },
];

export default dosRoutes;
