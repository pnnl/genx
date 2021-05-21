import React from 'react';

import DynamicTimeWarping from 'dynamic-time-warping'

import {groups, rollup, min} from 'd3-array'

export default {
  title: 'Dynamic Time Warping',
};

const TestDTW = ({ser1, ser2, distFunc}) => {
  const  dtw = new DynamicTimeWarping(ser1, ser2, distFunc)
  const d = dtw.getDistance();
  const path = dtw.getPath();
  const highlight = rollup(
    path,
    values => {
      // console.log(values, "values");
      return(min(
      values,
      ([i, j]) => distFunc(ser1[i], ser2[j])
    ))},
    d => d[0]
  )

  const should_highlight = [...highlight.values()];

  // console.log(
  //   should_highlight,
  //
  //   should_highlight.map((d, i) => ([ser1[i], d]))
  // );

  return <div>
    <div>{ ser1.join(', ') }</div>
    <div>{ ser2.join(', ') }</div>
    <div>{ d }</div>
    <pre>
      { JSON.stringify(path, null, 2) }
    </pre>
  </div>
}

export const TestWithNumbers = () =>
  <TestDTW
    ser1={[ 9, 93, 15, 19, 24 ]}
    ser2={[ 31, 97, 81, 82, 39 ]}
    distFunc={(a, b) => Math.abs(a - b)}
  />



export const TestWithStrings = () =>
  <TestDTW
    ser1={'The quick brown fox jumped over the lazy dog.'.split('')}
    ser2={'The fox jumped over the dog.'.split('')}
    distFunc={(a, b) => +(a !== b)}
  />
