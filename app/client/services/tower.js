import {EventEmitter} from 'events'

class Tower extends EventEmitter {
    constructor() {
        super()
        this.tower = null;
    }

    onTowerPick(cb) {
        this.on('picked', cb)
    }

    offTowerPick(cb) {
        this.removeListener('picked', cb)
    }

    pick(tower) {
        this.tower = tower;
        this.emit('picked', this.tower)
    }
}

export default new Tower()
