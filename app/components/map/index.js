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
  componentDidMount: function() {

    var MAP = this.refs.map.getLeafletElement();
    var parameters = {
      color: 'red',
      weight: 3,
      opacity: 1,
      smoothFactor: 1
    };

    function bLine(A,B,param){
      var line = new L.Polyline([A, B], param);
      line.addTo(MAP);
      return line;
    }

    function drawLineWithTransition(pointA, pointB, startTime, time, oldLine){
      var now = new Date().getTime();
      var dt = now-startTime;

      var newLat = pointA.lat + (pointB.lat - pointA.lat) * dt / time;
      var newLng = pointA.lng + (pointB.lng - pointA.lng) * dt / time;
      var newA = new L.LatLng(newLat, newLng);

      if (oldLine != undefined) MAP.removeLayer( oldLine );

      if (newLat>pointA.lat && newLat>pointB.lat) {bLine(pointA,pointB,parameters);return;}
      if (newLat<pointA.lat && newLat<pointB.lat) {bLine(pointA,pointB,parameters);return;}
      if (newLng>pointA.lng && newLng>pointB.lng) {bLine(pointA,pointB,parameters);return;}
      if (newLng<pointA.lng && newLng<pointB.lng) {bLine(pointA,pointB,parameters);return;}

      var newLine = bLine(pointA, newA, parameters);

      setTimeout(function(){drawLineWithTransition(pointA, pointB, startTime, time, newLine);},20);
    }

    function drawPolylineWithTransition(points, transition){
      if (points.length <= 1) return;
      drawLineWithTransition(points[0],points[1],new Date().getTime(),transition);
      points.splice(0, 1);
      setTimeout(function(){drawPolylineWithTransition(points, transition)},transition);
    }

    var pointA = new L.LatLng(48, 33);
    var pointB = new L.LatLng(49, 35);
    var pointC = new L.LatLng(44, 37);
    var pointD = new L.LatLng(46, 39);
    var pointE = new L.LatLng(51, 42);
    var pointF = new L.LatLng(50, 37);

    drawPolylineWithTransition([pointA, pointB, pointC, pointD, pointE, pointF],2000);
    //firstpolyline.addTo(this.refs.map.getLeafletElement());

  }
})
