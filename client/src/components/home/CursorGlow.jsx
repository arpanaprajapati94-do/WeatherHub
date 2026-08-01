import { useEffect, useState } from 'react';

/**
 * Subtle cursor glow that follows the mouse (desktop only).
 */
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handle = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div
      className="cursor-glow hidden lg:block"
      style={{ left: pos.x, top: pos.y }}
      aria-hidden="true"
    />
  );
};

export default CursorGlow;

