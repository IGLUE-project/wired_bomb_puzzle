import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/main.scss';
import Bomb from "./Bomb"; 

const MainScreen = (props) => {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [boxMode, setBoxMode] = useState(false);

  useEffect(() => {
    handleResize();
  }, [props.appWidth, props.appHeight]);

  function handleResize(){
    if((props.appHeight === 0)||(props.appWidth === 0)){
      return;
    }

    let contentAspectRatio;
    let appAspectRatio = props.appWidth / props.appHeight;
    if(appAspectRatio < (16 / 9*0.99)){
      //Enable box mode
      contentAspectRatio = 4 / 3;
      setBoxMode(true);
    } else {
      contentAspectRatio = 16 / 9;
      setBoxMode(false);
    }

    let _containerWidth = Math.min(props.appHeight * contentAspectRatio, props.appWidth);
    let _containerHeight = _containerWidth / contentAspectRatio;
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
      <div id="bomb" className={boxMode ? "boxModeEnabled" : "boxModeDisabled"} style={{ width: containerWidth, height: containerHeight }}>
        <Bomb deactivatedBomb={props.deactivatedBomb} time={props.time} />
      </div>
    </div>
  );
}

export default MainScreen;