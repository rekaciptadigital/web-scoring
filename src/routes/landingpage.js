import LandingPage from "../pages/landingpage/homepage"

const landingpageRouters = [
    { path: "/event/:username/:slug", component: LandingPage, exact: true },
]

export default landingpageRouters