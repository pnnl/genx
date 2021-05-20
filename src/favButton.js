import React, { useState, useEffect } from 'react';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import { usePrevious } from './helperFunc.js';

const FavButton = ({uuid, sendFavorites }) => {

  const [favButton, setFav] = useState(false);
  const [buttons, setButtons] = useState({})

  const handleFav = () => {
    if(uuid in buttons){
      setButtons({...buttons, [uuid]:!buttons[uuid]});
    }
    else{
      setButtons({...buttons, [uuid]:true});
    }
    setFav(!favButton);
  }

  const prevFavs = usePrevious(buttons);

  useEffect(() => {
    if(prevFavs !== buttons){
      sendFavorites(buttons);
    }
  })


  return(
    <Button onClick={handleFav}>
      {buttons[uuid] ? <Favorite style={{fill:"red"}}/> : <FavoriteBorder />}
    </Button>
  )
}

export default FavButton
