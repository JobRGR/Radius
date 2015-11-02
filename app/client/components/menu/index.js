import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Mui from 'material-ui'
import {Link} from 'react-router'
import TowerService from '../../services/tower'


const {AppBar, Card, Menu, MenuItem, RaisedButton} = Mui

let Header = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        return {
            tower: {}
        }
    },

    componentDidMount() {
        TowerService.onTowerPick((tower) => {
            this.setState({tower})
        })
    },

    handleClick() {
        console.log('fired!')
    },

    render() {

        let tower = this.state.tower;
        let towerInfo = (
            <div>
                Lat:{tower.lat}
                <br/>Lng:{tower.lng}
            </div>)

        return (
            <Card className='menu'>
                <AppBar title='Radius'/>
                    <RaisedButton label='Начальная вышка' secondary={true} fullWidth={true}>
                    </RaisedButton>
                    {towerInfo}
                    <RaisedButton label='Конечная вышка' secondary={true} fullWidth={true}/>
                    {towerInfo}
                    <RaisedButton label='Текущая вышка' secondary={true} fullWidth={true} onClick={this.handleClick}/>
                    {towerInfo}
                </Card>
        )
    }
})

export default Header
