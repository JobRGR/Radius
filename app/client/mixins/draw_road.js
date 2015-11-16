export default {
  distance (A, B){
    return Math.sqrt((A.lat-B.lat)*(A.lat-B.lat) + (A.lng-B.lng)*(A.lng-B.lng));
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
    if (oldLine) MAP.removeLayer(oldLine);
    if (isBusted) return this.bLine(pointA,pointB,parameters);
    const newLine = this.bLine(pointA, newA, parameters);
    setTimeout(() => this.drawLineWithTransition(pointA, pointB, startTime, time, newLine),20);
  },

  drawPolylineWithTransition(points, speed = 0.0025){
    if (points.length <= 1) return;
    let transition = (this.distance(points[0],points[1]) / speed) || 100;

    console.log(transition, this.distance(points[0],points[1]), speed);
    const now = Date.now();
    this.drawLineWithTransition(points[0],points[1],now,transition);
    points.shift();
    setTimeout(() => this.drawPolylineWithTransition(points, speed),transition);
  }
}
