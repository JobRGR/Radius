import React from 'react'
import Header from '../components/header'

const App = React.createClass({

  render() {
    return (
      <div className='content'>
        <Header />
        {this.props.children}
      </div>
    )
  }
})

export default App
