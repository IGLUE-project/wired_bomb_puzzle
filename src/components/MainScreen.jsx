import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/main.scss';
import Bomb from "./Bomb"; 

const MainScreen = (props) => {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    handleResize();
  }, [props.appWidth, props.appHeight]);

  function handleResize(){
    if((props.appHeight === 0)||(props.appWidth === 0)){
      return;
    }

    let aspectRatio = 16 / 9;
    let _appContentWidth = Math.min(props.appHeight * aspectRatio, props.appWidth);
    let _appContentHeight = _appContentWidth / aspectRatio;

    let _containerWidth = _appContentWidth * 1;
    let _containerHeight = _appContentHeight * 1;

    setContainerWidth(_containerWidth);
    setContainerHeight(_containerHeight);
  }

  let backgroundStyle = {};
  if (appSettings.background && appSettings.background !== "NONE") {
    backgroundStyle = {
      backgroundImage: `url("${appSettings.background}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  return (
    <div id="screen_main" className="screen_content" style={backgroundStyle}>
      <div id="bomb" style={{ width: containerWidth, height: containerHeight }}>
        <Bomb deactivatedBomb={props.deactivatedBomb} time={props.time} />
      </div>
    </div>
  );
}

export default MainScreen;