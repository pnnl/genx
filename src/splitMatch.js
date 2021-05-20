import React from 'react';
import {min} from 'd3-array'

class SplitMatch extends React.Component {
  constructor(props) {
    super(props);
    this.getMinDistIdx = this.getMinDistIdx.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
  }

  getMinDistIdx = (distanceVal) => {
    const minIdx = distanceVal.indexOf(min(distanceVal));
    return(minIdx);
  }

  checkMatch = (word1, text2) => {
    const text2Arr = text2.split(" ");
    var setCol = "black";
    if(text2Arr.includes(word1)){
      setCol = "red";
    }
    return setCol;
  }

  render() {
    return (
      this.props.baseStr.split(" ").map((word, i) => (
         <span key={word+String(i)} style={{ lineHeight: 2, color: this.checkMatch(word, this.props.sentVal) }}>
         {`${word} `}
         </span>
      ))
    )
}
}

export default SplitMatch;
