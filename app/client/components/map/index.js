import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import TowerMixin from '../../mixins/tower_handler'
import TowerService from '../../services/tower'
import DrawRoadMixin from '../../mixins/draw_road'
import GetPathMixin from '../../mixins/get_path'
import MapService from '../../services/map'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const position = [48.5, 32.0];
const zoom = 6;

export default React.createClass({
    mixins: [PureRenderMixin, GetPathMixin, TowerMixin, DrawRoadMixin],

    getInitialState() {
        return {towers: []}
    },
    buildRoad() {
        let path = this.makePath(this.props.startTower, this.props.finishTower);
        if (path.errMsg) alert(path.errMsg);
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
