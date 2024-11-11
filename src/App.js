import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import { AuthLayout } from "./layouts";
import { AuthenticationMiddleware } from "./middlewares";
import {
  authenticationRoutes,
  dashboardRoutes,
  certificateRoutes,
  workingRoutes,
  dosRoutes,
  liveScoreRoutes,
} from "./routes";

import { LayoutDashboard, LayoutLiveScores } from "layouts/ma";
import { LayoutDashboardDos } from "layouts/dashboard-dos";

import { EventDetailProvider } from "contexts/event-detail";

import "./assets/scss/theme.scss";
import "react-datepicker/dist/react-datepicker.css";

const renderRoutes = (routes, layout, isAuthProtected) =>
  routes.map((route) => (
    <AuthenticationMiddleware
      path={route.path}
      layout={layout}
      component={route.component}
      key={route.path}
      isAuthProtected={isAuthProtected}
      exact
    />
  ));

const LoginRedirect = () => <Redirect to="/login" />;

const App = () => {
  return (
    <Router>
      <EventDetailProvider>
        <Switch>
          <AuthenticationMiddleware
            path="/"
            layout={React.Fragment}
            component={LoginRedirect}
            isAuthProtected={false}
            exact
          />
          {renderRoutes(authenticationRoutes, AuthLayout, false)}
          {renderRoutes(dashboardRoutes, LayoutDashboard, true)}
          {renderRoutes(certificateRoutes, LayoutDashboard, true)}
          {renderRoutes(liveScoreRoutes, LayoutLiveScores, false)}
          {renderRoutes(workingRoutes, AuthLayout, false)}
          {renderRoutes(dosRoutes, LayoutDashboardDos, false)}
          <Redirect to="/working/not-found" />
        </Switch>
      </EventDetailProvider>
    </Router>
  );
};

export default App;
