"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

/**
 * THEME: WHAT SHAPES US
 * Reverted to single powerful organic focal structure.
 * Multi-shape nodes: Squares, Triangles, and Diamonds.
 * Dark Cinematic Red.
 */

export default function ParticleSwarm() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef(new THREE.Vector2(-999, -999));

  useEffect(() => {
    if (!mountRef.current) return;

    const COUNT = 30000;
    const numMajorShapes = 5;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2500);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Post-processing removed as requested

    // --- GEOMETRY ---
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));

    // --- SHADER MATERIAL ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPointSize: { value: 2.5 * window.devicePixelRatio }
      },
      vertexShader: `
        uniform float uPointSize;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
          vColor = customColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uPointSize * (250.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      transparent: true,
      depthTest: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- ORGANIC MORPHING SYSTEM ---
    const shapes: Float32Array[] = [];

    function generateOrganicBlob(noiseScale: number, radius: number) {
      const arr = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const phi = Math.acos(1.0 - 2.0 * ((i + 0.5) / COUNT));
        const theta = 2.399963 * i;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
        const n = Math.sin(x * noiseScale) * 0.5 + Math.cos(y * noiseScale * 1.5) * 0.5;
        const mag = radius * (0.8 + n * 0.4);
        arr[i * 3] = x * mag;
        arr[i * 3 + 1] = y * mag;
        arr[i * 3 + 2] = z * mag;
      }
      return arr;
    }

    shapes.push(generateOrganicBlob(1.5, 80));
    shapes.push(generateOrganicBlob(2.2, 110));
    shapes.push(generateOrganicBlob(1.1, 100));
    shapes.push(generateOrganicBlob(3.0, 120));
    shapes.push(generateOrganicBlob(0.8, 150));

    const currentPositions = new Float32Array(COUNT * 3);
    const targetPositions = new Float32Array(COUNT * 3);

    let scrollProgress = 0;
    const raycaster = new THREE.Raycaster();
    const mouseWorld = new THREE.Vector3();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const updateScroll = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const progress = (window.scrollY / (maxScroll || 1)) * (numMajorShapes - 1);
      scrollProgress = Math.max(0, Math.min(progress, numMajorShapes - 1));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", updateScroll);
    updateScroll();

    const clock = new THREE.Clock();

    function animate() {
      const time = clock.getElapsedTime();
      requestAnimationFrame(animate);

      material.uniforms.uTime.value = time;

      const fromIdx = Math.floor(scrollProgress);
      const toIdx = Math.min(fromIdx + 1, numMajorShapes - 1);
      const lerpFactor = scrollProgress - fromIdx;

      raycaster.setFromCamera(mouse.current, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);

      const posAttr = geometry.attributes.position;
      const colAttr = geometry.attributes.customColor;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const tx = THREE.MathUtils.lerp(shapes[fromIdx][i3], shapes[toIdx][i3], lerpFactor);
        const ty = THREE.MathUtils.lerp(shapes[fromIdx][i3 + 1], shapes[toIdx][i3 + 1], lerpFactor);
        const tz = THREE.MathUtils.lerp(shapes[fromIdx][i3 + 2], shapes[toIdx][i3 + 2], lerpFactor);

        const wave = Math.sin(time * 0.5 + i * 0.05) * 3;
        targetPositions[i3] = tx + Math.cos(time * 0.3 + ty * 0.04) * wave;
        targetPositions[i3 + 1] = ty + Math.sin(time * 0.4 + tx * 0.04) * wave;
        targetPositions[i3 + 2] = tz;

        const dx = targetPositions[i3] - mouseWorld.x;
        const dy = targetPositions[i3 + 1] - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 60) {
          const force = (1.0 - dist / 60) * 45;
          targetPositions[i3] += (dx / dist) * force;
          targetPositions[i3 + 1] += (dy / dist) * force;
        }

        currentPositions[i3] = THREE.MathUtils.lerp(currentPositions[i3], targetPositions[i3], 0.1);
        currentPositions[i3 + 1] = THREE.MathUtils.lerp(currentPositions[i3 + 1], targetPositions[i3 + 1], 0.1);
        currentPositions[i3 + 2] = THREE.MathUtils.lerp(currentPositions[i3 + 2], targetPositions[i3 + 2], 0.1);

        posAttr.setXYZ(i, currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);

        colAttr.setXYZ(i, 0.55, 0.0, 0.02);
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      renderer.render(scene, camera);
    }
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPointSize.value = 1.2 * window.devicePixelRatio;
    };
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
