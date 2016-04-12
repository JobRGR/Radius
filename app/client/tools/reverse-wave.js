import {getDist} from './build-graph'

let visitedS = [], visitedT = [],
    pathS = [], pathT = [],
    queueS = [], queueT = [], queue = [],
    links = [], used = [], g = []

function markPath(s, t, v) {
  let u = v
  while(u != s) {
    used[u] = true
    u = pathS[u]
  }
  u = v
  while(u != t) {
    used[u] = true
    u = pathT[u]
  }
}

function bfs(s, t) {
  let paths = [],
      pathsToDraw = []
  queueS = []
  queueT = []
  visitedS[s] = true
  visitedT[t] = true
  g[s].forEach(u => {
    if (u != t) {
      queueS.push(u)
      pathS[u] = s
      visitedS[u] = true
    }
  })
  g[t].forEach(u => {
    if (u != s) {
      queueT.push(u)
      pathT[u] = t
      visitedT[u] = true
    }
  })
  while (queueS.length || queueT.length) {
    queue = []
    while(queueS.length) {
      let u = queueS.shift()
      if (visitedT[u]) continue
      for(let i = 0; i < g[u].length; ++i) {
        let v = g[u][i]
        if (visitedS[v]) continue
        pathS[v] = u
        if (visitedT[v] && !used[v]) {
          markPath(s, t, v)
          links.push(v)
        } else if (!visitedS[v]) {
          queue.push(v)
        }
        visitedS[v] = true
        break
      }
    }
    queueS = [...queue]
    queue = []
    while(queueT.length) {
      let u = queueT.shift()
      if (visitedS[u]) continue
      for(let i = 0; i < g[u].length; ++i) {
        let v = g[u][i]
        if (visitedT[v]) continue
        pathT[v] = u
        if (visitedS[v] && !used[v]) {
          markPath(s, t, v)
          links.push(v)
        } else if (!visitedT[v]) {
          queue.push(v)
        }
        visitedT[v] = true
        break
      }
    }
    queueT = [...queue]
  }
  links.forEach(link => {
    let p = [], pp = [], v = link
    while(v != s) {
      p.push(v)
      pp.push(v)
      v = pathS[v]
    }
    p.push(s)
    pp.push(s)
    p.reverse()
    pp.reverse()
    pathsToDraw.push([...pp])
    v = link
    pp = []
    pp.push(v)
    while(v != t) {
      v = pathT[v]
      p.push(v)
      pp.push(v)
    }
    pp.reverse()
    paths.push(p)
    pathsToDraw.push([...pp])
  })
  return {paths, pathsToDraw}
}

function reverseWave(cities, startCity, finishCity) {
  for (let i = 0; i < cities.length; ++i) {
    if (cities[i].name == startCity.name)
      startCity = i
    if (cities[i].name == finishCity.name)
      finishCity = i
  }
  for (let i = 0; i < cities.length; ++i) {
    g[i] = []
    visitedS[i] = false
    visitedT[i] = false
    used[i] = false
    pathS[i] = -1
    pathT[i] = -1
    for (let j = 0; j < cities.length; ++j) {
      let dist = getDist(cities[i], cities[j])
      if (i != j && dist < 100000) g[i].push(j)
    }
  }
  for (let i = 0; i < cities.length; ++i)
    g[i].sort((a, b) => g[a].length > g[b].length)
  let {paths, pathsToDraw} = bfs(startCity, finishCity),
      flow = paths.length,
      avgDist = 0
  paths = paths.map(arr => arr.map(v => cities[v]))
  pathsToDraw = pathsToDraw.map(arr => arr.map(v => cities[v]))
  for (let i = 0; i < paths.length; ++i)
    for (let j = 1; j < paths[i].length; ++j)
      avgDist += getDist(paths[i][j - 1], paths[i][j])
  avgDist /= flow
  return {flow, avgDist, paths, pathsToDraw}
}

export default reverseWave