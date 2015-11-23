import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Mui from 'material-ui'
import {Link} from 'react-router'
import {getDist} from '../../tools/buildGraph'
import TowerService from '../../services/tower'
import fetch from 'isomorphic-fetch'

const {
    AppBar, Card, Menu, MenuItem,
    RaisedButton, FlatButton, TextField,
    Table, TableRow, TableBody, TableHeader, TableRowColumn, TableHeaderColumn} = Mui

const googleGetUrl = 'https://maps.google.com/maps/api/geocode/json?address='

let Header = React.createClass({
    mixins: [PureRenderMixin],

    handleFinishClick() {
        TowerService.finishPick(this.props.currentTower);
    },

    handleStartClick() {
        TowerService.startPick(this.props.currentTower);
    },

    getTowerByName(inputName, emitName) {
        let url = googleGetUrl + encodeURIComponent(this.refs[inputName].getValue())
        fetch(url)
            .then(res => res.json())
            .then(res => {
                if (res.status !== 'OK')
                    throw new Error(res.status)
                let latLng = res.results[0].geometry.location
                let tower = this.findNearestTower(latLng)
                if (!tower)
                    throw new Error('No towers found in this area')
                TowerService[emitName](tower);
            })
            .catch(err => {console.log(err)})
    },

    findNearestTower(latLng) {
        let bestTower = null,
            bestDist = null
        this.props.areas.forEach(area => {
            area.towers.concat(area.bgps).forEach(tower => {
                let dist = getDist(tower, latLng)
                if (dist <= tower.radius && (dist < bestDist || bestTower === null)) {
                    bestTower = tower
                    bestDist = dist
                }
            })
        })

        return bestTower
    },

    handleDepartureInput(e) {
        this.getTowerByName('textFieldDeparture', 'startPick')
    },

    handleDestinationInput(e) {
        this.getTowerByName('textFieldDestination', 'finishPick')
    },

    fixedFormat(metric) {
        return metric ? metric.toFixed(4) : 'null'
    },
    render() {
        return (
            <Card className='menu'>
                <AppBar title='Radius' iconElementRight={<FlatButton onClick={this.props.handleRoad} label="START"/>}/>
                <div className='tower-search'>
                    <TextField
                        ref='textFieldDeparture'
                        hintText='Киев, улица Политехническая, 20'
                        floatingLabelText='Пункт отправления'
                        fullWidth={true}
                        inputStyle={{marginLeft:'5px'}}
                        hintStyle={{marginLeft:'5px'}}
                        floatingLabelStyle={{marginLeft:'5px'}}
                        onBlur={this.handleDepartureInput}
                    />
                    <TextField
                        ref='textFieldDestination'
                        hintText='Одесса, улица Дерибасовская, 1'
                        floatingLabelText='Пункт назначения'
                        fullWidth={true}
                        inputStyle={{marginLeft:'5px'}}
                        hintStyle={{marginLeft:'5px'}}
                        floatingLabelStyle={{marginLeft:'5px'}}
                        onBlur={this.handleDestinationInput}
                    />
                </div>
                <div className='tower-table'>
                    <div className='tower-row header-row'>
                        <div className='tower-row-column-big'>Тип</div>
                        <div className='tower-row-column'>Широта</div>
                        <div className='tower-row-column'>Долгота</div>
                    </div>
                    <div className='tower-row'>
                        <div className='tower-row-column-big'>
                            <RaisedButton
                                label='текущая вышка'
                                disabled={true}
                                fullWidth={true}/>
                        </div>
                        <div className='tower-row-column'>
                            {this.fixedFormat(this.props.currentTower.lat)}
                        </div>
                        <div className='tower-row-column'>
                            {this.fixedFormat(this.props.currentTower.lng)}
                        </div>
                    </div>
                    <div className='tower-row'>
                        <div className='tower-row-column-big'>
                            <RaisedButton
                                label='начальная вышка'
                                onClick={this.handleStartClick}
                                secondary={true}
                                fullWidth={true}/>
                        </div>
                        <div className='tower-row-column'>
                            {this.fixedFormat(this.props.startTower.lat)}
                        </div>
                        <div className='tower-row-column'>
                            {this.fixedFormat(this.props.startTower.lng)}
                        </div>
                    </div>
                    <div className='tower-row'>
                        <div className='tower-row-column-big'>
                            <RaisedButton
                                label='конечная вышка'
                                onClick={this.handleFinishClick}
                                secondary={true}
                                fullWidth={true}/>
                        </div>
                        <div className='tower-row-column'>
                            {this.fixedFormat(this.props.finishTower.lat)}
                        </div>
                        <div className='tower-row-column'>
                            {this.fixedFormat(this.props.finishTower.lng)}
                        </div>
                    </div>
                </div>
                <div className='tower-header'>
                    Расчет пути
                </div>
                <div className='tower-table'>
                    <div className='tower-row'>
                        <div className='tower-row-column'>
                            Пройденный путь
                        </div>
                        <div className='tower-row-column'>
                            {this.props.pathLength}
                        </div>
                    </div>
                    <div className='tower-row'>
                        <div className='tower-row-column'>
                            Затраченное время
                        </div>
                        <div className='tower-row-column'>
                            NULL
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
})

export default Header
