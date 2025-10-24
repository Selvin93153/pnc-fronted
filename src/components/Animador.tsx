// Animador.tsx
import { useEffect, useState } from "react";

interface AnimadorProps {
  value: number;        // Valor final que queremos mostrar
  duration?: number;    // Duración de la animación en ms
  decimals?: number;    // Número de decimales a mostrar
}

export default function Animador({ value, duration = 1200, decimals = 0 }: AnimadorProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {

    const frameRate = 60; // 60 cuadros por segundo
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easedProgress = easeOutQuad(progress); // efecto suavizado
      const newValue = Math.round((value * easedProgress) * Math.pow(10, decimals)) / Math.pow(10, decimals);
      setDisplayValue(newValue);

      if (currentFrame >= totalFrames) {
        setDisplayValue(value); // asegurar el valor final
        clearInterval(counter);
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [value, duration, decimals]);

  return <>{displayValue}</>;
}

// Función de easing para animación más suave
function easeOutQuad(t: number) {
  return t * (2 - t);
}
