"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export default function ParticleSwarm() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- CONFIG ---
    const COUNT = 20000;
    const SPEED_MULT = 1;

    // --- SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0d0d, 0.005);
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 120);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- POST PROCESSING ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;
    bloomPass.threshold = 0;
    composer.addPass(bloomPass);

    // --- INSTANCED MESH ---
    const geometry = new THREE.TetrahedronGeometry(0.25);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // --- SHAPE GENERATORS ---
    const shapes: THREE.Vector3[][] = [];
    const numShapes = 5;

    // Utility random point inside triangle (barycentric coordinates)
    function randomPointInTriangle(
      v1: THREE.Vector3,
      v2: THREE.Vector3,
      v3: THREE.Vector3
    ) {
      let r1 = Math.random();
      let r2 = Math.random();
      if (r1 + r2 > 1) {
        r1 = 1 - r1;
        r2 = 1 - r2;
      }
      const a = 1 - r1 - r2;
      return new THREE.Vector3(
        a * v1.x + r1 * v2.x + r2 * v3.x,
        a * v1.y + r1 * v2.y + r2 * v3.y,
        a * v1.z + r1 * v2.z + r2 * v3.z
      );
    }

    // 0. Sphere Swarm (Hero)
    const shapeSphere: THREE.Vector3[] = [];
    const crowdRadius = 45;
    for (let i = 0; i < COUNT; i++) {
      // distribute evenly on spherical surface via fibonacci spiral
      const phi = Math.acos(1.0 - 2.0 * ((i + 0.5) / COUNT));
      const theta = 2.399963 * i;
      const r = crowdRadius * (0.6 + Math.random() * 0.4);
      shapeSphere.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        )
      );
    }
    shapes.push(shapeSphere);

    // 1. Triangle (About)
    const shapeTriangle: THREE.Vector3[] = [];
    const triSize = 60;
    const t1 = new THREE.Vector3(0, triSize, 0);
    const t2 = new THREE.Vector3(-triSize * 0.866, -triSize * 0.5, 0);
    const t3 = new THREE.Vector3(triSize * 0.866, -triSize * 0.5, 0);
    for (let i = 0; i < COUNT; i++) {
      const pt = randomPointInTriangle(t1, t2, t3);
      pt.z += (Math.random() - 0.5) * 8;
      shapeTriangle.push(pt);
    }
    shapes.push(shapeTriangle);

    // 2. Square (Speakers)
    const shapeSquare: THREE.Vector3[] = [];
    const sqSize = 45;
    for (let i = 0; i < COUNT; i++) {
      shapeSquare.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * sqSize * 2,
          (Math.random() - 0.5) * sqSize * 2,
          (Math.random() - 0.5) * 8
        )
      );
    }
    shapes.push(shapeSquare);

    // 3. Star (Schedule)
    const shapeStar: THREE.Vector3[] = [];
    function generateStarPoints(
      innerRadius: number,
      outerRadius: number,
      points: number
    ) {
      const vertices: THREE.Vector3[] = [];
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        vertices.push(
          new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), 0)
        );
      }
      return vertices;
    }
    const starVertices = generateStarPoints(20, 50, 5);
    for (let i = 0; i < COUNT; i++) {
      const segment = Math.floor(Math.random() * starVertices.length);
      const nextSegment = (segment + 1) % starVertices.length;
      const pt = randomPointInTriangle(
        new THREE.Vector3(0, 0, 0),
        starVertices[segment],
        starVertices[nextSegment]
      );
      pt.z += (Math.random() - 0.5) * 8;
      shapeStar.push(pt);
    }
    shapes.push(shapeStar);

    // 4. Hexagon (Register)
    const shapeHexagon: THREE.Vector3[] = [];
    const hexVertices = generateStarPoints(50, 50, 3); // 6 outer points on a circle = hexagon
    for (let i = 0; i < COUNT; i++) {
      const segment = Math.floor(Math.random() * hexVertices.length);
      const nextSegment = (segment + 1) % hexVertices.length;
      const pt = randomPointInTriangle(
        new THREE.Vector3(0, 0, 0),
        hexVertices[segment],
        hexVertices[nextSegment]
      );
      pt.z += (Math.random() - 0.5) * 8;
      shapeHexagon.push(pt);
    }
    shapes.push(shapeHexagon);

    // --- DATA ARRAYS ---
    const positions: THREE.Vector3[] = [];
    const color = new THREE.Color();
    const dummy = new THREE.Object3D();

    for (let i = 0; i < COUNT; i++) {
      positions.push(shapes[0][i].clone());
      instancedMesh.setColorAt(i, color.setHex(0xe62b1e));
    }

    // --- SCROLL LOGIC ---
    let scrollProgress = 0;

    function updateScroll() {
      // Use documentElement scrollHeight to get the full page height accurately
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      let scrollY = window.scrollY;

      if (maxScroll <= 0) {
        scrollProgress = 0;
        return;
      }

      const progress = (scrollY / maxScroll) * (numShapes - 1);
      scrollProgress = Math.max(0, Math.min(progress, numShapes - 1));
    }

    window.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);
    // Timeout to ensure DOM is fully laid out before initial calculation
    setTimeout(updateScroll, 100);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const targetPos = new THREE.Vector3();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * SPEED_MULT;

      const fromShapeIdx = Math.floor(scrollProgress);
      const toShapeIdx = Math.min(fromShapeIdx + 1, numShapes - 1);
      const lerpFactor = scrollProgress - fromShapeIdx;

      const viralEnergy = 1.2;

      for (let i = 0; i < COUNT; i++) {
        // Calculate Target Position based on Scroll
        targetPos
          .copy(shapes[fromShapeIdx][i])
          .lerp(shapes[toShapeIdx][i], lerpFactor);

        // Noise jitter to make it alive
        const wx = Math.sin(time * 3.1 + i * 0.5) * viralEnergy;
        const wy = Math.cos(time * 2.7 + i * 0.8) * viralEnergy;
        const wz = Math.sin(time * 2.3 + i * 0.3) * viralEnergy;

        targetPos.x += wx;
        targetPos.y += wy;
        targetPos.z += wz;

        // Dynamic color based on position in swarm + time
        const infection = (Math.sin(time * 1.5 + i * 0.02) + 1) * 0.5;
        color.setHSL(0.01 + infection * 0.02, 0.85, 0.4 + infection * 0.15);

        // Smooth follow
        positions[i].lerp(targetPos, 0.08);

        dummy.position.copy(positions[i]);
        dummy.lookAt(0, 0, 0);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, color);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }

      // Global slight rotation
      scene.rotation.y = Math.sin(time * 0.1) * 0.15;
      scene.rotation.x = Math.cos(time * 0.12) * 0.08;

      composer.render();
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      updateScroll();
    };

    window.addEventListener("resize", handleResize);

    // Initialization cleanup
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    />
  );
}
