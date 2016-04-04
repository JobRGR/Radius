import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import CityMixin from '../../mixins/city_handler'
import DrawRoadMixin from '../../mixins/draw_road'
import MapService from '../../services/map'
import {getDist} from '../../tools/buildGraph'
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const position = [48.5, 32.0]
const zoom = 6
const colors = [
    '#000000',
    '#808080',
    '#C0C0C0',
    '#FFFFFF',
    '#800000',
    '#FF0000',
    '#808000',
    '#FFFF00',
    '#008000',
    '#00FF00',
    '#008080',
    '#00FFFF',
    '#000080',
    '#0000FF',
    '#800080',
    '#FF00FF'
]
let visited = [], g = [], c = [], f = [], p = [], cc = 0


export default React.createClass({
    mixins: [PureRenderMixin, CityMixin, DrawRoadMixin],

    getInitialState() {
        return {cities: []}
    },

    bfs(s, t) {
        for(let i = 0; i < visited.length; ++i)
            visited[i] = false
        let queue = [s]
        visited[s] = true
        while(queue.length) {
            let v = queue.shift()
            if (v == t) return true
            g[v].forEach(u => {
                if (!visited[u] && c[v][u] - f[v][u] > 0) {
                    queue.push(u)
                    p[u] = v
                    visited[u] = true
                }
            })
        }
        return false
    },

    buildRoad() {
        let cities = this.state.cities,
            startCity = this.props.startCity,
            finishCity = this.props.finishCity
        for(let i = 0; i < cities.length; ++i) {
            if (cities[i].name == startCity.name)
                startCity = i
            if (cities[i].name == finishCity.name)
                finishCity = i
        }
        for(let i = 0; i < cities.length; ++i) {
            g.push([])
            c.push([])
            f.push([])
            visited.push(false)
            p.push(-1)
            for(let j = 0; j < cities.length; ++j) {
                let dist = getDist(cities[i], cities[j])
                if (i != j && dist < 100000) {
                    g[i].push(j)
                    c[i].push(1)
                } else {
                    c[i].push(0)
                }
                f[i].push(0)
            }
        }
        while(this.bfs(startCity, finishCity)) {
            let v = finishCity,
                cf = Infinity
            while (v != startCity) {
                cf = Math.min(cf, c[p[v]][v] - f[p[v]][v])
                v = p[v]
            }
            v = finishCity
            while (v != startCity) {
                f[p[v]][v] += cf
                f[v][p[v]] = -f[p[v]][v]
                v = p[v]
            }
        }
        let flow = 0
        g[startCity].forEach(u => {
            flow += f[startCity][u]
        })
        for(let i = 0; i < g[finishCity].length; ++i) {
            let v = g[finishCity][i],
                u = finishCity
            if (!f[v][u]) continue
            let points = [cities[finishCity]]
            while(v != startCity) {
                console.log(v)
                points.push(cities[v])
                f[v][u] = f[u][v] = 0
                u = v
                for(let j = 0; j < g[u].length; ++j){
                    v = g[u][j]
                    if (f[v][u]) break
                }
            }
            points.push(cities[startCity])
            this.drawPolylineWithTransition(points, 1500, colors[(cc++) % colors.length])
        }
        console.log('flow:', flow)
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
