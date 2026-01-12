import { useState , useContext } from "react";
import { GlobalContext } from "./GlobalContext";
import Cables from "./ModuloCables.jsx";
import './../assets/scss/Tapa.css';
import './../assets/scss/Bomba.css';


function Tapa({fallado, reinicio, setSolution , setDescubierto , descubierto}) {
  const {escapp, appSettings, Utils} = useContext(GlobalContext);
  const [animado, setAnimado] = useState(false);

  const animacionTapa = () => {
    const img = document.getElementById("image");
    if (!img) return;

    img.addEventListener("click", function () {
      this.classList.add("falling");
    });
  };
  
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  async function descubrirTapa (){
    setAnimado(true);
    await wait(1200);
    setDescubierto(true);
  }

  return (
    <Cables fallado={fallado} reinicio={reinicio} setSolution={setSolution}  descubierto={descubierto}>
      <div className={`tapa${animado ? "-fall" : ""}`} onClick={() => { descubrirTapa(); animacionTapa(); }} tabIndex="0"/>
    </Cables>
);
}

export default Tapa;