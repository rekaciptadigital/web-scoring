import Comingsoon from "../pages/working/comingsoon"
import Maintenance from "../pages/working/maintenance"
import NotFound from "../pages/working/not-found"
import ServerError from "../pages/working/server-error"

const workingRoutes = [
  { path: "/working/maintenance", component: Maintenance },
  { path: "/working/comingsoon", component: Comingsoon },
  { path: "/working/not-found", component: NotFound },
  { path: "/working/server-error", component: ServerError },
]

export default workingRoutes
