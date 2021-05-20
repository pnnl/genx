import React from 'react';
import { getColor } from './helperFunc.js';
import Levenshtein from 'js-levenshtein';

const stringComp = (a, b) => {
  return +(a !== b);
}

const getClassName = (d, distFunc) => {
  if(d === 0){
    // if(distFunc == "levenshtein"){
      return "levMatch1";
    // }
    // return "strCompMatch"
  }
  else if(d < 5){
    // if(distFunc == "levenshtein"){
      return "levPartMatch1";
    // }
    // return "strCompDiff"
  }
  else {
    // if(distFunc == "levenshtein"){
      return "levNoMatch1";
    // }
    // return "strCompDiff"
  }
}

const ColorDTWLev = ({str1, str2, distFunc}) =>
  <span>
    { getColor(str1, str2, Levenshtein)
        .map(([s, d], i) =>
          <span key={i} className={getClassName(d, distFunc)}>
            {s + ' '}
          </span>
        )
    }
  </span>

export default ColorDTWLev;
