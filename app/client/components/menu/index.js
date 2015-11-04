import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Mui from 'material-ui'
import {Link} from 'react-router'
import TowerService from '../../services/tower'

const {
    AppBar, Card, Menu, MenuItem,
    RaisedButton, FlatButton,
    Table, TableRow, TableBody, TableHeader, TableRowColumn, TableHeaderColumn} = Mui

let Header = React.createClass({
    mixins: [PureRenderMixin],

    handleFinishClick() {
        TowerService.finishPick(this.props.currentTower);
    },

    handleStartClick() {
        TowerService.startPick(this.props.currentTower);
    },

    fixedFormat(metric) {
        return metric ? metric.toFixed(4) : 'null'
    },

    render() {
        return (
            <Card className='menu'>
                <AppBar title='Radius' iconElementRight={<FlatButton label="START"/>}/>
                <div className='tower-header'>
                    Выбор вышек
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
                            NULL
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
