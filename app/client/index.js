import React from 'react'
import ReactDOM from 'react-dom'
import {render} from 'react-dom'
import {Router, Route, IndexRoute} from 'react-router'
import Index from './pages/index'
import App from './pages/app'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

const router = (
  <Router>
    <Route path='/' component={App}>
      <IndexRoute component={Index} />
    </Route>
  </Router>
)

render(router, document.body)
