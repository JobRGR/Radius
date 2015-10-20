import {Route, DefaultRoute, NotFoundRoute} from "react-router"
import React from "react"
import Index from './pages/index'
import App from './pages/app'

export default (
  <Route handler={App}>
    <DefaultRoute name='index' handler={Index} />
  </Route>
)
