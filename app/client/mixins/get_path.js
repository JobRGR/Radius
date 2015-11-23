export default {
    numById(id) {
        for (let i = 0; i<this.state.towers.length; ++i)
            if (this.state.towers[i]._id == id) return i;
    },
    objById(id) {
        for (let i = 0; i<this.state.towers.length; ++i){
            if (this.state.towers[i]._id == id) return this.state.towers[i];
        }

    },
    getPath(A,B) {
        if (!A.lat)
            return {err: 'SELECT START TOWER'}
        if (!B.lat)
            return {err: 'SELECT FINISH TOWER'}


         const INF = 999999999999;
         let n = this.state.towers.length;
         let s = this.numById(this.props.startTower._id);
         let t = this.numById(this.props.finishTower._id);
         let g = [];
         let p = [];
         for (var key1 in this.props.adjList){
             const objA = this.objById(key1);
             const pointA = {lat: objA.lat, lng: objA.lng};
             const ind1 = this.numById(key1);
             g[ind1] = [];
             for (var key2 in this.props.adjList[key1]){
                 const objB = this.objById(this.props.adjList[key1][key2]);
                 if (objB != undefined) {
                     const pointB = {lat: objB.lat, lng: objB.lng};
                     const el = {
                         num: this.numById(this.props.adjList[key1][key2]),
                         val: this.distance(pointA, pointB)
                     };
                     g[ind1].push(el);
                 }
             }
         }
       let d = [], u = [];
         for (let i = 0; i<n; ++i){
             d[i] = INF;
             u[i] = 0;
         }
       d[s] = 0;
        for (let i=0; i<n; ++i) {
             let v = -1;
             for (let j=0; j<n; ++j)
                 if (!u[j] && (v == -1 || d[j] < d[v]))
                     v = j;
             if (d[v] == INF)
                 break;
             u[v] = true;
            for (let j=0; j<g[v].length; ++j) {
                 let to = g[v][j].num,
                     len = g[v][j].val;
                 if (d[v] + len < d[to]) {
                     d[to] = d[v] + len;
                     p[to] = v;
                 }
             }
         }
        let path=[];
        if (d[t]!=INF)
            for (let v=t; v!=s; v=p[v]) path.push (v);
        path.push (s);

        let points = [];
        for (let i = 0; i<path.length; ++i)
             points.push(this.state.towers[path[i]]);
        points.reverse();

        return points;
    }
}
