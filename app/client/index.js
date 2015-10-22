import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute} from 'react-router'
import Index from './pages/index'
import App from './pages/app'

const router = (
  <Router>
    <Route path='/' component={App}>
      <IndexRoute component={Index} />
    </Route>
  </Router>
)

render(router, document.body)
