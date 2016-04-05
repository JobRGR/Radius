import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import MapService from '../../services/map'
import CityService from '../../services/city'
import Map from '../../components/map'
import Menu from '../../components/menu'


const Index = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      cities: MapService.cities || [],
      currentCity: CityService.currentCity || {},
      startCity: CityService.startCity || {},
      finishCity: CityService.finishCity || {},
      flow: null,
      avgDist: null
    }
  },

  componentDidMount() {
    MapService.onLoad(cities => this.setState({cities}))
    CityService.onCityPick(currentCity => this.setState({currentCity}))
    CityService.onStartCityPick(startCity => this.setState({startCity}))
    CityService.onFinishCityPick(finishCity => this.setState({finishCity}))
  },

  setDist(dist) {
    this.setState({avgDist: dist})
  },

  setFlow(flow) {
    this.setState({flow})
  },

  render() {
    const menuOptions = {
      currentCity: this.state.currentCity,
      startCity: this.state.startCity,
      finishCity: this.state.finishCity,
      cities: this.state.cities,
      flow: this.state.flow,
      avgDist: this.state.avgDist,
      handleRoad: () => this.refs.map.buildRoad()
    }
    const mapOptions = {
      ref: 'map',
      cities: this.state.cities,
      currentCity: this.state.currentCity,
      startCity: this.state.startCity,
      finishCity: this.state.finishCity,
      setFlow: this.setFlow,
      setDist: this.setDist
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
