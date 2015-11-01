import React from 'react'
import ReactDOM from 'react-dom'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map,MapLayer, Marker, Popup, TileLayer, Circle, CircleMarker, LayerGroup, FeatureGroup } from 'react-leaflet'

export default {

    componentWillReceiveProps(nextProps) {

        let towers = nextProps.areas
            .map(area => area.towers)
            .reduce((arr, cur) => arr.concat(cur))
            .filter((tower, index) => index%10==0)

        let bgps = nextProps.areas
            .map(area => area.bgps)
            .reduce((arr, cur) => arr.concat(cur))
            .filter((bgp, index) => index%10==0)

        towers.forEach(tower => {tower.type='tower'})
        bgps.forEach(bgp => {bgp.type='bgp'})

        towers.push(...bgps)

        this.setState({towers})
    },

    handleMouseEnter(index) {
        let circle = this.refs[`circle${index}`].getLeafletElement()
        circle.setStyle({
            opacity: 1,
            fillOpacity: 0.2
        })
    },

    handleMouseLeave(index) {
        let circle = this.refs[`circle${index}`].getLeafletElement()
        circle.setStyle({
            opacity: 0,
            fillOpacity: 0
        })
    },

    getTowerElements() {

        let GreenIcon = L.Icon.Default.extend({
            options:{
                iconUrl: 'images/components/map/marker-icon-green.png'
            }
        })

        let BlueIcon = L.Icon.Default;


        let towers = this.state.towers.map((tower, index) => {
            let color = tower.type=='tower'?'#0000ff':'#00ff00'

            let circleOpt = {
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

            let markerOpt = {
                key: `marker${tower.id}`,
                ref: `marker${index}`,
                position: [tower.lat, tower.lng],
                icon: tower.type=='tower'?new BlueIcon():new GreenIcon(),
                onMouseover: () => this.handleMouseEnter(index),
                onMouseout: () => this.handleMouseLeave(index)
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
    }

}
