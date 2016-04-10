import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import LeftNav from 'material-ui/lib/left-nav'
import {getDist} from '../../tools/build-graph'


export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {open: false}
  },

  handleOpen() {
    this.setState({open: true})
  },

  pathDiv(path, index) {
    let dist = 0
    for(let i = 1; i < path.length; ++i)
      dist += getDist(path[i - 1], path[i])
    dist /= 1000
    return (
      <div className='path-block'>
        <div className='path-index'>
          Путь #{index}:
          <br/>
          {dist.toFixed(3)}
        </div>
        {
          path.map(
              city => (
                <div className='path-element'>
                  {city.name.split('/')[0]}
                  <br/>
                  {`(${city.lat.toFixed(2)}, ${city.lng.toFixed(2)})`}
                </div>
              )
          )
        }
      </div>
    )
  },

  render() {
    return (
      <LeftNav
        docked={false}
        width={document.body.clientWidth*0.7}
        open={this.state.open}
        openRight={true}
        onRequestChange={open => this.setState({open})}
      >
        {
          this.props.paths.map((arr, ind) => this.pathDiv(arr, ind + 1))
        }
      </LeftNav>
    )
  }
})