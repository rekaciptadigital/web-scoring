import LoginArcher from "../pages/authArcher/login"
import RegisterArcher from "../pages/authArcher/register"

const archerRouters = [
    { path: "/archer/login", component: LoginArcher},
    { path: "/archer/register", component: RegisterArcher}
]

export default archerRouters
