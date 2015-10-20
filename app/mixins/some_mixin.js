import {Navigation} from 'react-router'
import log from '../tools/log'

export default {
  mixins: [Navigation],

  componentWillMount() {
    log('[this]:', this.props)
  }
}
