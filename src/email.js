import React from 'react';
import {getDist, getNeighbor} from './helperFunc.js';
import SplitMatch from './splitMatch.js';
import Bar from './bar.js';
import {format} from 'd3-format'

class Email extends React.Component {
  constructor(props){
    super(props);

    this.testFromTs = this.testFromTs.bind(this);
    // this.getDist = this.getDist.bind(this);
    // this.getNeighbor = this.getNeighbor.bind(this);
  }

  // use train_source to get test str
  testFromTs = (ts, testData, trainIdIdx, textIdx) => {
    const trids = testData.map(x => {return x[trainIdIdx]});
    const tsIdx = trids.reduce(function(a, val, i, trids){
      if (val === ts) {
        a.push(i);
      }
      return a;
    }, []);
    const testTxt = tsIdx.map(x => {
      return(testData[x][textIdx]);
    });
    return testTxt;
  }

  // use test str to get distances of that test str neighbors
//   getDist = (str) => {
//     const testStr = props.test.data.map(x => {return x[0]});
//     const i = testStr.indexOf(str);
//     const numNeighbor = Array(props.test.data[0][2].length);
//     const distList = [];
//     numNeighbor.map(x =>
//       distList.push({ count: String(x), val: format("0.4f")(Number(props.test.data[i][2][x])), scaledVal: Number((props.test.data[i][2][x]) ) }));
//     return distList;
//   }
// // use test str to get test str neighbors
//   getNeighbor = (str) => {
//     const testStr = props.test.data.map(x => {return x[0]});
//     const i = testStr.indexOf(str);
//     const numNeighbor = Array(props.test.data[0][2].length);
//     const nList = numNeighbor.map(x => {
//       return(props.test.data[i][1][x]);
//     })
//     return nList;
//   }

  render () {
    return (
        this.testFromTs(this.props.ts, this.props.testData, this.props.trainIdIdx, this.props.textIdx).map((t, i) =>
          <React.Fragment key={t+String(i)}>
              <SplitMatch style={{ display: 'inline-block' }} baseStr={t} sentVal={this.props.trainData}/>
              <div style={{ display: 'inline-block'}}>
                <Bar
                  myData={getDist(t, this.props.testData, this.props.textIdx, this.props.distIdx)}
                  y={this.props.scale == "same"? "scaledVal" : "val"}
                  x={"count"}
                  neighborData={getNeighbor(t, this.props.testData, this.props.textIdx, this.props.nbIdx)}
                  textData={t}
                  textIdx={this.props.textIdx}
                  trainData={this.props.trainData}
                  scaleType={this.props.scale}/>
              </div>

          </React.Fragment>
        )
    )
  }
}

export default Email;
