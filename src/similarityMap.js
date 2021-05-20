import React from 'react';
import Grid from '@material-ui/core/Grid';
import { VictoryLegend, VictorySelectionContainer, VictoryLine, VictoryAxis, VictoryChart, VictoryArea, LineSegment, VictoryScatter, VictoryTheme} from 'victory';
import TestDTW from './testDTW.js';
import EmailPreview from './emailPreview.js';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import Button from '@material-ui/core/Button';

import SearchIcon from '@material-ui/icons/Search';
import AppBar from '@material-ui/core/AppBar';

import {getIdx, getTestFromIdx} from './helperFunc.js';
import {Divider, IconButton, InputBase} from "@material-ui/core";
import SearchBar from "./searchBar";

export function SimilarityMap({ train, test, stats={}, uuid = 'email_uuid'}){
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div {...other}>
        {value === index && <Box p={1}>{children}</Box>}
      </div>
    );
  }
  const useStyles = makeStyles((theme) => ({

    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  }));
  const classes = useStyles();
  const {data, columns, index=[]} = stats;
  const diversity = columns.indexOf('diversity');
  const closeness = columns.indexOf('closeness');
  const [points, setPoints] = React.useState(index); // change to variable
  const [filteredPoints, setFilteredPoints] = React.useState([]);
  const [keywords, setKeywords] = React.useState([]);
  const allUuid = test.data.map(x => x[1]);

  const dataset = data.map((x,i) => {
    return {
      uuid: index[i],
      diversity: x[diversity],
      closeness: x[closeness]
    }
  })

  const handleSelection = (x) => {
    // setPoints(x[0].data.map(x => x.uuid));
    setFilteredPoints(x[0].data.map(x => x.uuid));


  }

  const [visitedPg, setVisited] = React.useState([]);
  const [currPg, setCurrPg] = React.useState(index[0]);
  const getPage = value => {
    setCurrPg(value);
    if(!visitedPg.includes(value)){
      setVisited([...visitedPg, value]);
    }

  }

  const [clickedEmail, setClickedEmail] = React.useState(null);
  const getClickedPreview = value => {
    setClickedEmail(points.indexOf(value));
  }

  const [selectedFavs, setFav] = React.useState([]);
  const getFavUuids = values => {
    setFav(values);
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const diversityArr = Object.values(dataset).map((x, i) => x.diversity);
  const diversityRange = [Math.min(...diversityArr), Math.max(...diversityArr)];
  const closenessArr = Object.values(dataset).map(x => x.closeness);
  const closenessRange = [Math.min(...closenessArr), Math.max(...closenessArr)];
  const i = index.indexOf(currPg);

  const handleFill = (datum) => {
    if(filteredPoints.includes(datum.uuid)){
      return "#42a5f5"
    }
    else if(selectedFavs.includes(datum.uuid)){
      return "tomato"
    }
    else {
      return "black"
    }
  }

  const handleStroke = (datum) => {
    if(selectedFavs.includes(datum.uuid) && filteredPoints.includes(datum.uuid)){
      return "tomato"
    }
    else{
      return null
    }
  }

  const removeFilter = (value) => {
    if(value){
      setFilteredPoints([]);
      setKeywords([]);
    }
  }

  const handleKeywordSearch = (keywordArr, type) => {
    setKeywords(keywordArr);
    const filteredUuid = [];
    const pointsToUse = filteredPoints.length === 0 ? points : filteredPoints;
    if(type === 'keyword'){
      pointsToUse.map((uuid, i) => {
        const indices = getIdx(uuid, allUuid);
        const emailArr = indices.map(ind => getTestFromIdx(test.data, 0, ind).split(" ")).flat();
        const findKeyword = keywordArr.map(word => emailArr.indexOf(word));
        if(findKeyword[keywordArr.length -1] - findKeyword[0] === keywordArr.length -1 && !findKeyword.includes(-1)){
          filteredUuid.push(uuid);
        }
      })
    }
    else{
      pointsToUse.map(uuid => {
        if(uuid === keywordArr){
          filteredUuid.push(uuid);
        }
      })
    }

    setFilteredPoints(filteredUuid);
    // setPoints(filteredUuid);
  }


  return(
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Paper>
                <div style={{display: 'flex', justifyContent: "flex-end", paddingTop: "1px"}}>
                  <SearchBar onRemoveFilter={removeFilter} onSearch={handleKeywordSearch} />


                </div>
                <div style={{height:"250px", width:"100%", paddingTop: "5px"}}>
                  <VictoryChart
                    height={250}
                    theme={VictoryTheme.material}
                    padding={{left:55, bottom: 50, right:10, top: 30}}
                    containerComponent={
                      <VictorySelectionContainer
                        onSelection={(points, bounds, props) => handleSelection(points, bounds, props)}
                      />
                    }
                  >
                  <VictoryLegend x={70} y={0}
                    orientation="horizontal"
                    style={{labels: {fontSize: 11}}}
                    gutter={20}
                    data={[
                      { name: "Favorite", symbol: {fill: "tomato", size: 3 }},
                      { name: "Filtered", symbol: {fill: "#42a5f5", size: 3}},
                      { name: "Currently viewing", symbol: {fill: "gray", size: 5}}
                    ]}
                  />
                  <VictoryAxis dependentAxis label="Distinctiveness" style={{grid: { stroke: "none" }, axisLabel: {padding: 50}}}/>
                  <VictoryAxis label="Diversity" style={{grid: { stroke: "none" }, axisLabel: {padding: 30}}}/>

                  <VictoryScatter
                    style={{ data: {
                      stroke: ({datum, active}) => handleStroke(datum, active),
                      strokeWidth: 1,
                      fill: ({datum, active}) => handleFill(datum, active),
                      fillOpacity: ({datum, active}) => selectedFavs.includes(datum.uuid) || filteredPoints.includes(datum.uuid) ? 1 :  0.4
                    }}}
                    size= {({datum, active}) => datum.uuid === currPg ? 5 : 3}
                   data={dataset} x="diversity" y="closeness"
                   domain={{
                     x: diversityRange,
                     y: closenessRange
                   }}
                   />

                   <VictoryLine
                   style={{ data: {
                     stroke: "lightgray",
                     strokeWidth: 1
                   }}}
                    data={[
                      {x : diversityArr[i], y: closenessRange[0]},
                      {x : diversityArr[i], y: closenessRange[1]}
                    ]}
                    domain={{
                      x: diversityRange,
                      y: closenessRange
                    }}
                    />

                    <VictoryLine
                     style={{ data: {
                       stroke: "lightgray",
                       strokeWidth: 1
                     }}}
                     data={[
                       {x : diversityRange[0], y: closenessArr[i]},
                       {x : diversityRange[1], y: closenessArr[i]}
                     ]}
                     domain={{
                       x: diversityRange,
                       y: closenessRange
                     }}

                    />
                  </VictoryChart>
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                  <AppBar style={{ backgroundColor:"white", color:"black" }} position="static">
                    <Tabs value={value} onChange={handleChange} variant="fullWidth">
                      <Tab label={filteredPoints.length !== 0 ? "Filtered emails" : "All emails"} />
                      <Tab label="Favorites" />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <div className="previewContainer" >
                      {(filteredPoints.length === 0 ? points : filteredPoints).map((x, i) =>
                        <div key={i}>
                          <EmailPreview
                            uuid={x}
                            allTestUuid={allUuid}
                            testData={test.data}
                            testStrIdx={0}
                            sendUuid={getClickedPreview}
                            fav={selectedFavs.includes(x)}
                            visited={visitedPg.includes(x)}
                            highlight={filteredPoints.includes(x)}
                            keywords={keywords}
                          />
                        </div>
                      )}
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <div className="previewContainer">
                      {selectedFavs.map((x, i) =>
                        <div key={i}>
                        <EmailPreview
                          uuid={x}
                          allTestUuid={allUuid}
                          testData={test.data}
                          testStrIdx={0}
                          sendUuid={getClickedPreview}
                          fav={selectedFavs.includes(x)}
                          visited={visitedPg.includes(x)}
                        />
                        </div>
                      )}
                    </div>
                  </TabPanel>
              </Paper>
            </Grid>

          </Grid>
          </Grid>
          <Grid item xs={7}>
            <Paper>
              <TestDTW {...{train, test}} emailUuid={uuid} pts={filteredPoints.length === 0 ? points : filteredPoints} sendCurrpg={getPage} sendClickedEmail={clickedEmail} sendFavUuids={getFavUuids}/>
            </Paper>
          </Grid>
          </Grid>



    </div>
  )
}
