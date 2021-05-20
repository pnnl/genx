import React from 'react';
import { getIdx, getTestFromIdx } from './helperFunc.js';


const EmailPreview = ({ uuid, allTestUuid, testData, testStrIdx, sendUuid, fav, visited, highlight, keywords }) => {
  const highlightWord = highlight && typeof keywords !== "string";
  const indices = getIdx(uuid, allTestUuid);
  // console.log(indices); all indices of strings that form the email
  const temp = indices.map(x => getTestFromIdx(testData, testStrIdx, x).split(" ")).flat();
  // console.log(temp); // array of words split of the email
  const [button, setButton] = React.useState(false);
  const [clicked, setClicked] = React.useState({});


  const handleClick = (id) => {
    setClicked({...clicked, [id]:true });
    setButton(true);
    sendUuid(id);
  }

  const previewArr = temp.slice(0, 50);
  return(
    <div className={fav ? "marked": "preview"}>
      <button className={(clicked[uuid] || visited) ? "visitedButton": "myButton"} onClick={() => handleClick(uuid)}>

        <div style={{textAlign: 'left', padding: '5px'}}>
          {/*{temp.slice(0,50).join(" ")}*/}
          {previewArr.map((word, i) =>
          <span key={i} style={{backgroundColor: highlightWord && keywords.includes(word) ? '#f5ea92' : null}}>
            {word}{"\n"}
          </span>)}
        </div>
      </button>

    </div>
  )
}

export default EmailPreview
