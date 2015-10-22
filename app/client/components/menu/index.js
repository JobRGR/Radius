import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'

let Header = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className='menu'>
        <Link to='/' className='title'>Radius</Link>
      </div>
    )
  }
})

export default Header
