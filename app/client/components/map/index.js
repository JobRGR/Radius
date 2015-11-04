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

    bLine(A, B, param){
        let MAP = this.refs.map.getLeafletElement();
        let line = new L.Polyline([A, B], param);
        line.addTo(MAP);
        return line;
    },
    count (pointA, pointB, dt, time) {
        return [
            pointA.lat + (pointB.lat - pointA.lat) * dt / time,
            pointA.lng + (pointB.lng - pointA.lng) * dt / time
        ]
    },

    drawLineWithTransition(pointA, pointB, startTime, time, oldLine){
        const parameters = {
            color: 'red',
            weight: 3,
            opacity: 1,
            smoothFactor: 1
        };
        let MAP = this.refs.map.getLeafletElement();
        const now = Date.now();
        const dt = now - startTime;
        const [newLat, newLng] = this.count(pointA,pointB,dt,time);
        const newA = new L.LatLng(newLat, newLng);
        const isBusted = (
          (newLat>pointA.lat && newLat>pointB.lat)
          || (newLat<pointA.lat && newLat<pointB.lat)
          || (newLng>pointA.lng && newLng>pointB.lng)
          || (newLng<pointA.lng && newLng<pointB.lng)
        );
        if (oldLine != undefined) MAP.removeLayer(oldLine);
        if (isBusted) return this.bLine(pointA,pointB,parameters);
        const newLine = this.bLine(pointA, newA, parameters);
        setTimeout(() => this.drawLineWithTransition(pointA, pointB, startTime, time, newLine),20);
    },

    drawPolylineWithTransition(points, transition = 2000){
        if (points.length <= 1) return;
        const now = Date.now();
        this.drawLineWithTransition(points[0],points[1],now,transition);
        points.shift();
        setTimeout(() => this.drawPolylineWithTransition(points, transition),transition);
    },
    componentDidUpdate(){
        let tmpPoints = []
        for (let i = 0; i < 5; i++) tmpPoints.push(this.state.towers[parseInt(Math.random() * 100)])
        let points = [this.props.startTower, ...tmpPoints, this.props.finishTower].map(({lat, lng}) => ({lat, lng}))
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
                    {this.getTowerElements()}
                </Map>
            </div>
        )
    }
})
