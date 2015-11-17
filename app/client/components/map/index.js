import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import TowerMixin from '../../mixins/tower_handler'
import DrawRoadMixin from '../../mixins/draw_road'
import MapService from '../../services/map'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const position = [48.5, 32.0];
const zoom = 6;

export default React.createClass({
    mixins: [PureRenderMixin, TowerMixin, DrawRoadMixin],

    getInitialState() {
        return {towers: []}
    },
    numById(id) {
        if (typeof id === 'object') return; //todo что это за объект?
        for (let i = 0; i<this.state.towers.length; ++i)
            if (this.state.towers[i]._id == id) return i;
    },
    objById(id) {
        if (typeof id === 'object') return;//todo что это за объект?

        for (let i = 0; i<this.state.towers.length; ++i){
            if (this.state.towers[i]._id == id) return this.state.towers[i];
        }

    },
    componentDidUpdate() {

        if (this.props.startTower.lat && this.props.finishTower.lat){
            const INF = 999999999999;
            let n = this.state.towers.length;
            let s = this.numById(this.props.startTower._id);
            let t = this.numById(this.props.finishTower._id);
            let g = [];
            let p = [];

            //for (var key1 in this.props.adjList){
            //    if (typeof key1 !== 'object') {
            //       // console.log('Tower ',key1,' ',this.objById(key1).type, ' has connections with');
            //        for (var key2 in this.props.adjList[key1])
            //            if (typeof this.props.adjList[key1][key2] !== 'object')
            //                if (this.objById(key1).type == "tower" && this.objById(this.props.adjList[key1][key2]).type=='bgp')
            //                console.log(key1, this.props.adjList[key1][key2]);
            //                //console.log('Tower ', this.props.adjList[key1][key2], ' ',this.objById(this.props.adjList[key1][key2]).type);
            //
            //               // console.log(this.props.adjList[key1][key2]);
            //    }
            //
            //}
            for (var key1 in this.props.adjList){
                    if (typeof key1 !== 'object') {
                        for (var key2 in this.props.adjList[key1])
                            if (typeof this.props.adjList[key1][key2] !== 'object'){
                                let pointA = {lat: this.objById(key1).lat, lng: this.objById(key1).lng};
                                let pointB = {lat: this.objById(this.props.adjList[key1][key2]).lat, lng: this.objById(this.props.adjList[key1][key2]).lng};
                                let points = [pointA, pointB];
                                this.drawPolylineWithTransition(points);
                            }
                    }
                }


            for (var key1 in this.props.adjList){
                const objA = this.objById(key1);
                const pointA = {lat: objA.lat, lng: objA.lng};
                const ind1 = this.numById(key1);
                g[ind1] = [];
                for (var key2 in this.props.adjList[key1]){
                    const objB = this.objById(this.props.adjList[key1][key2]);
                    if (objB != undefined) {
                        const pointB = {lat: objB.lat, lng: objB.lng};
                        const el = {
                            num: this.numById(this.props.adjList[key1][key2]),
                            val: this.distance(pointA, pointB)
                        };
                        g[ind1].push(el);
                    }
                }
            }

            let d = [], u = [];
            for (let i = 0; i<n; ++i){
                d[i] = INF;
                u[i] = 0;
            }

            d[s] = 0;

            for (let i=0; i<n; ++i) {
                let v = -1;
                for (let j=0; j<n; ++j)
                if (!u[j] && (v == -1 || d[j] < d[v]))
                    v = j;
                if (d[v] == INF)
                    break;
                u[v] = true;


                for (let j=0; j<g[v].length; ++j) {
                    let to = g[v][j].num,
                        len = g[v][j].val;
                    if (d[v] + len < d[to]) {
                        d[to] = d[v] + len;
                        p[to] = v;
                    }
                }
            }

            let path=[];
            if (d[t]!=INF) {
                for (let v=t; v!=s; v=p[v]) path.push (v);
                path.push (s);
            }
            else{
                //todo нету пути handler
            }


            let points = [];

            for (let i = 0; i<path.length; ++i)
                points.push(this.state.towers[path[i]]);

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
                     <TileLayer
                         url='http://gisfile.com/map/ukraine/{z}/{x}/{y}.png'
                         opacity={0.3}
                     />
                 </Map>
            </div>
        )
    }
})
