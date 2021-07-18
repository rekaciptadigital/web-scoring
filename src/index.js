import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import App from "./App"
import "./i18n"
import * as serviceWorker from "./serviceWorker"
import { store } from "./store"

let persistor = persistStore(store)

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById("root"))
serviceWorker.unregister()
