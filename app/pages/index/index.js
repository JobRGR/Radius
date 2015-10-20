import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import SameMixin from '../../mixins/some_mixin'

const position = [51.505, -0.09]

const Index = React.createClass({
  mixins: [PureRenderMixin, SameMixin],

  render() {
    return (
      <Map center={position} zoom={13}>
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    )
  }
})

export default Index
