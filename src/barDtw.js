import React from 'react';
import ColorDtw from './colorDtw.js';

import { Chart, BarSeries, Title, ArgumentAxis, ValueAxis, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, HoverState, ValueScale } from '@devexpress/dx-react-chart';
import {format} from 'd3-format';

const chartStyle = {
  paddingLeft: '5px',
  paddingRight: '5px',
  paddingBottom: '3px',
  paddingTop: '3px',
  flexDirection: 'row',
  position: 'relative',
  top: '5px',
  borderStyle:'solid',
  borderWidth: '1px',
  marginLeft: '5px',
  marginRight: '5px',
  borderColor: 'gray'
}

const modifyDomain = domain => [0, 0.220];
const myFormat = obj => obj.tickFormat(null, format('.4f'));
class BarDtw extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      targetEl: 0
    };

    this.changeHover = target => this.setState({
      targetEl : target ? target.point : 0
    })
    this.lookupTrain = this.lookupTrain.bind(this);
  }

  lookupTrain = (key) => {
    const i = props.train.index.indexOf(key);
    return props.train.data[i][0];
  }


  render() {
    // console.log(modifyDomain());
    return(

      <Chart style={chartStyle}
        data={this.props.myData} width={70} height={30}>
        {this.props.scaleType == "same" && <ValueScale modifyDomain={modifyDomain}/>}
      <BarSeries
        width="9%"
        valueField={this.props.y}
        argumentField={this.props.x}
      />

      <EventTracker/>
      <HoverState onHoverChange={this.changeHover}/>
      <Tooltip contentComponent={() =>

        <ColorDtw
          str1={this.props.type == "char" ?
          this.lookupTrain(this.props.neighborData[this.state.targetEl]).split(""):this.lookupTrain(this.props.neighborData[this.state.targetEl]).split(" ")}
          str2={this.props.type == "char" ?
          this.props.textData.split("") : this.props.textData.split(" ")}
          type={this.props.type}
        />
      }/>

      </Chart>


    )
  }
}

export default BarDtw;
