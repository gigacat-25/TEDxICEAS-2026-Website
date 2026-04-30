"use client";

import { useEffect, useState } from "react";

export default function ParticleCanvasWrapper() {
  const [Canvas, setCanvas] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import Three.js-based ParticleCanvas only on client side
    import("./ParticleCanvas").then((mod) => {
      setCanvas(() => mod.default);
    });
  }, []);

  if (!Canvas) return null;
  return <Canvas />;
}
