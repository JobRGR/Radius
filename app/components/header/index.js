import React from 'react'
import {addons} from 'react/addons'
import {Link} from 'react-router'

let Header = React.createClass({
  mixins: [addons.PureRenderMixin],

  render() {
    return (
      <div className='header'>
        <Link to="index" className='title'>Radius</Link>
      </div>
    )
  }
})

export default Header
