import { useEffect, useState , useContext } from "react";
import Modulo from "./Modulo.jsx";
import { GlobalContext } from "./GlobalContext";
import './../assets/scss/Bomb.css';

function Bomba({ deactivatedBomb, time }) {
  const { escapp, appSettings, Utils, I18n } = useContext(GlobalContext);
  const [reinicio, setReinicio] = useState(false);
  const [descubierto, setDescubierto] = useState(false);
  const [solution, setSolution] = useState();
  const [resuelto,setResuelto] = useState(deactivatedBomb);
  const [fallado,setFallado] = useState(false);

  useEffect(() => {
    if(typeof solution !== "string"){
      return;
    }
    if(solution.split(";").length < appSettings.solutionLength){
      return;
    }

    Utils.log("Check solution", solution);

    escapp.checkNextPuzzle(solution, {}, (success, erState) => {
      Utils.log("Check solution Escapp response", success, erState);
      try {
        setTimeout(() => {
          changeBoxLight(success, solution);
        }, 100);
      } catch(e){
        Utils.log("Error in checkNextPuzzle",e);
      }
    });
  }, [solution]);

  const changeBoxLight = (success, solution) => {
    let audio;
    if(success){
       setResuelto(true);
       audio = document.getElementById("solution_ok");
    } else {
      setFallado(true);
      audio = document.getElementById("solution_nok");
    }
    audio.play();
    if (success) {
      setTimeout(() => {
        submitPuzzleSolution(solution);
      }, 1500);
    }
  }

  function submitPuzzleSolution(solution){
    Utils.log("Submit puzzle solution", solution);
    escapp.submitNextPuzzle(solution, {}, (success, erState) => {
      Utils.log("Solution submitted to Escapp", solution, success, erState);
    });
  }

  const reiniciarBomba = () => {
    if(resuelto === true) return;
    let audio = document.getElementById("audio_reset");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    setReinicio(true);
  };

  const handleZonaClick = (e) => {
    setDescubierto(false);
  };

  return (
    <div className={descubierto ? "bomba-modulo" : "bomba-principal"}>
      <audio id="solution_ok" src={appSettings.soundOk} autostart="false" preload="auto" />
      <audio id="solution_nok" src={appSettings.soundNok} autostart="false" preload="auto" />
      <audio id="audio_reset" src={appSettings.soundReset} autostart="false" preload="auto" />
      <audio id="audio_wire_cut" src={appSettings.soundWireCut} autostart="false" preload="auto" />
      {descubierto && (
        <>
          <div className="bomba-modulo-back-izq" onClick={handleZonaClick} />
          <div className="bomba-modulo-back-der" onClick={handleZonaClick} />
        </>
      )}
      <Modulo setSolution={setSolution} deactivatedBomb={deactivatedBomb} resuelto={resuelto} setResuelto={setResuelto} fallado={fallado} setFallado={setFallado} reinicio={reinicio} setReinicio={setReinicio} descubierto={descubierto} setDescubierto={setDescubierto} time={time}/>
      <div className={descubierto ? "button-container-modulo" : "button-container-principal"}>
        <div className="button-modulo" onClick={reiniciarBomba}>
          <p>{I18n.getTrans("i.reset")}</p>
        </div>
      </div>
    </div>
  );
}

export default Bomba;
