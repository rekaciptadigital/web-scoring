import RegisterFullday from "pages/landingpage/fullday"
import RegisterDone from "pages/landingpage/fullday/components/RegisterDone"
import LandingPage from "pages/landingpage/homepage"
import MarathonLandingPage from "pages/landingpage/marathon/homepage"
import RegisterMarathon from "pages/landingpage/marathon";
import RegisterMarathonDone from "pages/landingpage/marathon/components/RegisterMarathonDone";
import DashboardMarathon from "pages/landingpage/marathon/dashboard";
import CheckoutEvent from "pages/landingpage/checkout";
import DashboardOrderEvent from "pages/landingpage/dashboard";

const landingpageRouters = [
    { path: "/:username/:slug", component: LandingPage },
    { path: "/full-day/register", component: RegisterFullday},
    { path: "/full-day/register-done", component: RegisterDone},

    {path: "/marathon", component: MarathonLandingPage},
    {path: "/marathon/register", component: RegisterMarathon},
    {path: "/marathon/register-done", component: RegisterMarathonDone},
    {path: "/marathon/dashboard", component:DashboardMarathon},

    {path: "/checkout-event", component:CheckoutEvent},
    {path: "/dashboard/event", component:DashboardOrderEvent},
]

export default landingpageRouters