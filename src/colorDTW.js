import React from 'react';

import {range} from 'd3-array'
import { getColor } from './helperFunc.js';

const stringComp = (a, b) => {
  return +(a !== b);
}

const getClassName = d => {
  if(d == 0){
    return "strCompMatch"
  }
  else{
    return "strCompDiff"
  }
}

const ColorDTW = ({str1, str2}) =>
  <span>
    { getColor(str1, str2, stringComp)
        .map(([s, d], i) =>
          <span key={i} className={getClassName(d)}>
            {s + ' '}
          </span>
        )
    }
  </span>
export default ColorDTW;
