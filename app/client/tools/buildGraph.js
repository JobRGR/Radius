function getDist(a, b){
    let R = 6371000,
        f1 = a.lat*Math.PI/180,
        f2 = b.lat*Math.PI/180,
        df = f2 - f1,
        dl = (b.lng - a.lng)*Math.PI/180,
        hrsin = Math.sin(df/2)*Math.sin(df/2) + Math.cos(f1)*Math.cos(f2)*Math.sin(dl/2)*Math.sin(dl/2)

    return 2 * R * Math.atan2(Math.sqrt(hrsin), Math.sqrt(1 - hrsin))
}

export default function getAdjList(areas){
    if (!areas) return null

    let adjList = {}

    areas
        .forEach((area)=>{
            let arr = [...area.towers, ...area.bgps]
            arr.forEach(a => {
                adjList[a._id] = arr
                    .filter(b => a._id != b._id && getDist(a, b) <= a.radius)
                    .map(b => b._id)
            })
        })

    areas
        .reduce((arr, area)=>arr.concat(area.bgps), [])
        .forEach(a =>{
            let arr = areas.filter(b=>a.area != b.area && getDist(a, b) <= a.radius)
            adjList[a._id].push(...arr)
        })

    return adjList
}
