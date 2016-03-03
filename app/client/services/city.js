import {EventEmitter} from 'events'

class City extends EventEmitter {
    constructor() {
        super()
        this.city = null;
        this.startCity = null;
        this.finishCity = null;
    }

    onCityPick(cb) {
        this.on('picked', cb)
    }

    onStartCityPick(cb) {
        this.on('startPicked', cb)
    }

    onFinishCityPick(cb) {
        this.on('finishPicked', cb)
    }

    offCityPick(cb) {
        this.removeListener('picked', cb)
    }

    pick(city) {
        this.city = city
        this.emit('picked', this.city)
    }

    startPick(city) {
        this.startCity = city
        this.emit('startPicked', this.startCity)
    }

    finishPick(city) {
        this.finishCity = city
        this.emit('finishPicked', this.finishCity)
    }
}

export default new City()
