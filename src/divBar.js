import React from 'react';
import './css/genXstyle.css';
import ColorDTW from './colorDTW.js';
import ColorDTWLev from './colorDTWLev';
import { format } from 'd3-format';
import { lookupTrain, checkScale, LightTooltip } from './helperFunc.js';

const DivBar = ({ yData, distFunc, neighborData, train, textIdx, textData, scale, maxY }) =>
  <div className={"chartWord"}>
    { yData
      .map((y, i) =>
        <LightTooltip key={y+String(i)}
          title={
            <ColorDTWLev str1={lookupTrain(neighborData[i], train, textIdx).split(" ")} str2={textData.split(" ")} distFunc="levenshtein"/>
          } arrow placement="top">
          <div className="bar" style={{ height: parseFloat(format("0.4f")(20*y/checkScale(scale, yData, maxY)))}}/>
        </LightTooltip>
      )
    }
  </div>


export default DivBar;
