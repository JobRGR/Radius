import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Mui from 'material-ui'
import {Link} from 'react-router'

const {AppBar, Card} = Mui

let Header = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <Card className='menu'>
        <AppBar title='Radius'/>
      </Card>
    )
  }
})

export default Header
