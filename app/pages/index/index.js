import React from 'react'
import {addons} from 'react/addons'
import SameMixin from '../../mixins/some_mixin'


let Index = React.createClass({
  mixins: [addons.PureRenderMixin, SameMixin],

  render() {
    return (
      <div>
      </div>
    )
  }
})

export default Index
