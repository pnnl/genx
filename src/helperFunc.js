import DynamicTimeWarping from 'dynamic-time-warping';
import { rollup, min, max } from 'd3-array';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';

export const usePrevious = value => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const getUniqueTrain = (emailId, testData, trainIdIdx, fullTestUuid) => {
  // CR: a couple of things here:
  //   * seq is redundant because it is just the array index (question)

  const idxArr = getIdx(emailId, fullTestUuid);
  const src = idxArr.map(x => testData[x][trainIdIdx]);

  const yValueMap = new Map();
  const yValue = src.map((d,i) => 
    d.map(t => {
        if(!yValueMap.has(t)){
          yValueMap.set(t, yValueMap.size)
        }
        return yValueMap.get(t)      
    })

  );

  const updated = yValue.map((d,i) => {
    if(d.length > 1){
      return d.splice(1)
    }
    else{
      return d
    }
  })
 
  const yLabels = Array.from(yValueMap.keys())
  const dat = [];

  
  yValue.map((d, i) =>
    dat.push({seq: i, trainSrc : yLabels[d]})
  );


  return dat;
}

export const getTestFromIdx = (testData, testStrIdx, idx) => {
  const allTestStr = testData.map(x => x[testStrIdx]);
  return allTestStr[idx]
}

// gets maximum value from all distance data
export const getMax = (indArr, testData, distIdx) => {
  return max(indArr.map(x => max(testData[x][distIdx])));
}

export const getMaxLow = (dataIndices, testData, distIdx) => {
  const mins = dataIndices.map(x => testData[x][distIdx][0]);
  return max(mins);
}

export const getSortedY = (indArr, testData, textIdx, distIdx) => {
  const temp = indArr.map(x => testData[x][textIdx]);
  const combText = temp.flat();
  const dist = combText.map((x, i) => {
    return [x, getMinDist(x, testData, textIdx, distIdx)]
  });
  const increasing = dist.sort(function(a,b){return a[1]-b[1]});
  return increasing;
}

export const getMinDist = (str, testData, textIdx, distIdx) => {
  const testStr = testData.map(x => x[textIdx]);
  const i = testStr.indexOf(str);
  const distList = testData[i][distIdx];
  return distList[0]
}

export const getIdx = (uuid, idxData) => {
  const findAll = idxData.reduce(function(a, e, i){
    if(e === uuid){
      a.push(i);
    }
    return a;
  }, []);
  return findAll;
}

// gets train data using train source from test data
export const getTrain = (ts, trainData, uuidIdx, textIdx) => {
  const eids = trainData.map(x => x[uuidIdx]);
  const tsToEid = eids.reduce(function(a, val, i, trids){
    if (val === ts){
      a.push(i);
    }
    return a;
  }, []);

  const trainStr = tsToEid.map(x => {
    return(trainData[x][textIdx]);
  })
  return trainStr.join(" ");
}

// dynamic time warping color function
// returns nested array [[word, color], [word, color], ...]
export const getColor = (str1, str2, myFunc) => {
  const dtw = new DynamicTimeWarping(str1, str2, myFunc);
  const d = dtw.getDistance();
  const path = dtw.getPath();

  const highlight = rollup(
    path,
    values => min(
      values,
      ([i, j]) => myFunc(str1[i], str2[j])
    ),
    d => d[0]
  );

  const should_highlight = Array.from(highlight.values());

  const temp = should_highlight.map((d,i) => {
    return [str1[i], str2[i], d];
  });
  const colorArr = should_highlight.map((d,i) => {
    return [str1[i], d];
  });

  return colorArr;
}

// get train string of neighbor data using train index
export const lookupTrain = (key, train, textIdx) => {
  const i = train.index.indexOf(key);
  return train.data[i][textIdx];
}

// check whether to return scaled/unscaled maximum
export const checkScale = (scale, values, maximum) => {
  const yMax = scale == "same" ? maximum : max(values);
  return yMax;
}

// get distance using test string
export const getDist = (str, testData, textIdx, distIdx) => {
  const testStr = testData.map(x => x[textIdx]);
  const i = testStr.indexOf(str);
  const distList = testData[i][distIdx];
  return distList;
}

// get neighbor IDs from test string
export const getNeighbor = (str, testData, textIdx, nbIdx) => {
  const testStr = testData.map(x => x[textIdx]);
  const i = testStr.indexOf(str);
  const nList = testData[i][nbIdx];
  return nList;
}

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
  arrow: {
    color: 'lightgray'
  }
}))(Tooltip);
