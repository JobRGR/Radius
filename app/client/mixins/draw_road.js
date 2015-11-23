import TowerService from '../services/tower'

export default {
  distance (A, B){
    return Math.sqrt((A.lat-B.lat)*(A.lat-B.lat) + (A.lng-B.lng)*(A.lng-B.lng));
  },
  toRadians(x){
    return x*Math.PI/180;
  },
  distanceInKilometers(A, B){
    let R = 6371000; // metres
    let f1 = this.toRadians(A.lat);
    let f2 = this.toRadians(B.lat);
    let fi = this.toRadians((B.lat-A.lat));
    let delta = this.toRadians(B.lng-A.lng);

    let a = Math.sin(fi/2) * Math.sin(fi/2) +
        Math.cos(f1) * Math.cos(f2) *
        Math.sin(delta/2) * Math.sin(delta/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
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

  drawLineWithTransition(pointA, pointB, startTime, time, oldLine, totalDist){
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
    const newDist = totalDist + this.distanceInKilometers(pointA,newA);
    TowerService.pathBuildEnd((newDist/1000).toFixed(1));
    if (isBusted) return this.bLine(pointA,pointB,parameters);
    const newLine = this.bLine(pointA, newA, parameters);

    setTimeout(() => this.drawLineWithTransition(pointA, pointB, startTime, time, newLine, totalDist),20);
  },

  drawPolylineWithTransition(points, speed, dist){
    if (points.length <= 1) return;
    let transition = (this.distance(points[0],points[1]) / speed) || 100;

    const now = Date.now();
    this.drawLineWithTransition(points[0],points[1],now, transition, null, dist);
    dist += this.distanceInKilometers(points[0],points[1]);
    points.shift();
    setTimeout(() => this.drawPolylineWithTransition(points, speed, dist),transition);
  },

  makePath(start, finish){
    const path = this.getPath(start, finish);
    let MAP = this.refs.map.getLeafletElement();
    for(let i in MAP._layers) {
      if(MAP._layers[i]._path != undefined) {
        try {
          MAP.removeLayer(MAP._layers[i]);
        }
        catch(e) {
          console.log("problem with " + e + MAP._layers[i]);
        }
      }
    }

    if (path.err)
      return {errMsg: path.err, path:null}

    if (path.length == 1)
      return {errMsg:'NO PATH', path:null}

    return {errMsg:null, path:this.drawPolylineWithTransition(path,0.0025, 0)}
  }
}
