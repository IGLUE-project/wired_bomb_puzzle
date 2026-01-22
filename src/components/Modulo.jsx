import { useEffect, useState , useContext } from "react";
import './../assets/scss/Modulo.css';
import { GlobalContext } from "./GlobalContext";
import Temporizador from "./Temporizador.jsx";
import Wires from "./Wires.jsx" 

function Modulo({setSolution, deactivatedBomb, resuelto, setResuelto, fallado, setFallado, reinicio, setReinicio, descubierto, setDescubierto, time}) {
  const { escapp, appSettings, Utils} = useContext(GlobalContext);
  
  useEffect(() => {
    if(reinicio === true){
      setResuelto(false);
      setFallado(false);
      setReinicio(false);
    }
  }, [reinicio]);

  return (
    <div className={descubierto ? "modulo-descubierto": "modulo" }>
      <div className={fallado ? `light lightFailure` : resuelto ? `light lightSuccess` : `light lightOff`}/>
      {appSettings.timer_enabled && (typeof time === "number") && <Temporizador inicialSegundos={time} resuelto={resuelto} setFallado={setFallado} fallado={fallado} reinicio={reinicio} descubierto={descubierto}/>}
      <Wires resuelto={resuelto} deactivatedBomb={deactivatedBomb} fallado={fallado} reinicio={reinicio} setSolution={setSolution} setDescubierto={setDescubierto} descubierto={descubierto}/>
    </div>
  );
}

export default Modulo;