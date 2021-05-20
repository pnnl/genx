import React, { useEffect, useRef, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import EmailDTW from './emailDTW.js';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FavButton from './favButton.js';
import NavLine from './navLine.js';
import { max, range } from 'd3-array';
import { makeStyles } from '@material-ui/core/styles';

import { getIdx, usePrevious} from './helperFunc.js';

const TestDTW = ({train, test={}, emailUuid, pts, sendCurrpg, sendClickedEmail, sendFavUuids }) => {

  const styles = makeStyles((theme) => ({
    checkboxLabel: {
      fontSize: 13,
    },
    tickSize: {
      transform: "scale(0.8)",
    }
  }));

  const classes = styles();
  const {data, columns, index=[]} = test;

  const trainText = train.columns.indexOf('text');
  // const emailId = train.columns.indexOf('email_uuid');

  const neighbor = columns.indexOf('neighbors');
  const text = columns.indexOf('text');
  const distance = columns.indexOf('distances');
  const trainId = columns.indexOf('train_sources');
  const testUuid = columns.indexOf(emailUuid);

  const allTestUuid = data.map(x => x[testUuid]);
  const distinctUuid = Array.from(new Set(allTestUuid));

  const [checked, setChecked] = React.useState(true);
  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };

  const [page, setPage] = React.useState(1);
  const handleChangePage = (event, value) => {
      setPage(value);
  };

  const current_page = pts[page - 1];

  const filtered_indices = range(pts.length)
    .filter(i => pts[i] === current_page);

  const [gotPts, setPts] = useState(pts);
  const prevPts = usePrevious(gotPts);

  const [gotClicked, setClicked] = useState(sendClickedEmail);
  const prevClicked = usePrevious(gotClicked);

  const sentIdx = filtered_indices.map(x => getIdx(pts[x], allTestUuid)).flat();

  useEffect(() => {
    setPts(pts);
    setClicked(sendClickedEmail);

    if(pts !== prevPts){
      setPage(1);
    }
    sendCurrpg(pts[filtered_indices.flat()]);

    if(sendClickedEmail !== prevClicked){
      setPage(sendClickedEmail+1);
    }

  })


  const [testStr, setTestStr] = useState([]);
  const [tsTestStr, setTsTestStr] = useState([]);
  const [ptTestStr, setPtTestStr] = useState(null);

  const getSelected = (val) => {
    if(val != null){
      const idx = val[1].map(x =>{
        const tIdx = sentIdx[x.seq];
        return index[tIdx];
      })
      setTestStr(idx);
    }
    else{
      setTestStr([]);
    }
  }

  const getAxisLabel = (val) => {
    const idxArr = [];
    if(val != null){
      sentIdx.map(x => {
        data[x][trainId].map(d => {
          if(d.split("-")[0] === val[1]){
            idxArr.push(index[x]);
          }
        })
        setTsTestStr(idxArr);
        })

    }
    else{
      setTsTestStr([]);
    }
  }

  const getPointData = (val) => {
    if(val != null){
      const tIdx = sentIdx[val[1].seq];
      setPtTestStr(index[tIdx]);
    }
    else{
      setPtTestStr(null);
    }
  }

  const getFavorites = (dict) => {
    const favValues = Object.entries(dict);
    const favUuid = [];
    const temp = favValues.map(x => {
      if(x[1] === true){
        favUuid.push(x[0])
      }
    })
    sendFavUuids(favUuid);
  }
  // console.log(filtered_indices);
  // const tmp = index.map((d,i) => getUniqueTrain(d, data, trainId, allTestUuid));
  // console.log(tmp);
  // index.map(d => console.log(d, getUniqueTrain(d, data, trainId, allTestUuid)));
  // const tmp = filtered_indices.map(i => {
  //   console.log(i, pts[i]);
  // })


  return <TableContainer style={{height:"95%"}} component={Paper}>
  <div style={{height:"100%", display:"flex", flexFlow:"column nowrap", flex:1}}>
    <div style={{display:"flex", justifyContent:"flex-end"}}>

      <FavButton uuid={pts[filtered_indices.flat()]}
        sendFavorites={getFavorites}/>
    </div>

    <div>
    {filtered_indices
      .map(i =>
        <div key={i}>
          <div className="uuid">{"UUID: "}{pts[i]}{"   "}</div>
          <NavLine style={{display: "inline-block"}}
            distinctEmailId={pts[i]}
            testData={data}
            trainIdIdx={trainId}
            fullTestUuid={allTestUuid}
            sendSelectedPts={getSelected}
            sendLabel={getAxisLabel}
            sendPointData={getPointData}
          />
        </div>
      )
    }
    </div>

    <div style={{flexGrow:1, height:"100%" }}>
    <Table>
      <TableBody>
      { filtered_indices
        .map(i =>
          <TableRow key={i}>
            <TableCell style={{borderBottom:"0px", paddingTop:"0px"}}>
              <FormControlLabel classes={{label: classes.checkboxLabel}}
              style={{ paddingLeft: "0px",}}
                control={ <Checkbox className={classes.tickSize} checked={checked} onChange={handleCheck}/> }
                label={"Consistent y scale"}
              />
               <div style={{ width: "100%",
               }}>
                <EmailDTW
                  train={train} testData={data} indexData={index}
                  scale={checked == true ? "same":"diff"}
                  selected={testStr} selectedFromLabel={tsTestStr} hoveredDataPt={ptTestStr}
                  textIdx={trainText} nbIdx={neighbor} distIdx={distance} testStrIdx={text}

                  indices={getIdx(pts[i], allTestUuid)}
                />
              </div>
            </TableCell>
          </TableRow>
        )
      }
      </TableBody>
    </Table>
    </div>

    <div style={{marginTop:"auto", padding:"5px", alignSelf:"flex-end"}}>
      <Pagination count={pts.length} page={page} shape="rounded" onChange={handleChangePage} />
    </div>

  </div>
  </TableContainer>

}

export default TestDTW
