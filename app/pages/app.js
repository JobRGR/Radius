import React from 'react'
import {Link, RouteHandler} from 'react-router'
import Header from '../components/header'

let App = React.createClass({

  render() {
    return (
      <div>
        <Header />
        <RouteHandler />
      </div>
    )
  }
})

export default App
