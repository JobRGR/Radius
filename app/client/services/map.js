import {EventEmitter} from 'events'
import fetch from 'isomorphic-fetch'


class Map extends EventEmitter {
  constructor() {
    super()
    this.areas = null
    this.loading = null
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
    fetch('/api/all', {method: 'get'})
      .then(res => res.json())
      .then(res => this.setMap(res))
      .catch(err => this.setMap(null))
  }

  get cachedMap() {
    return this.posts
  }

  setMap(res) {
    this.loading = null
    this.areas = res ? res.areas : null
    this.emit('loaded', this.areas)
  }
}

export default new Map()