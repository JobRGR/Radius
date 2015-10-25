import React from 'react'
import MapService from '../services/map'

const App = React.createClass({
  getInitialState() {
    return {areas: MapService.areas || []}
  },

  componentWillMount() {
    MapService.load()
  },

  render() {
    return (
      <div className='content'>
        {this.props.children}
      </div>
    )
  }
})

export default App
