import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import MapService from '../../services/map'
import CityService from '../../services/city'
import Map from '../../components/map'
import Menu from '../../components/menu'
import RightNav from '../../components/right-nav'
import LeftNav from 'material-ui/lib/left-nav'
import AppBar from 'material-ui/lib/app-bar'


const Index = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      cities: MapService.cities || [],
      currentCity: CityService.currentCity || {},
      startCity: CityService.startCity || {},
      finishCity: CityService.finishCity || {},
      flow: null,
      avgDist: null,
      paths: []
    }
  },

  componentDidMount() {
    MapService.onLoad(cities => this.setState({cities}))
    CityService.onCityPick(currentCity => this.setState({currentCity}))
    CityService.onStartCityPick(startCity => this.setState({startCity}))
    CityService.onFinishCityPick(finishCity => this.setState({finishCity}))
  },

  setResultMaxFlow(flow, avgDist, paths) {
    this.setState({flow, avgDist, paths})
  },

  setResultReverseWave() {
    /*code here*/
  },

  render() {
    const menuOptions = {
      currentCity: this.state.currentCity,
      startCity: this.state.startCity,
      finishCity: this.state.finishCity,
      cities: this.state.cities,
      flow: this.state.flow,
      avgDist: this.state.avgDist,
      clearMap: () => this.refs.map.clearMap(),
      handleRoadMaxFlow: () => this.refs.map.buildRoadMaxFlow(),
      handleRoadReverseWave: () => this.refs.map.buildRoadReverseWave(),
      handleOpenResults: () => this.refs.rightNav.handleOpen()
    }
    const mapOptions = {
      ref: 'map',
      cities: this.state.cities,
      currentCity: this.state.currentCity,
      startCity: this.state.startCity,
      finishCity: this.state.finishCity,
      setResultMaxFlow: this.setResultMaxFlow,
      setResultReverseWave: this.setResultReverseWave
    }
    const navOptions = {
      ref: 'rightNav',
      paths: this.state.paths
    }
    return (
      <div className='content'>
        <RightNav {...navOptions}/>
        <Menu {...menuOptions}/>
        <Map {...mapOptions}/>
      </div>
    )
  }
})

export default Index
