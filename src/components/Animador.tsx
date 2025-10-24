import { useEffect, useState } from "react";

interface AnimadorProps {
  value: number;        // Valor final
  duration?: number;    // Duración total de la animación en ms
  decimals?: number;    // Decimales (0 por defecto)
}

export default function Animador({ value, duration = 1000, decimals = 0 }: AnimadorProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const frameRate = 20; // 20 actualizaciones por segundo → lento
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easedProgress = easeOutQuad(progress);

      // Generar un número intermedio "grande" para efecto visual
      const min = Math.floor(easedProgress * value * 10); // escalado para ver cifras grandes
      const max = Math.floor(easedProgress * value * 15); 
      let newValue = Math.floor(Math.random() * (max - min + 1) + min);

      // Asegurar que no exceda el valor final
      if (currentFrame >= totalFrames) newValue = value;

      setDisplayValue(newValue);
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [value, duration, decimals]);

  return <>{displayValue}</>;
}

// Efecto de easing para animación suave
function easeOutQuad(t: number) {
  return t * (2 - t);
}
