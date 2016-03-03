import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import CityMixin from '../../mixins/city_handler'
import DrawRoadMixin from '../../mixins/draw_road'
import MapService from '../../services/map'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const position = [48.5, 32.0]
const zoom = 6

export default React.createClass({
    mixins: [PureRenderMixin, CityMixin, DrawRoadMixin],

    getInitialState() {
        return {cities: []}
    },

    buildRoad() {
        let tmpPoints = []
        for (let i = 0; i < 10; i++)
            tmpPoints.push(this.state.cities[parseInt(Math.random() * 100)])
        tmpPoints = tmpPoints.sort((a, b) => a.lng > b.lng)
        let points = [this.props.startCity, ...tmpPoints, this.props.finishCity].map(({lat, lng}) => ({lat, lng}))
        let check = points.filter(({lat, lng}) => !lat || !lng)
        if (check.length) {
            return null
        }
        this.drawPolylineWithTransition(points)
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
