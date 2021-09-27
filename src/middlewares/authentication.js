import React from "react"
import PropTypes from "prop-types"
import { Route, Redirect } from "react-router-dom"
import { getAuthenticationStore } from "store/slice/authentication"
import { useSelector } from "react-redux"

const AuthenticationMiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  ...rest
}) => {
  let { isLoggedIn } = useSelector(getAuthenticationStore)
  isLoggedIn = true;
  isAuthProtected = false
  
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthProtected && !isLoggedIn) {
          return (
            <Redirect
              to={{
                pathname: "/authentication/login",
                state: { from: props.location },
              }}
            />
          )
        }

        return (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }}
    />
  )
}

AuthenticationMiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
}

export default AuthenticationMiddleware
