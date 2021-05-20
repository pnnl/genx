import React, {Component} from 'react'
import {render} from 'react-dom'

import {GenX} from '../../src/'

import props from './props.json'

class Demo extends Component {
  render() {
    return <div>
      <h1>genx-widget Demo</h1>
      <GenX {...props}/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
