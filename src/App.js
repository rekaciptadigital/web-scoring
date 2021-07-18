import React from "react"
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom"
import { AuthLayout, DashboardLayout } from "./layouts"
import { authenticationRoutes, dashboardRoutes, workingRoutes } from "./routes"
import { AuthenticationMiddleware } from "./middlewares"
import "./assets/scss/theme.scss"

const App = props => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authenticationRoutes.map((route, idx) => (
            <AuthenticationMiddleware
              path={route.path}
              layout={AuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}

          {dashboardRoutes.map((route, idx) => (
            <AuthenticationMiddleware
              path={route.path}
              layout={DashboardLayout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
          {workingRoutes.map((route, idx) => (
            <AuthenticationMiddleware
              path={route.path}
              layout={AuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}
          <Redirect to="/working/not-found" />
        </Switch>
      </Router>
    </React.Fragment>
  )
}

export default App
