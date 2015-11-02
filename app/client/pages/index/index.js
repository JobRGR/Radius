import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SameMixin from '../../mixins/some_mixin'
import MapService from '../../services/map'
import Map from '../../components/map'
import Menu from '../../components/menu'
import getAdjList from '../../tools/buildGraph'

const Index = React.createClass({
  mixins: [PureRenderMixin, SameMixin],

  getInitialState() {
    return {
      areas: MapService.areas || [],
      adjList: getAdjList(MapService.areas) || {}
    }
  },

  componentDidMount() {
    if (!this.state.length) {
      MapService.onLoad((areas) => {
        let adjList = getAdjList(areas)
        this.setState({
          areas,
          adjList
        })
      })
    }
  },

  render() {
    return (
      <div className='content'>
        <Menu/>
        <Map areas={this.state.areas} adjList={this.state.adjList}/>
      </div>
    )
  }
})

export default Index
