import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SameMixin from '../../mixins/some_mixin'
import MapService from '../../services/map'
import Map from '../../components/map'
import Menu from '../../components/menu'


const Index = React.createClass({
  mixins: [PureRenderMixin, SameMixin],

  getInitialState() {
    return {areas: MapService.areas || []}
  },

  componentDidMount() {
    if (!this.state.length) {
      MapService.onLoad((areas) => {
        this.setState({areas})
      })
    }
  },

  render() {
    return (
      <div className='content'>
        <Menu />
        <Map areas={this.state.areas}/>
      </div>
    )
  }
})

export default Index
