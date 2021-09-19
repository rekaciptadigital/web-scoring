import RegisterFullday from "../pages/landingpage/fullday"
import RegisterDone from "../pages/landingpage/fullday/components/RegisterDone"
import MarathonLandingPage from "../pages/landingpage/marathon/homepage"
import RegisterMarathon from "../pages/landingpage/marathon";
import RegisterMarathonDone from "../pages/landingpage/marathon/components/RegisterMarathonDone";
import ScheduleMarathon from "../pages/landingpage/marathon/schedule";
import CheckoutEvent from "../pages/landingpage/checkout";
import DashboardOrderEvent from "../pages/landingpage/dashboard";
import ArcherLogout from "pages/authArcher/logout";

const routerDasboardArcher = [
  { path: "/event/register/process/:slug", component: RegisterFullday, exact: true },
  { path: "/fullday/register-done", component: RegisterDone },

  { path: "/marathon", component: MarathonLandingPage },
  { path: "/marathon/register", component: RegisterMarathon },
  { path: "/marathon/register-done", component: RegisterMarathonDone },
  { path: "/archer/event/marathon/qualification/schedule/:member_id", component: ScheduleMarathon },

  { path: "/checkout-event/:id", component: CheckoutEvent, exact: true },
  { path: "/archer/dashboard", component: DashboardOrderEvent, exact: true },
  { path: "/archer/logout", component: ArcherLogout },
];

export default routerDasboardArcher;
