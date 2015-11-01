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

    getTowerElements() {

        let GreenIcon = L.Icon.Default.extend({
            options:{
                iconUrl: 'images/components/map/marker-icon-green.png'
            }
        })

        let BlueIcon = L.Icon.Default;

        let towers = this.state.towers.map((tower, index)=>{
            let color = tower.type=='tower'?'#0000ff':'#00ff00'

            let circleOpt={
                key: `circle${tower.id}`,
                ref: `circle${index}`,
                center: [tower.lat, tower.lng],
                radius: tower.radius,
                color: color,
                fillColor: color,
                weight: 2,
                opacity: 0,
                fillOpacity: 0
            }

            let markerOpt={
                key: `marker${tower.id}`,
                ref: `marker${index}`,
                position: [tower.lat, tower.lng],
                icon: tower.type=='tower'?new BlueIcon():new GreenIcon(),
                onMouseover: ()=>this.handleMouseEnter(index),
                onMouseout: ()=>this.handleMouseLeave(index)
            }
            return (
                <LayerGroup>
                    <Marker {...markerOpt}>
                        <Popup>
                            <span>
                            lat: {tower.lat.toFixed(4)}
                                <br/>lng: {tower.lng.toFixed(4)}
                            </span>
                        </Popup>
                    </Marker>
                    <Circle {...circleOpt}/>
                </LayerGroup>
            )
        })

        return towers;
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
