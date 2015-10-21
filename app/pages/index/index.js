import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SameMixin from '../../mixins/some_mixin'
import Map from '../../components/map'
import Menu from '../../components/menu'


const Index = React.createClass({
  mixins: [PureRenderMixin, SameMixin],

  render() {
    return (
      <div className='content'>
        <Menu />
        <Map />
      </div>
    )
  }
})

export default Index
