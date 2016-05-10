import {EventEmitter} from 'events'
import fetch from 'isomorphic-fetch'
import citiesList from '../../server/modules/init/city'


class Map extends EventEmitter {
  constructor() {
    super()
    this.cities = null
  }

  onLoad(cb) {
    this.on('loaded', cb)
  }

  offLoad(cb) {
    this.removeListener('loaded', cb)
  }

  load() {
    if (this.loading) return null
    this.loading = {}
    setTimeout(() => this.setMap({cities: citiesList}), 0)
  }

  get cachedMap() {
    return this.cities
  }

  setMap(res) {
    this.loading = null
    this.cities = res ? res.cities : null
    this.emit('loaded', this.cities)
  }
}

export default new Map()