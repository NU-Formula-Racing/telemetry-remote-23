import { useState, useEffect } from "react";

export default function useMouse() {
  const [pos, setPos] = useState({
    mouseX: 0,
    mouseY: 0
  });

  const update = (e) => {
    setPos({ mouseX: e.clientX, mouseY: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', update);

    return () => window.removeEventListener('mousemouse', update);
  }, []);

  return pos;
}