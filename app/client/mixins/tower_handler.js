import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'
import TowerService from '../services/tower'

export default {

    componentWillReceiveProps(nextProps) {
        if (this.state.towers.length) return;

        let map = this.refs.map.getLeafletElement()

        let GreenIcon = L.Icon.Default.extend({
            options:{
                iconUrl: 'images/components/map/marker-icon-green.png'
            }
        })

        let BlueIcon = L.Icon.Default;

        let towers = nextProps.areas
            .map(area => {
                let markerCluster = new L.MarkerClusterGroup({maxClusterRadius:160})
                let markers = []
                let towers = area.towers
                    .map(tower => {
                        tower.type = 'tower'
                        tower.area = area.name
                        tower.leafletCluster = markerCluster
                        tower.leafletElement = new L.Marker([tower.lat, tower.lng], {icon: new BlueIcon()})
                            .bindPopup('lat:' +  tower.lat.toFixed(4) + '<br/>lng:' + tower.lng.toFixed(4))
                        markers.push(tower.leafletElement)
                        return tower
                    })
                towers = towers.concat(area.bgps
                        .map(tower => {
                            tower.type = 'bgp'
                            tower.area = area.name
                            tower.leafletCluster = markerCluster
                            tower.leafletElement = new L.Marker([tower.lat, tower.lng], {icon: new GreenIcon()})
                                .bindPopup('lat:' +  tower.lat.toFixed(4) + '<br/>lng:' + tower.lng.toFixed(4))
                            markers.push(tower.leafletElement)
                            return tower
                        })
                    )
                markerCluster.addLayers(markers)


                map.addLayer(markerCluster)
                return towers;
            })
            .reduce((arr, cur) => arr.concat(cur), [])

        towers.forEach(tower => {
            tower.leafletElement.on('mouseover', () => this.handleMouseEnter(tower._id))
            tower.leafletElement.on('mouseout', () => this.handleMouseLeave(tower._id))
            tower.leafletElement.on('click', () => this.handleClick(tower))

            let color = tower.type=='tower'?'#0000ff':'#00ff00'

            tower.leafletCircle = new L.Circle([tower.lat, tower.lng], tower.radius, {
                color: color,
                fillColor: color,
                weight: 2,
                opacity: 0,
                fillOpacity: 0
            })
            map.addLayer(tower.leafletCircle)
            console.log(tower.leafletCircle._leaflet_id)
        })

        this.setState({towers})
    },

    handleMouseEnter(id) {
        let circle = this.state.towers.filter(tower => tower._id == id).pop().leafletCircle
        circle.setStyle({
            fill: true,
            stroke: true,
            opacity: 1,
            fillOpacity: 0.2
        })
    },

    handleMouseLeave(id) {
        let circle = this.state.towers.filter(tower => tower._id == id).pop().leafletCircle
        circle.setStyle({
            fill: false,
            stroke: false
        })
    },

    handleClick(tower){
        let circle = this.state.towers.filter(tower1 => tower1._id == tower._id).pop().leafletCircle
        TowerService.pick(tower);
    }
}
