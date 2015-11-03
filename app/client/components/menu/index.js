import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Mui from 'material-ui'
import {Link} from 'react-router'
import TowerService from '../../services/tower'

const {AppBar, Card, Menu, MenuItem, RaisedButton} = Mui

let Header = React.createClass({
    mixins: [PureRenderMixin],


    handleFinishClick() {
        TowerService.finishPick(this.props.currentTower);
    },

    handleStartClick() {
        TowerService.startPick(this.props.currentTower);
    },

    render() {
        return (
            <div className="menu">
                <div >
                    <button onClick={this.handleStartClick}>Start tower</button>
                    <br/>lat: {this.props.startTower.lat}
                    <br/>lng: {this.props.startTower.lng}
                </div>
                <div>
                    <button onClick={this.handleFinishClick}>Finish tower</button>
                    <br/>lat: {this.props.finishTower.lat}
                    <br/>lng: {this.props.finishTower.lng}
                </div>
                <div>
                    Current tower:
                    <br/>lat: {this.props.currentTower.lat}
                    <br/>lng: {this.props.currentTower.lng}
                </div>
            </div>
        )
    }
})

export default Header
