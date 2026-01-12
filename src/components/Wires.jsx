import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import Wire from "./Wire.jsx";
import './../assets/scss/Wires.css';

function Wires({ resuelto, deactivatedBomb, fallado, reinicio, setSolution, descubierto, setDescubierto}) {
  const { appSettings, Utils } = useContext(GlobalContext);
  const activeColorsCount = appSettings.numberOfWires;
  const activeColorsInitial = appSettings.colors.slice(0, activeColorsCount);
  const [orden, setOrden] = useState(1);
  const [animado, setAnimado] = useState(false);
  const [cables, setCables] = useState(
    activeColorsInitial.map((color, index) => ({
      id: index + 1,
      color,
      cortado: false,
    }))
  );
  const [cablesCortados, setCablesCortados] = useState([]);

  useEffect(() => {
    if (cablesCortados.length > 0) {
      Utils.log("Secuencia actual (nº de cable):", cablesCortados);
      if (cablesCortados.length >= appSettings.solutionLength) {
        const solution = cablesCortados.join(";");
        setSolution(solution);
      }
    }
  }, [cablesCortados]);

  useEffect(() => {
    if(reinicio === true){
      Utils.log("🔁 Reiniciando módulo de cables...");
      setOrden(1);
      setCablesCortados([]);
      setCables((prev) => prev.map((c) => ({ ...c, cortado: false })));
      setSolution(undefined);
    }
  }, [reinicio]);

  const cortarCable = (id) => {
    if (fallado) return;
    let audio = document.getElementById("audio_wire_cut");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
    setCables((prevCables) =>
      prevCables.map((cable) => {
        if (cable.id === id && !cable.cortado) {
          const nextOrden = orden + 1;
          setOrden(nextOrden);
          setCablesCortados((prev) =>
            prev.includes(id) ? prev : [...prev, id]
          );
          return { ...cable, cortado: true };
        }
        return cable;
      })
    );
  };

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function descubrirTapa() {
    if (descubierto || deactivatedBomb) return;
    setAnimado(true);
    await wait(1200);
    setAnimado(false);
    setDescubierto(true);
  }

  return (
    <div className={"modulo-centro"}>
      <div className={descubierto ? "cables-container" : "cables-container-tapa"}>
        {cables.map((cable) => (
          <Wire key={cable.id} color={cable.color} cortado={cable.cortado} onCortar={() => cortarCable(cable.id)}/>))}
      </div>
      {!descubierto && (<div className={`tapa-superpuesta ${animado ? "tapa-fall" : ""}`} onClick={descubrirTapa} tabIndex="0"/>)}
    </div>
  );

}

export default Wires;