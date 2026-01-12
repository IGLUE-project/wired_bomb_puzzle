import React from 'react';
import {useState, useEffect, useRef, useContext } from 'react';
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/app.scss';

import { DEFAULT_APP_SETTINGS, ESCAPP_CLIENT_SETTINGS, MAIN_SCREEN } from '../constants/constants.jsx';
import MainScreen from './MainScreen.jsx';

export default function App() {
  const { escapp, setEscapp, appSettings, setAppSettings, Storage, setStorage, Utils, I18n } = useContext(GlobalContext);
  const hasExecutedEscappValidation = useRef(false);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(MAIN_SCREEN);
  const [time,setTime]= useState();
  const [deactivatedBomb,setDeactivatedBomb]= useState(false);
  const prevScreen = useRef(screen);
  const [appWidth, setAppWidth] = useState(0);
  const [appHeight, setAppHeight] = useState(0);
  
  useEffect(() => {
    //Init Escapp client
    if(escapp !== null){
      return;
    }
    //Create the Escapp client instance.
    let _escapp = new ESCAPP(ESCAPP_CLIENT_SETTINGS);
    setEscapp(_escapp);
    Utils.log("Escapp client initiated with settings:", _escapp.getSettings());

    //Use the storage feature provided by Escapp client.
    setStorage(_escapp.getStorage());

    //Get app settings provided by the Escapp server.
    let _appSettings = processAppSettings(_escapp.getAppSettings());
    setAppSettings(_appSettings);
    Utils.log("App settings:", _appSettings);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);


  function processAppSettings(_appSettings){
    if(typeof _appSettings !== "object"){
      _appSettings = {};
    }
    if((typeof _appSettings.skin === "undefined")&&(typeof DEFAULT_APP_SETTINGS.skin === "string")){
      _appSettings.skin = DEFAULT_APP_SETTINGS.skin;
    }

    let skinSettings;
    switch(_appSettings.skin){
      default:
        skinSettings = {};
    }
    let DEFAULT_APP_SETTINGS_SKIN = Utils.deepMerge(DEFAULT_APP_SETTINGS, skinSettings);
 
     // Merge _appSettings with DEFAULT_APP_SETTINGS_SKIN to obtain final app settings
    _appSettings = Utils.deepMerge(DEFAULT_APP_SETTINGS_SKIN, _appSettings);
    
    const allowedActions = ["NONE"];
    if(!allowedActions.includes(_appSettings.actionAfterSolve)) {
      _appSettings.actionAfterSolve = DEFAULT_APP_SETTINGS.actionAfterSolve;
    }

    _appSettings.numberOfWires = Math.max(1,Math.min(_appSettings.numberOfWires, _appSettings.colors.length));

    if((typeof _appSettings.solutionLength !== "number")||(_appSettings.solutionLength < 1)){
      _appSettings.solutionLength = _appSettings.numberOfWires;
    }
    _appSettings.solutionLength = Math.min(_appSettings.solutionLength,_appSettings.numberOfWires);

    _appSettings.timer_enabled = ((_appSettings.timer === "TRUE")||((_appSettings.timer === true)));

    _appSettings.loadDeactivatedBombBoolean = ((_appSettings.loadDeactivatedBomb === "TRUE")||((_appSettings.loadDeactivatedBomb === true)));

    //Init internacionalization module
    I18n.init(_appSettings);

    //Change HTTP protocol to HTTPs in URLs if necessary
    _appSettings = Utils.checkUrlProtocols(_appSettings);

    //Preload resources (if necessary)
    for(var i=0; i<10; i++){
      Utils.preloadImages(["./images/numbers/" + i + ".png"]);
    }
    //Utils.preloadAudios([appSettings.soundNok,_appSettings.soundOk]); //Preload done through HTML audio tags

    return _appSettings;
  }

  useEffect(() => {
    if (!hasExecutedEscappValidation.current && escapp !== null && appSettings !== null && Storage !== null) {
      hasExecutedEscappValidation.current = true;

      // //Register callbacks in Escapp client and validate user.
      // escapp.registerCallback("onNewErStateCallback", function(erState){
      //   try {
      //     Utils.log("New escape room state received from ESCAPP", erState);
      //     restoreAppState(erState);
      //   } catch (e){
      //     Utils.log("Error in onNewErStateCallback", e);
      //   }
      // });

      // escapp.registerCallback("onErRestartCallback", function(erState){
      //   try {
      //     Utils.log("Escape Room has been restarted.", erState);
      //     if(typeof Storage !== "undefined"){
      //       Storage.removeSetting("state");
      //     }
      //   } catch (e){
      //     Utils.log("Error in onErRestartCallback", e);
      //   }
      // });

      //Validate user. To be valid, a user must be authenticated and a participant of the escape room.
      escapp.validate((success, erState) => {
        try {
          Utils.log("ESCAPP validation", success, erState);
          if(success){
            let puzzleSolved = (escapp.getAllPuzzlesSolved() && (escapp.getSolvedPuzzles().length > 0));
            let deactivatedBomb = (puzzleSolved && appSettings.loadDeactivatedBombBoolean);
            if((appSettings.timer_enabled)&&(deactivatedBomb === false)){
              // 1. Calculate endTime
              const endTime = new Date(new Date(erState.startTime).getTime() + erState.duration * 1000);
              // const endTime = new Date(new Date(erState.startTime).getTime()); //For testing time run out

              // 2. Calculate remaining time
              const now = new Date();
              const remainingMs = Math.max(endTime - now, 0); //diff in ms
              const remainingSeconds = Math.floor(remainingMs / 1000);
              const remainingMinutes = Math.floor(remainingSeconds / 60);
              Utils.log("remainingSeconds:", remainingSeconds);
              setTime(remainingSeconds);
            }

            setDeactivatedBomb(deactivatedBomb);
            setLoading(false);
          }
        } catch (e){
          Utils.log("Error in validate callback", e);
        }
      });
    }
  }, [escapp, appSettings, Storage]);

  useEffect(() => {
    if(loading === false){
      handleResize();
    }
  }, [loading]);

  useEffect(() => {
    if (screen !== prevScreen.current) {
      Utils.log("Screen ha cambiado de", prevScreen.current, "a", screen);
      prevScreen.current = screen;
      saveAppState();
    }
  }, [screen]);

  function handleResize(){
    setAppWidth(window.innerWidth);
    setAppHeight(window.innerHeight);
  }

  // function restoreAppState(erState){
  //   Utils.log("Restore application state based on escape room state:", erState);
  //   if (escapp.getAllPuzzlesSolved() && (escapp.getSolvedPuzzles().length > 0)){
  //     //¿Deactive bomb?
  //   }
  // }

  // function restoreAppStateFromLocalStorage(){
  //   if(typeof Storage !== "undefined"){
  //     let stateToRestore = Storage.getSetting("state");
  //     if(stateToRestore){
  //       Utils.log("Restore app state", stateToRestore);
  //       //setScreen(stateToRestore.screen);
  //     }
  //   }
  // }

  // function saveAppState(){
  //   if(typeof Storage !== "undefined"){
  //     let currentAppState = {screen: screen};
  //     Utils.log("Save app state in local storage", currentAppState);
  //     Storage.saveSetting("state",currentAppState);
  //   }
  // }

  const renderScreens = (screens) => {
    if (loading === true) {
      return null;
    } else {
      return (
        <>
          {screens.map(({ id, content }) => renderScreen(id, content))}
        </>
      );
    }
  };

  const renderScreen = (screenId, screenContent) => (
    <div key={screenId} className={`screen_wrapper ${screen === screenId ? 'active' : ''}`} >
      {screenContent}
    </div>
  );

  let screens = [
    {
      id: MAIN_SCREEN,
      content: <MainScreen appHeight={appHeight} appWidth={appWidth} time={time} deactivatedBomb={deactivatedBomb} />
    }
  ];

  return (
    <div id="global_wrapper" className={`${(appSettings !== null && typeof appSettings.skin === "string") ? appSettings.skin.toLowerCase() : ''}`}>
      {renderScreens(screens)}
    </div>
  )
}