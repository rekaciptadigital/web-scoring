import RegisterFullday from "pages/landingpage/fullday"
import RegisterDone from "pages/landingpage/fullday/components/RegisterDone"
import LandingPage from "pages/landingpage/homepage"
import MarathonLandingPage from "pages/landingpage/marathon/homepage"

const landingpageRouters = [
    { path: "/full-day", component: LandingPage },
    { path: "/full-day/register", component: RegisterFullday},
    { path: "/full-day/register-done", component: RegisterDone},

    {path: "/marathon", component: MarathonLandingPage},
]

export default landingpageRouters