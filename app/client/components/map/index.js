import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import TowerMixin from '../../mixins/tower-handler'
import MapService from '../../services/map'


const position = [48.5, 32.0];
const zoom = 6;

export default React.createClass({
    mixins: [PureRenderMixin, TowerMixin],

    getInitialState() {
        return {
            towers: []
        };
    },

    render() {

        return (
            <div className='map-container'>
                 <Map center={position} zoom={zoom} style={{width: '100%', height: '100%'}} ref='map'>
                     <TileLayer
                         url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     />
                    {this.getTowerElements()}
                </Map>
            </div>
        )
    }
})
