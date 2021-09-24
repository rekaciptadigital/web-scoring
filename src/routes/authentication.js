import ConfirmMail from "../pages/authentication/confirm-mail"
import EmailVerification from "../pages/authentication/email-verification"
import ForgetPassword from "../pages/authentication/forget-password"
import LockScreen from "../pages/authentication/lock-screen"
import Login from "../pages/authentication/login"
import Logout from "../pages/authentication/logout"
import RecoverPassword from "../pages/authentication/recover-password"
import Register from "../pages/authentication/register"
import TwostepVerification from "../pages/authentication/two-step-verification"

const authRoutes = [
  { path: "/authentication/logout", component: Logout },
  { path: "/authentication/login", component: Login },
  { path: "/authentication/forgot-password", component: ForgetPassword },
  { path: "/authentication/register", component: Register },
  { path: "/authentication/email-verification", component: EmailVerification },
  { path: "/authentication/recover-password", component: RecoverPassword },
  { path: "/authentication/lock-screen", component: LockScreen },
  { path: "/authentication/two-step-verification", component: TwostepVerification },
  { path: "/authentication/confirm-mail", component: ConfirmMail },

]

export default authRoutes
