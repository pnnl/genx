import React from 'react';
import { getIdx, getUniqueTrain } from './helperFunc.js';
import { VictorySelectionContainer, VictoryAxis, VictoryChart, VictoryLine, VictoryScatter } from 'victory';

const NavLine = ({ distinctEmailId, testData, trainIdIdx, fullTestUuid, sendSelectedPts, sendLabel, sendPointData }) => {

  const tsData = getUniqueTrain(distinctEmailId, testData, trainIdIdx, fullTestUuid);
  // console.log(tsData);
  const numTs = new Set(tsData.map(x => x.trainSrc)).size;

  const handleHoverPoint = x => {
    if(x !== null){
      sendPointData(Array(distinctEmailId, x.datum));
    }
    else{
      sendPointData(null);
    }
  }

  const getHeight = (num) => {
    if(num === 1){
      return 80*num
    }
    else if(num === 2){
      return 55*num
    }
    else if(num === 3){
      return 45*num
    }
    else{
      return 25*num
    }
  }
  const handleSelection = x => sendSelectedPts(Array(distinctEmailId, x[0].data));
  const handleSelectionCleared = x => sendSelectedPts(null);

  const handleMouseover = x => {
    // console.log(x);
    sendLabel(Array(distinctEmailId, x.text))
  };
  const handleMouseOut = x =>  sendLabel(null);

  // console.log(tsData, "TSDATA")
  return <div>
    <VictoryChart
      width={550}
      height={getHeight(numTs)}
      padding={{left: 80, bottom: 20, right:50, top: 30}}
      minDomain={{x:numTs > 1 ? -0.5:0, y:-0.2}}
      containerComponent={
        <VictorySelectionContainer
          selectionDimension="x"
          onSelection={(points, bounds, props) => handleSelection(points, bounds, props)}
          onSelectionCleared={(props) => handleSelectionCleared(props)}
          responsive={false}

        />
      }
    >
      <VictoryAxis dependentAxis
        style={{
          grid: { stroke: "#c7cfd6", strokeWidth: 0.5 },
          axis: { strokeWidth: 2}
        }}
        tickFormat={(x) => x.split("-")[0]}
        events={[
          {
            target:"tickLabels",
            eventHandlers: {
              onMouseOver:() => {
                return [{
                  target: "tickLabels",
                  mutation: (props) => {
                    handleMouseover(props);
                    return {style: {fill: "tomato"}}
                  }
                }]
              },
              onMouseOut:() => {
                return [{
                  target: "tickLabels",
                  mutation: (props) => {
                    handleMouseOut(props);
                    return {style: {fill: "black"}}
                  }
                }]
              }
            }
          }
        ]}
        offsetX={78}
      />
      <VictoryAxis style={{ axis: {strokeWidth: 2}, tickLabels: { fill: "none"}}} offsetY={20}/>
      <VictoryLine style={{data: {stroke: "gray"}}}
        data={tsData} x="seq" y="trainSrc" interpolation="step"
      />
      <VictoryScatter style={{data: {fill: ({active}) => active ? "tomato": "gray"}}}
        data={tsData} x="seq" y="trainSrc" size={3}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [{
                  target: "data",
                  mutation: (props) => {
                    handleHoverPoint(props);
                    return {style: {fill: "tomato"}}
                  }
                }]
              },
              onMouseOut: () => {
                return [{
                  target: "data",
                  mutation: () => {
                    handleHoverPoint(null);
                    return null;
                  }
                }]
              }
            }
          }
        ]}
      />
    </VictoryChart>
  </div>
}

export default NavLine;
