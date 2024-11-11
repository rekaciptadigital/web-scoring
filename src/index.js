import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"
import App from "./App"
import "./i18n"
import * as serviceWorker from "./serviceWorker"
import { store } from "./store"

let persistor = persistStore(store)

const container = document.getElementById("root")
const root = createRoot(container)

const AppWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </BrowserRouter>
  </Provider>
)

root.render(<AppWrapper />)

serviceWorker.unregister()
