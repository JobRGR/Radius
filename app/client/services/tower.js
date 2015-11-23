import {EventEmitter} from 'events'

class Tower extends EventEmitter {
    constructor() {
        super()
        this.tower = null;
        this.startTower = null;
        this.finishTower = null;
        this.pathLength = 0;
    }

    onTowerPick(cb) {
        this.on('picked', cb)
    }

    onPathBuildEnd(cb) {
        this.on('pathBuildEnd', cb)
    }

    onStartTowerPick(cb) {
        this.on('startPicked', cb)
    }

    onFinishTowerPick(cb) {
        this.on('finishPicked', cb)
    }

    offTowerPick(cb) {
        this.removeListener('picked', cb)
    }

    pick(tower) {
        this.tower = tower
        this.emit('picked', this.tower)
    }

    startPick(tower) {
        this.startTower = tower
        this.emit('startPicked', this.startTower)
    }

    finishPick(tower) {
        this.finishTower = tower
        this.emit('finishPicked', this.finishTower)
    }

    pathBuildEnd(length) {
        this.pathLength = length
        this.emit('pathBuildEnd', this.pathLength)
    }
}

export default new Tower()
