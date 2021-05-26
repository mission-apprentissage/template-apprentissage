import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import "tabler-react/dist/Tabler.css";
import useAuth from "./common/hooks/useAuth";

// Route-based code splitting @see https://reactjs.org/docs/code-splitting.html#route-based-code-splitting
const Layout = lazy(() => import("./pages/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ResetPasswordPage = lazy(() => import("./pages/password/ResetPasswordPage"));
const ForgottenPasswordPage = lazy(() => import("./pages/password/ForgottenPasswordPage"));

function PrivateRoute({ children, ...rest }) {
  let [auth] = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        return auth.sub !== "anonymous" ? children : <Redirect to="/login" />;
      }}
    />
  );
}

export default () => {
  let [auth] = useAuth();

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div />}>
          <Switch>
            <PrivateRoute exact path="/">
              <Layout>{auth && auth.permissions.isAdmin ? <DashboardPage /> : <HomePage />}</Layout>
            </PrivateRoute>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/reset-password" component={ResetPasswordPage} />
            <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
};
