import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as AuthenticationStore from "store/slice/authentication"
import { useHistory } from "react-router-dom"

const Logout = props => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { isLoggedIn } = useSelector(AuthenticationStore.getAuthenticationStore)

  useEffect(() => {
    dispatch(AuthenticationStore.logout())
  })

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/authentication/login")
    }
  }, [isLoggedIn])

  return <></>
}

export default Logout
