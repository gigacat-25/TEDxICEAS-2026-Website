"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function ParticleCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0 });
    const targetMouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        // --- DEVICE ADAPTATION ---
        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const COUNT = isMobile ? 2000 : 12000;
        const SHAPE_COUNT = 5;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, isMobile ? 0.025 : 0.01);
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 0, isMobile ? 120 : 100);

        const renderer = new THREE.WebGLRenderer({ 
            antialias: !isMobile, // Disable antialias on mobile for performance
            powerPreference: "high-performance",
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight), 
            1.5, 0.4, 0.85
        );
        bloomPass.strength = isMobile ? 0.8 : 1.0; 
        bloomPass.radius = 0.6; 
        bloomPass.threshold = 0.15;
        composer.addPass(bloomPass);

        // --- PARTICLE OBJECTS ---
        const geometry = isMobile ? new THREE.BoxGeometry(0.4, 0.4, 0.4) : new THREE.IcosahedronGeometry(0.3, 0);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(instancedMesh);

        // --- TARGET GENERATION ---
        const targets = Array.from({ length: SHAPE_COUNT }, () => new Float32Array(COUNT * 3));

        const generateShapes = () => {
            const scale = isMobile ? 0.7 : 1.0;
            for (let i = 0; i < COUNT; i++) {
                // 1. Sphere (Hero)
                const phi = Math.acos(1.0 - 2.0 * (i + 0.5) / COUNT);
                const theta = 2.399963 * i;
                const radius = (35 + Math.random() * 8) * scale;
                targets[0][i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                targets[0][i * 3 + 1] = radius * Math.cos(phi);
                targets[0][i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

                // 2. Triangle (About)
                const tSide = i % 3;
                const t = Math.random();
                const tSize = 55 * scale;
                let tx, ty;
                if (tSide === 0) { tx = (t - 0.5) * tSize * 2; ty = -tSize * 0.4; }
                else if (tSide === 1) { tx = t * tSize; ty = (t - 0.5) * tSize * 1.8 + tSize * 0.6; }
                else { tx = (t - 1) * tSize; ty = (1 - t) * tSize * 1.8 - tSize * 0.4; }
                targets[1][i * 3] = tx;
                targets[1][i * 3 + 1] = ty;
                targets[1][i * 3 + 2] = (Math.random() - 0.5) * 15;

                // 3. Square/Grid (Speakers)
                const rows = Math.floor(Math.sqrt(COUNT));
                const gx = (i % rows) - rows / 2;
                const gy = Math.floor(i / rows) - rows / 2;
                const spacing = (isMobile ? 1.8 : 1.2) * scale;
                targets[2][i * 3] = gx * spacing;
                targets[2][i * 3 + 1] = gy * spacing;
                targets[2][i * 3 + 2] = Math.sin(gx * 0.2 + gy * 0.2) * 5;

                // 4. Star (Schedule)
                const starTheta = (i / COUNT) * Math.PI * 2;
                const points = 5;
                const innerR = 15 * scale;
                const outerR = 50 * scale;
                const modTheta = (starTheta * points) % (Math.PI * 2);
                const starR = modTheta < Math.PI ? 
                    THREE.MathUtils.lerp(outerR, innerR, modTheta / Math.PI) : 
                    THREE.MathUtils.lerp(innerR, outerR, (modTheta - Math.PI) / Math.PI);
                
                targets[3][i * 3] = starR * Math.cos(starTheta);
                targets[3][i * 3 + 1] = starR * Math.sin(starTheta);
                targets[3][i * 3 + 2] = (Math.random() - 0.5) * 10;

                // 5. Hexagon/DNA (Register)
                const hTheta = (i / COUNT) * Math.PI * 10;
                const hRadius = 20 * scale;
                targets[4][i * 3] = hRadius * Math.cos(hTheta);
                targets[4][i * 3 + 1] = (i / COUNT - 0.5) * 120 * scale;
                targets[4][i * 3 + 2] = hRadius * Math.sin(hTheta);
            }
        };

        generateShapes();

        // --- ANIMATION STATE ---
        const currentPositions = new Float32Array(COUNT * 3);
        const velocities = new Float32Array(COUNT * 3);
        for(let i=0; i<COUNT*3; i++) {
            currentPositions[i] = (Math.random() - 0.5) * 400;
        }

        const dummy = new THREE.Object3D();
        const color = new THREE.Color();
        const clock = new THREE.Clock();

        const handleScroll = () => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h > 0) {
                scrollRef.current = window.scrollY / h;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 20;
            targetMouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 20;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches[0]) {
                targetMouseRef.current.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 15;
                targetMouseRef.current.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 15;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        const animate = () => {
            const time = clock.getElapsedTime();
            
            // Smooth mouse follow
            mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

            const progress = Math.min(Math.max(scrollRef.current, 0), 1) * (SHAPE_COUNT - 1);
            const index = Math.floor(progress);
            const factor = progress % 1;

            const nextIndex = Math.min(index + 1, SHAPE_COUNT - 1);
            const currentIdx = Math.min(index, SHAPE_COUNT - 1);

            for (let i = 0; i < COUNT; i++) {
                const i3 = i * 3;
                
                const tx = THREE.MathUtils.lerp(targets[currentIdx][i3], targets[nextIndex][i3], factor);
                const ty = THREE.MathUtils.lerp(targets[currentIdx][i3 + 1], targets[nextIndex][i3 + 1], factor);
                const tz = THREE.MathUtils.lerp(targets[currentIdx][i3 + 2], targets[nextIndex][i3 + 2], factor);

                // Optimization: Skip noise on mobile or if reduced motion is preferred
                let noiseX = 0, noiseY = 0, noiseZ = 0;
                if (!isMobile && !prefersReducedMotion) {
                    noiseX = Math.sin(time * 0.5 + i * 0.1) * 2;
                    noiseY = Math.cos(time * 0.4 + i * 0.15) * 2;
                    noiseZ = Math.sin(time * 0.3 + i * 0.2) * 2;
                }

                const targetX = tx + noiseX + mouseRef.current.x * (1 + Math.sin(i) * 0.5);
                const targetY = ty + noiseY + mouseRef.current.y * (1 + Math.cos(i) * 0.5);
                const targetZ = tz + noiseZ;

                // Physics update
                if (prefersReducedMotion) {
                    currentPositions[i3] = targetX;
                    currentPositions[i3 + 1] = targetY;
                    currentPositions[i3 + 2] = targetZ;
                } else {
                    const speed = isMobile ? 0.02 : 0.01;
                    velocities[i3] += (targetX - currentPositions[i3]) * speed;
                    velocities[i3 + 1] += (targetY - currentPositions[i3 + 1]) * speed;
                    velocities[i3 + 2] += (targetZ - currentPositions[i3 + 2]) * speed;

                    const damping = isMobile ? 0.8 : 0.85;
                    velocities[i3] *= damping;
                    velocities[i3 + 1] *= damping;
                    velocities[i3 + 2] *= damping;

                    currentPositions[i3] += velocities[i3];
                    currentPositions[i3 + 1] += velocities[i3 + 1];
                    currentPositions[i3 + 2] += velocities[i3 + 2];
                }

                dummy.position.set(currentPositions[i3], currentPositions[i3 + 1], currentPositions[i3 + 2]);
                
                const s = (0.5 + Math.sin(time + i) * 0.2) * (isMobile ? 0.7 : 1.0);
                dummy.scale.set(s, s, s);
                
                dummy.rotation.set(time * 0.2 + i, time * 0.1, 0);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);

                // Optimization: Update colors less frequently or simplify logic on mobile
                if (!isMobile || i % 2 === 0) {
                    const dist = Math.sqrt(tx*tx + ty*ty + tz*tz);
                    const colorPulse = Math.sin(time * 2 - dist * 0.05) * 0.5 + 0.5;
                    
                    if (colorPulse > 0.85) color.setHex(0xE62B1E);
                    else if (colorPulse > 0.7) color.setHex(0x333333);
                    else color.setHex(0xffffff);
                    
                    instancedMesh.setColorAt(i, color);
                }
            }

            instancedMesh.instanceMatrix.needsUpdate = true;
            if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

            if (!isMobile) {
                camera.position.x += (mouseRef.current.x * 0.5 - camera.position.x) * 0.02;
                camera.position.y += (mouseRef.current.y * 0.5 - camera.position.y) * 0.02;
            }
            camera.lookAt(0, 0, 0);

            composer.render();
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            scene.clear();
            renderer.dispose();
            material.dispose();
            geometry.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-0 bg-transparent pointer-events-none"
            aria-hidden="true"
        />
    );
}
