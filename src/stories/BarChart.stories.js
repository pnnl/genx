import React from 'react';

import {max} from 'd3-array'

import ButtonBase from '@material-ui/core/ButtonBase'
import Tooltip from '@material-ui/core/Tooltip';


export default {
  title: 'Simple pure HTML bar chart',
  component: BarChart
};


const BarChart = ({values, yMax, height=50}) => {

  yMax = yMax || max(values);

  return <div>
    { values.map((y, i) =>
        <Tooltip title={y}>
          <div
            style={{height: height*y/yMax, border: '1px solid black', width: 10, display: 'inline-block'}}
          />
        </Tooltip>
      )
    }
  </div>
}

export const TestBarChart = () =>
  <BarChart
    values={[1, 2, 3, 2, 5, 1]}
  />
