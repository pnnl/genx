import React from 'react';
import SplitMatch from './splitMatch.js';
import { LightTooltip, lookupTrain } from './helperFunc.js';
import { Chart, BarSeries, Title, ArgumentAxis, ValueAxis, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, HoverState, ValueScale } from '@devexpress/dx-react-chart';

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
const modifyDomain = domain => [-0.015, 0.220];

// const lookupTrain = (key) => {
//   const i = props.train.index.indexOf(key);
//   return props.train.data[i][0];
// }

// function Bar(props) {
//   const [targetEl, setTargetEl] = useState(0);
//
//   return (
//     <span>
//       <Chart style={chartStyle} data={props.myData} width={70} height={30}>
//         {props.scaleType=="same" && <ValueScale modifyDomain={modifyDomain}/>}
//         <BarSeries width="9%" valueField={props.y} argumentField={props.x} />
//         <EventTracker/>
//         <HoverState onHoverChange={(target) => setTargetEl(target ? target.point : 0)}/>
//         <Tooltip contentComponent={() =>
//           <SplitMatch baseStr={this.lookupTrain(this.props.neighborData[this.state.targetEl])}
//             sentVal={this.props.textData}/>
//         }/>
//     </span>
//   )
// }

class Bar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      targetEl: 0
    };

    this.changeHover = target => this.setState({
      targetEl : target ? target.point : 0
    })
    // this.lookupTrain = this.lookupTrain.bind(this);
  }

  // lookupTrain = (key) => {
  //   const i = props.train.index.indexOf(key);
  //   return props.train.data[i][0];
  // }
  // <Chart style={chartStyle}
  //   data={this.props.myData} width={70} height={30}>
  //   {this.props.scaleType == "same" && <ValueScale modifyDomain={modifyDomain}/>}
  // <BarSeries
  //   width="9%"
  //   valueField={this.props.y}
  //   argumentField={this.props.x}
  // />
  //
  // <EventTracker/>
  // <HoverState onHoverChange={this.changeHover}/>
  // <Tooltip contentComponent={() =>
  //   <SplitMatch
  //   baseStr={lookupTrain(this.props.neighborData[this.state.targetEl], this.props.trainData, this.props.textIdx)}
  //     sentVal={this.props.textData}/>
  // }/>
  //
  //
  // </Chart>

  render() {
    return(

      this.props.myData
        .map((y, i) =>
          <LightTooltip key={y+String(i)}
            title={<SplitMatch baseStr={lookupTrain(this.props.neighborData[this.state.targetEl], this.props.trainData, this.props.textIdx)}
            sentVal={this.props.textData}/>
          }arrow placement="top">
            <div className="bar" style={{ height: parseFloat(format("0.4f")(20*y/2))}}/>
          </LightTooltip>
        )



    )
  }
}

export default Bar;
