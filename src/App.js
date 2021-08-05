import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import "./assets/scss/theme.scss";
import { AuthLayout, DashboardHorizontalLayout } from "./layouts";
import { AuthenticationMiddleware } from "./middlewares";
import { authenticationRoutes, dashboardRoutes, workingRoutes } from "./routes";

const App = () => {
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
              layout={DashboardHorizontalLayout}
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
  );
};

export default App;
