import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import SameMixin from '../../mixins/some_mixin'

const position = [48.6093353, 33.6638786];

export default React.createClass({
  mixins: [PureRenderMixin, SameMixin],
  render() {
    return (
      <div className='map-container'>
        <Map onLeafletMove={this.MoveHandler} center={position} zoom={6} style={{width: '100%', height: '100%'}} minZoom={6} maxZoom={10} ref='map'>
          <TileLayer
            url='https://a.tiles.mapbox.com/v3/mapbox.world-light/{z}/{x}/{y}.png'
          />
        </Map>
      </div>
    )
  },
  MoveHandler: function(event) {
    //console.log(this.refs.map.getLeafletElement().getCenter());
    var pos = this.refs.map.getLeafletElement().getCenter();
    //TODO: borders of Ukraine
    //if (pos.lng > 34) {
    //  var newPos = pos;
    //  newPos.lng = 34;
    //  this.refs.map.getLeafletElement().setView(newPos);
    //}
    //if (pos.lng < 30) {
    //  var newPos = pos;
    //  newPos.lng = 30;
    //  this.refs.map.getLeafletElement().setView(newPos);
    //}
    //if (pos.lat > 45) {
    //  var newPos = pos;
    //  newPos.lat = 45;
    //  this.refs.map.getLeafletElement().setView(newPos);
    //}
    //if (pos.lat < 47) {
    //  var newPos = pos;
    //  newPos.lat = 47;
    //  this.refs.map.getLeafletElement().setView(newPos);
    //}
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
  drawPolylineWithTransition(points, transition){
    if (points.length <= 1) return;
    const now = Date.now();
    this.drawLineWithTransition(points[0],points[1],now,transition);
    points.shift();
    setTimeout(() => this.drawPolylineWithTransition(points, transition),transition);
  },
  componentDidMount() {

    let points = [[48,33], [49,35], [44,37], [46,39], [51,42], [50,37]].map(([x, y]) => new L.LatLng(x, y));

    this.drawPolylineWithTransition(points,500);
  }
})
