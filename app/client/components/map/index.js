import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import SameMixin from '../../mixins/some_mixin'
import MapService from '../../services/map'

const position = [48.5, 32.0];
const zoom = 6;

export default React.createClass({
    mixins: [PureRenderMixin, SameMixin],

    getInitialState: function(){
        return {
            visibility: [],
            towers: []
        };
    },

    componentWillReceiveProps: function(nextProps){
        let towers = nextProps.areas.map((area)=> {
            return area.towers
        }).reduce((arr, cur)=> {
            return arr.concat(cur)
        })
        towers = [towers[0], towers[100], towers[200], towers[300], towers[400], towers[500], towers[600], towers[700], towers[800], towers[900]]
        this.setState({
            towers,
            visibility: towers.map(()=>{return false})
        })
    },

    handleMouseEnter: function(index){
        let v = this.state.visibility.map(function(vi, i){
            if (i == index) return true;
            return vi;
        });
        this.setState({visibility: v});
    },

    handleMouseLeave: function(index){
        let v = this.state.visibility.map(function(vi, i){
            if (i == index) return false;
            return vi;
        });
        this.setState({visibility: v});
    },

    render() {
        let towers = this.state.towers.map((tower, index)=>{
            let circleOpt={
                key: tower._id + 'circle',
                center: [tower.lat, tower.lng],
                radius: tower.radius,
                fillOpacity: (this.state.visibility[index]?0.2:0),
                opacity: (this.state.visibility[index]?1:0),
                stroke: false
            }
            let markerOpt={
                key: tower._id + 'marker',
                ref: `marker${index}`,
                position: [tower.lat, tower.lng],
                onMouseover: ()=>this.handleMouseEnter(index),
                onMouseout: ()=>this.handleMouseLeave(index)
            }
            return (
                <LayerGroup>
                    <Marker {...markerOpt}/>
                    <Circle {...circleOpt}/>
                </LayerGroup>
            );
        });
        return (
            <div className='map-container'>
                 <Map center={position} zoom={zoom} style={{width: '100%', height: '100%'}} ref='map'>
                     <TileLayer
                         url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                     />
                    {towers}
                </Map>
            </div>
        )
    }
})
