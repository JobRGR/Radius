import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Marker, Circle, LayerGroup, MapComponent } from 'react-leaflet'
import $ from 'jquery'


export default class Tower extends MapComponent{
    constructor(props) {
        super(props);

        this.state = {
            towers: [],
            visibility: []
        };

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }
    componentDidMount() {
        $.getJSON('/api/tower', function(result) {
            result = result.tower;
            result = [result[0], result[100], result[200], result[300], result[400], result[500], result[600], result[700], result[800], result[900]];
            this.setState({
                towers: result,
                visibility: result.map(()=>{return false})
            });
        }.bind(this));
    }
    handleMouseEnter(index){
        let v = this.state.visibility.map(function(vi, i){
            if (i == index) return true;
            return vi;
        });
        this.setState({visibility: v});
    }
    handleMouseLeave(index){
        let v = this.state.visibility.map(function(vi, i){
            if (i == index) return false;
            return vi;
        });
        this.setState({visibility: v});
    }
    render() {
        var towers = this.state.towers.map((tower, index)=>{
            let circleOpt={
                key: tower._id + 'circle',
                center: [tower.lat, tower.lng],
                radius: tower.radius,
                fillOpacity: (this.state.visibility[index]?0.2:0),
                opacity: (this.state.visibility[index]?1:0),
                stroke: false
            }
            let markerOpt={
                key: tower._id + 'marker',
                position: [tower.lat, tower.lng],
                onMouseover: ()=>this.handleMouseEnter(index),
                onMouseout: ()=>this.handleMouseLeave(index)
            }
            return (
                <LayerGroup>
                    <Marker {...markerOpt}/>
                    <Circle {...circleOpt}/>
                </LayerGroup>
            );
        });
        return (
            <LayerGroup>
                {towers}
            </LayerGroup>
        )
    }
}