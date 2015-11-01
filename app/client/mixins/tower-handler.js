

export default {

    componentWillReceiveProps(nextProps) {
        let towers = nextProps.areas
            .map(area=>area.towers)
            .reduce((arr, cur)=>arr.concat(cur))

        let bgps = nextProps.areas
            .map(area=>area.bgps)
            .reduce((arr, cur)=>arr.concat(cur))

        //towers = [towers[0], towers[100], towers[200], towers[300], towers[400], towers[500], towers[600], towers[700], towers[800], towers[900]]
        //bgps = [bgps[0], bgps[100], bgps[200], bgps[300], bgps[400]]

        towers = towers.filter((tower, index)=>index%10==0)
        bgps = bgps.filter((bgp, index)=>index%10==0)

        towers.forEach((tower)=>{tower['type']='tower'})
        bgps.forEach((bgp)=>{bgp['type']='bgp'})
        towers.push(...bgps)

        this.setState({towers})
    },

    handleMouseEnter(index){
        let circle = this.refs[`circle${index}`].getLeafletElement()
        circle.setStyle({
            opacity: 1,
            fillOpacity: 0.2
        })
    },

    handleMouseLeave(index) {
        let circle = this.refs[`circle${index}`].getLeafletElement()
        circle.setStyle({
            opacity: 0,
            fillOpacity: 0
        })
    }

}
