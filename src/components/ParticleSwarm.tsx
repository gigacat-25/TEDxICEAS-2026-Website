"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleSwarm() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef(new THREE.Vector2(-999, -999));

  useEffect(() => {
    if (!mountRef.current) return;

    // --- DEVICE DETECTION & CONFIG ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Reduce count on mobile for better performance
    const COUNT = isMobile ? 15625 : 29791; // 25^3 vs 31^3
    const numMajorShapes = 5;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- GEOMETRY & ATTRIBUTES ---
    const geometry = new THREE.BufferGeometry();
    
    // We will store the shapes as attributes and morph them in the shader
    const basePositions = new Float32Array(COUNT * 3);
    const scatterPositions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT);

    const s = Math.ceil(Math.pow(COUNT, 1/3));
    const sep = 5.0;
    const off = (s * sep) / 2;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const z = Math.floor(i / (s * s));
      const y = Math.floor((i % (s * s)) / s);
      const x = i % s;
      
      // Grid
      basePositions[i3] = x * sep - off;
      basePositions[i3 + 1] = y * sep - off;
      basePositions[i3 + 2] = z * sep - off;

      // Scatter (Pre-calculate a single scatter target to keep it GPU-side)
      const range = 250;
      scatterPositions[i3] = basePositions[i3] + (Math.random() - 0.5) * range;
      scatterPositions[i3 + 1] = basePositions[i3 + 1] + (Math.random() - 0.5) * range;
      scatterPositions[i3 + 2] = basePositions[i3 + 2] + (Math.random() - 0.5) * range;

      randoms[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(basePositions, 3));
    geometry.setAttribute("aTarget", new THREE.BufferAttribute(scatterPositions, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    // --- SHADER MATERIAL ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(-999, -999) },
        uPointSize: { value: 1.5 * (typeof window !== "undefined" ? window.devicePixelRatio : 1) },
        uColor: { value: new THREE.Color("#E62B1E") }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform float uPointSize;
        uniform vec2 uMouse;
        attribute vec3 aTarget;
        attribute float aRandom;
        varying vec3 vColor;
        uniform vec3 uColor;

        void main() {
          vColor = uColor;
          
          // Morph between Grid and Scatter
          vec3 pos = mix(position, aTarget, uProgress);

          // Organic Waving
          float wave = sin(uTime * 0.5 + aRandom * 10.0) * 4.0;
          pos.x += cos(uTime * 0.3 + pos.y * 0.04) * wave;
          pos.y += sin(uTime * 0.4 + pos.x * 0.04) * wave;

          // Mouse Interaction (GPU side)
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          float dist = distance(worldPos.xy, uMouse);
          if (dist < 60.0) {
            vec2 dir = normalize(worldPos.xy - uMouse);
            float force = (1.0 - dist / 60.0) * 35.0;
            pos.xy += dir * force;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uPointSize * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;
          float alpha = 1.0 - smoothstep(0.5, 1.0, r);
          gl_FragColor = vec4(vColor, alpha * 0.85);
        }
      `,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let scrollProgress = 0;
    let currentScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse in world coordinates on a plane at Z=0
      // For simplicity in the GPU shader, we'll pass roughly projected mouse coords
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Approximate world scale (since camera Z=220 and FOV=60)
      const aspect = window.innerWidth / window.innerHeight;
      const h = 2 * Math.tan((60 * Math.PI) / 360) * 220;
      const w = h * aspect;
      material.uniforms.uMouse.value.set(x * w * 0.5, y * h * 0.5);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = mountRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        const aspect = window.innerWidth / window.innerHeight;
        const h = 2 * Math.tan((60 * Math.PI) / 360) * 220;
        const w = h * aspect;
        material.uniforms.uMouse.value.set(x * w * 0.5, y * h * 0.5);
      }
    };

    const updateScroll = () => {
      currentScrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = currentScrollY / maxScroll;
      material.uniforms.uProgress.value = Math.max(0, Math.min(progress * 1.5, 1.0));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    function animate() {
      requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      material.uniforms.uTime.value = time;

      // Parallax
      const scrollShift = -currentScrollY * 0.015;
      points.position.y = THREE.MathUtils.lerp(points.position.y, scrollShift, 0.05);

      // Rotation
      points.rotation.y += isMobile ? 0.0004 : 0.0008;
      points.rotation.x = Math.sin(time * 0.2) * 0.05;

      renderer.render(scene, camera);
    }
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPointSize.value = 1.5 * window.devicePixelRatio;
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
