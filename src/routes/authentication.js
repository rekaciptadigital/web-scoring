import ConfirmMail from "../pages/authentication/confirm-mail";
import EmailVerification from "../pages/authentication/email-verification";
import ForgetPassword from "../pages/authentication/forget-password";
import LockScreen from "../pages/authentication/lock-screen";
import Login from "../pages/authentication/login";
import Logout from "../pages/authentication/logout";
import RecoverPassword from "../pages/authentication/recover-password";
import Register from "../pages/authentication/register";
import TwostepVerification from "../pages/authentication/two-step-verification";

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPassword },
  { path: "/register", component: Register },
  { path: "/email-verification", component: EmailVerification },
  { path: "/recover-password", component: RecoverPassword },
  { path: "/lock-screen", component: LockScreen },
  { path: "/two-step-verification", component: TwostepVerification },
  { path: "/confirm-mail", component: ConfirmMail },
];

export default authRoutes;
