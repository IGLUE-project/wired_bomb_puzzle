import { useState, useEffect } from "react";

function Wire({ color, cortado, onCortar }) {
  const [girado, setGirado] = useState(false);

  // useEffect(() => {
  //   const aleatorio = Math.random() < 0.5;
  //   setGirado(aleatorio);
  // }, []);

  return (
    <div className={cortado ? `cable-cor-${color}` : `cable-${color}`} onClick={!cortado ? onCortar : null} style={{  transform: girado ? "rotate(180deg)" : "rotate(0deg)", }}
    ></div>
  );
}

export default Wire;
