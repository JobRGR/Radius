import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import CityMixin from '../../mixins/city_handler'
import DrawRoadMixin from '../../mixins/draw_road'
import MapService from '../../services/map'
import maxFlow from '../../tools/max-flow'
import reverseWave from '../../tools/reverse-wave'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const position = [48.5, 32.0]
const zoom = 6
const colors = ['#800000', '#FF0000', '#808000', '#FFFF00', '#008000', '#00FF00', '#008080', '#00FFFF', '#000080', '#0000FF', '#800080', '#FF00FF', '#000000', '#808080', '#C0C0C0', '#FFFFFF']
let cc = 0


export default React.createClass({
  mixins: [PureRenderMixin, CityMixin, DrawRoadMixin],

  getInitialState() {
    return {cities: [], lines: []}
  },

  clearMap() {
    let MAP = this.refs.map.getLeafletElement()
    let lines = this.state.lines
    lines.forEach(line => MAP.removeLayer(line))
    this.setState({line: []})
  },

  buildRoadMaxFlow() {
    let {flow, avgDist, paths} = maxFlow(this.props.cities, this.props.startCity, this.props.finishCity)
    for (let i = 0; i < paths.length; ++i)
      this.drawPolylineWithTransition(paths[i], 1500, colors[(cc++) % colors.length])
    this.props.setResultMaxFlow(flow, avgDist, paths)
  },

  buildRoadReverseWave() {
    let {flow, avgDist, paths, pathsToDraw} = reverseWave(this.props.cities, this.props.startCity, this.props.finishCity)
    for (let i = 0; i < pathsToDraw.length / 2; ++i) {
      this.drawPolylineWithTransition(pathsToDraw[2 * i], 1500, colors[cc % colors.length])
      this.drawPolylineWithTransition(pathsToDraw[2 * i + 1], 1500, colors[cc % colors.length])
      cc += 1
    }
    this.props.setResultReverseWave(flow, avgDist, paths)
  },

  render() {
    return (
      <div className='map-container'>
        <Map center={position} zoom={zoom} style={{width: '100%', height: '100%'}} ref='map'>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <TileLayer
            url='http://gisfile.com/map/ukraine/{z}/{x}/{y}.png'
            opacity={0.3}
          />
        </Map>
      </div>
    )
  }
})
