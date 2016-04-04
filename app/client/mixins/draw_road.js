export default {

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

  drawLineWithTransition(pointA, pointB, startTime, time, oldLine, color){
    const parameters = {
      color: color,
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
    if (oldLine) MAP.removeLayer(oldLine);
    if (isBusted) return this.bLine(pointA,pointB,parameters);
    const newLine = this.bLine(pointA, newA, parameters);
    setTimeout(() => this.drawLineWithTransition(pointA, pointB, startTime, time, newLine, color),20);
  },

  drawPolylineWithTransition(points, transition = 1500, color = 'red'){
    if (points.length <= 1) return;
    const now = Date.now();
    this.drawLineWithTransition(points[0],points[1],now,transition, null, color);
    points.shift();
    setTimeout(() => this.drawPolylineWithTransition(points, transition, color),transition);
  }
}
