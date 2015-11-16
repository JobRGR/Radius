import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup} from 'react-leaflet'
import TowerMixin from '../../mixins/tower_handler'
import DrawRoadMixin from '../../mixins/draw_road'
import MapService from '../../services/map'


const position = [48.5, 32.0];
const zoom = 6;

export default React.createClass({
    mixins: [PureRenderMixin, TowerMixin, DrawRoadMixin],

    getInitialState() {
        return {towers: []}
    },
    numById(id) {
        for (let i = 0; i<this.state.towers.length; ++i)
            if (this.state.towers[i]._id == id) return i;
    },
    objById(id) {
        for (let i = 0; i<this.state.towers.length; ++i){
            console.log('We have ',this.state.towers[i]._id, ' with number', i);
            if (this.state.towers[i]._id == id) return this.state.towers[i];
        }

    },
    componentDidUpdate() {

        if (this.props.startTower.lat && this.props.finishTower.lat){
            const INF = 999999999999;
            let n = this.state.towers.length;
            let s = this.numById(this.props.startTower._id);
            let e = this.numById(this.props.finishTower._id);
            let g = [];

            let ind1 = 0;
            for (var key1 in this.props.adjList){
                const objA = this.objById(this.props.startTower._id);
                const pointA = {lat: objA.lat, lng: objA.lng};
                g[ind1] = [];
                for (var key2 in this.props.adjList[key1]){
                    console.log('We need ',this.props.adjList[key1][key2]);
                    const objB = this.objById(this.props.adjList[key1][key2]);
                    const pointB = {lat: objB.lat, lng: objB.lng};
                    const el = {num : this.numById(this.props.adjList[key1][key2]), val:this.distance(pointA, pointB)};
                    g[ind1].push(el);
                }

                ind1++;
            }

            let d = [], u = [];
            for (let i = 0; i<n; ++i){
                d[i] = INF;
                u[i] = 0;
            }

            dist[s] = 0;

            for (let i=0; i<n; ++i) {
                let v = -1;
                for (let j=0; j<n; ++j)
                if (!u[j] && (v == -1 || d[j] < d[v]))
                    v = j;
                if (d[v] == INF)
                    break;
                u[v] = true;


                for (let j=0; j<g[v].size(); ++j) {
                    let to = g[v][j].first,
                        len = g[v][j].second;
                    if (d[v] + len < d[to]) {
                        d[to] = d[v] + len;
                        p[to] = v;
                    }
                }
            }

            let path;
            for (let v=t; v!=s; v=p[v])
            path.push (v);
            path.push (s);


            let tmpPoints = []
            for (let i = 0; i < 10; i++) tmpPoints.push(this.state.towers[parseInt(Math.random() * 100)])
            tmpPoints = tmpPoints.sort((a, b) => a.lng > b.lng)
            let points = [this.props.startTower, ...tmpPoints, this.props.finishTower].map(({lat, lng}) => ({lat, lng}))
            let check = points.filter(({lat, lng}) => !lat || !lng)
            if (check.length) {
                return null
            }
            this.drawPolylineWithTransition(points)
        }

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
