import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import SameMixin from '../../mixins/some_mixin'
import MapService from '../../services/map'
import TowerService from '../../services/tower'
import Map from '../../components/map'
import Menu from '../../components/menu'
import {getAdjList} from '../../tools/buildGraph'

const Index = React.createClass({
  mixins: [PureRenderMixin, SameMixin],

  getInitialState() {
    return {
      areas: MapService.areas || [],
      adjList: getAdjList(MapService.areas) || {},
      currentTower: TowerService.currentTower || {},
      startTower: TowerService.startTower || {},
      finishTower: TowerService.finishTower || {},
      pathLength: TowerService.finishTower || 0
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

      TowerService.onTowerPick((currentTower) => {
        this.setState({currentTower})
      })

      TowerService.onStartTowerPick((startTower) => {
        this.setState({startTower})
      })

      TowerService.onFinishTowerPick((finishTower) => {
        this.setState({finishTower})
      })

      TowerService.onPathBuildEnd((pathLength) => {
        this.setState({pathLength})
      })
    }
  },

  render() {

    let menuOptions = {
      currentTower: this.state.currentTower,
      startTower: this.state.startTower,
      finishTower: this.state.finishTower,
      areas: this.state.areas,
      handleRoad: () => this.refs.map.buildRoad(),
      pathLength: this.state.pathLength
    }

    let mapOptions = {
      ref: 'map',
      areas: this.state.areas,
      adjList: this.state.adjList,
      currentTower: this.state.currentTower,
      startTower: this.state.startTower,
      finishTower: this.state.finishTower
    }

    return (
      <div className='content'>
        <Menu {...menuOptions}/>
        <Map {...mapOptions}/>
      </div>
    )
  }
})

export default Index
