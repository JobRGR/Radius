import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Mui from 'material-ui'
import {Link} from 'react-router'
import CityService from '../../services/city'
import fetch from 'isomorphic-fetch'

const {AppBar, Card, FlatButton, RaisedButton, TextField} = Mui

const googleGetUrl = 'https://maps.google.com/maps/api/geocode/json?address='

export default React.createClass({
  mixins: [PureRenderMixin],

  handleFinishClick() {
    CityService.finishPick(this.props.currentCity)
  },

  handleStartClick() {
    CityService.startPick(this.props.currentCity)
  },

  handleDepartureInput(e) {
    let url = googleGetUrl + encodeURIComponent(this.refs.textFieldDeparture.getValue())
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.status !== 'OK')
          throw new Error(res.status)
        let latLng = res.results[0].geometry.location
        let city = this.findNearestCity(latLng)
        if (!city)
          throw new Error('No cities found in this area')
        CityService.startPick(city);
      })
      .catch(err => {
        console.log(err)
      })
  },

  handleDestinationInput(e) {
    let url = googleGetUrl + encodeURIComponent(this.refs.textFieldDestination.getValue())
    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.status !== 'OK')
          throw new Error(res.status)
        let latLng = res.results[0].geometry.location
        let city = this.findNearestCity(latLng)
        if (!city)
          throw new Error('No cities found in this area')
        CityService.finishPick(city);
      })
      .catch(err => {
        console.log(err)
      })
  },

  findNearestCity(latLng) {
    let bestCity = null,
      bestDist = Infinity
    this.props.cities.forEach(city => {
      let dist = Math.pow(latLng.lat - city.lat, 2) + Math.pow(latLng.lng - city.lng, 2)
      if (dist < bestDist) {
        bestCity = city
        bestDist = dist
      }
    })
    return bestCity
  },

  fixedFormat(metric) {
    return metric ? metric.toFixed(3) : 'null'
  },

  render() {
    return (
      <Card className='menu'>
        <AppBar title='Radius'
                iconElementRight={<FlatButton label="Clear Map"
                                              onClick={this.props.clearMap}/>}/>
        <RaisedButton
          label='START MAX-FLOW'
          onClick={this.props.handleRoadMaxFlow}
          primary={true}
          fullWidth={true}
          style={{marginTop: 5}}/>
        <RaisedButton
          label='START REVERSE-WAVE'
          onClick={this.props.handleRoadReverseWave}
          primary={true}
          fullWidth={true}
          style={{marginTop: 5}}/>
        <div className='city-search'>
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
        <div className='city-table'>
          <div className='city-row header-row'>
            <div className='city-row-column-big'>Тип</div>
            <div className='city-row-column'>Широта</div>
            <div className='city-row-column'>Долгота</div>
          </div>
          <div className='city-row'>
            <div className='city-row-column-big'>
              <RaisedButton
                label='текущая вышка'
                disabled={true}
                fullWidth={true}/>
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.currentCity.lat)}
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.currentCity.lng)}
            </div>
          </div>
          <div className='city-row'>
            <div className='city-row-column-big'>
              <RaisedButton
                label='начальная вышка'
                onClick={this.handleStartClick}
                secondary={true}
                fullWidth={true}/>
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.startCity.lat)}
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.startCity.lng)}
            </div>
          </div>
          <div className='city-row'>
            <div className='city-row-column-big'>
              <RaisedButton
                label='конечная вышка'
                onClick={this.handleFinishClick}
                secondary={true}
                fullWidth={true}/>
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.finishCity.lat)}
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.finishCity.lng)}
            </div>
          </div>
        </div>
        <div className='city-table'>
          <div className='city-row header-row'>
            <div className='city-row-column-big'>Алгоритм</div>
            <div className='city-row-column'>Max-Flow</div>
            <div className='city-row-column'>RVR-Wave</div>
          </div>
          <div className='city-row'>
            <div className='city-row-column-big'>
              Кол-во путей
            </div>
            <div className='city-row-column'>
              {this.props.maxFlow ? this.props.maxFlow.flow : null}
            </div>
            <div className='city-row-column'>
              {this.props.reverseWave ? this.props.reverseWave.flow : null}
            </div>
          </div>
          <div className='city-row'>
            <div className='city-row-column-big'>
              Средняя длина пути
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.maxFlow ? this.props.maxFlow.avgDist / 1000 : null)}
            </div>
            <div className='city-row-column'>
              {this.fixedFormat(this.props.reverseWave ? this.props.reverseWave.avgDist / 1000 : null)}
            </div>
          </div>
        </div>
        <RaisedButton
          label='Показать результаты'
          onClick={this.props.handleOpenResults}
          secondary={true}
          fullWidth={true}
          style={{marginTop: 5}}/>
      </Card>
    )
  }
})
