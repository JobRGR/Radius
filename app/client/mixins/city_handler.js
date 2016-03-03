import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Map, MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup} from 'react-leaflet'
import CityService from '../services/city'

export default {

    componentWillReceiveProps(nextProps) {
        if (!Array.isArray(nextProps.cities)) return
        let map = this.refs.map.getLeafletElement()
        let BlueIcon = L.Icon.Default
        let markerCluster = new L.MarkerClusterGroup({maxClusterRadius:160})
        let markers = []
        let cities = nextProps.cities.map(city => {
            city.lng = parseFloat(city.lng)
            city.lat = parseFloat(city.lat)
            city.type = 'city'
            city.leafletCluster = markerCluster
            city.leafletElement = new L.Marker([city.lat, city.lng], {icon: new BlueIcon()})
              .bindPopup('lat:' +  city.lat.toFixed(4) + '<br/>lng:' + city.lng.toFixed(4))
            city.leafletElement.on('click', () => this.handleClick(city))
            markers.push(city.leafletElement)
            return city
        })
        markerCluster.addLayers(markers)
        map.addLayer(markerCluster)
        this.setState({cities})
    },

    handleClick(city){
        const circle = this.state.cities.filter(city1 => city1._id == city._id).pop().leafletCircle
        CityService.pick(city)
    }
}
