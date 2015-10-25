import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SameMixin from '../../mixins/some_mixin'
import MapService from '../../services/map'
import Map from '../../components/map'
import Menu from '../../components/menu'


const Index = React.createClass({
  mixins: [PureRenderMixin, SameMixin],

  getInitialState() {
    return {area: MapService.area || []}
  },

  componentWillMount() {
    if (!this.state.length) {
      MapService.onLoad((areas) => {
        console.log(areas)
        this.setState({areas})
      })
    }
  },

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
