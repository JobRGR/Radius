import {getDist} from './build-graph'

let visited = [], g = [], c = [], f = [], p = [], paths = []

function bfs(s, t) {
  for (let i = 0; i < visited.length; ++i)
    visited[i] = false
  let queue = [s]
  visited[s] = true
  while (queue.length) {
    let v = queue.shift()
    if (v == t) return true
    g[v].forEach(u => {
      if (!visited[u] && c[v][u] - f[v][u] > 0) {
        queue.push(u)
        p[u] = v
        visited[u] = true
      }
    })
  }
  return false
}

function toCity(x) {
  return Math.floor(x / 2)
}

function maxFlow(cities, startCity, finishCity) {
  paths = []
  for (let i = 0; i < cities.length; ++i) {
    if (cities[i].name == startCity.name)
      startCity = 2 * i + 1
    if (cities[i].name == finishCity.name)
      finishCity = 2 * i
  }
  for (let i = 0; i < 2 * cities.length; ++i) {
    g[i] = []
    c[i] = []
    f[i] = []
    visited[i] = false
    p[i] = -1
    for (let j = 0; j < 2 * cities.length; ++j)
      c[i][j] = 0,
        f[i][j] = 0
  }
  for (let i = 0; i < cities.length; ++i) {
    g[2 * i].push(2 * i + 1)
    g[2 * i + 1].push(2 * i)
    c[2 * i][2 * i + 1] = 1
    for (let j = 0; j < cities.length; ++j) {
      let dist = getDist(cities[i], cities[j])
      if (i != j && dist < 100000) {
        g[2 * i + 1].push(2 * j)
        g[2 * j].push(2 * i + 1)
        c[2 * i + 1][2 * j] = 1
      }
    }
  }
  c[startCity - 1][startCity] = 0
  c[finishCity][finishCity + 1] = 0
  while (bfs(startCity, finishCity)) {
    let v = finishCity,
      cf = Infinity
    while (v != startCity) {
      cf = Math.min(cf, c[p[v]][v] - f[p[v]][v])
      v = p[v]
    }
    v = finishCity
    while (v != startCity) {
      f[p[v]][v] += cf
      f[v][p[v]] = -f[p[v]][v]
      v = p[v]
    }
  }

  let flow = 0,
    sumDist = 0
  for (let i = 0; i < g[startCity].length; ++i)
    flow += f[startCity][g[startCity][i]]
  for (let i = 0; i < g[finishCity].length; ++i) {
    let v = g[finishCity][i],
      u = finishCity
    if (!f[v][u]) continue
    let points = [cities[toCity(finishCity)]]
    while (v != startCity) {
      sumDist += getDist(cities[toCity(u)], cities[toCity(v)])
      points.push(cities[toCity(v)])
      f[v][u] = f[u][v] = 0
      u = v
      for (let j = 0; j < g[u].length; ++j) {
        v = g[u][j]
        if (f[v][u]) break
      }
    }
    sumDist += getDist(cities[toCity(u)], cities[toCity(v)])
    points.push(cities[toCity(startCity)])
    points.reverse()
    points = points.filter((item, index, arr) => arr.indexOf(item) == index)
    paths.push([...points])
  }
  let avgDist = flow ? sumDist / flow : null
  return {flow, avgDist, paths}
}

export default maxFlow