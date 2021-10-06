import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { AuthLayout, DashboardHorizontalLayout } from "./layouts";
import { AuthenticationMiddleware } from "./middlewares";
import { authenticationRoutes, dashboardRoutes, workingRoutes } from "./routes";

import "./assets/scss/theme.scss";

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <AuthenticationMiddleware
            path="/"
            layout={React.Fragment}
            component={() => <Redirect to="/authentication/login" />}
            isAuthProtected={false}
            exact
          />
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
