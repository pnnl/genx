import React, { useEffect} from 'react';
import ColorDTW from './colorDTW.js';
import ColorDTWLev from './colorDTWLev.js';
import DivBar from './divBar.js';
import './css/genXstyle.css';
import {getTestFromIdx, getDist, getNeighbor, lookupTrain, getMax} from './helperFunc.js'

const EmailDTW = ({ train, testData, scale, selected, selectedFromLabel, hoveredDataPt, textIdx, nbIdx, distIdx, testStrIdx, indices, indexData}) => {
  const content = [];
  const testStrOnPg = indices.map(x => getTestFromIdx(testData, testStrIdx, x));

  return(
    indices.map((x, i) =>
      <React.Fragment key={x} >
        <div id={i}
          className={selectedFromLabel.includes(indexData[x]) ? "colorHoveredText":selected.includes(indexData[x]) || hoveredDataPt == indexData[x] ? "colorSelectedText":"origText"}
        >
          <ColorDTWLev
            str1={testStrOnPg[i].split(" ")}
            str2={lookupTrain(getNeighbor(testStrOnPg[i], testData, textIdx, nbIdx)[0], train, textIdx).split(" ")}
          />
        </div>

        <DivBar
          train={train}
          yData={getDist(testStrOnPg[i], testData, textIdx, distIdx)}
          neighborData={getNeighbor(testStrOnPg[i], testData, textIdx, nbIdx)}
          textData={testStrOnPg[i]}
          scale = {scale}
          maxY={getMax(indices, testData, distIdx)}
          textIdx={textIdx}
        />

      </React.Fragment>
    )
  )

}

export default EmailDTW;
