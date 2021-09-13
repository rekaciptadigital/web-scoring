import LoginArcher from "../pages/authArcher/login"
import RegisterArcher from "../pages/authArcher/register"

const archerRouters = [
    { path: "/archer/login", component: LoginArcher, exact: true},
    { path: "/archer/register", component: RegisterArcher, exact: true}
]

export default archerRouters
