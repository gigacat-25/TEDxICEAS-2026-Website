# TEDx ICEAS — Stitch / Antigravity Prompt

Build a smooth-scroll, single-page website for **TEDx ICEAS** with the theme **"What Shapes Us"**.

The website should feel cinematic, intelligent, minimal, and emotionally powerful — not generic startup style. Use a premium editorial + tech aesthetic with deep black backgrounds, restrained TED red accents, elegant typography, and strong spacing. The site will be hosted on **Cloudflare Pages**, so keep it static and production-ready.

## Core Idea
The signature interaction of the site must be a **dynamic particle swarm background** that reacts to scroll.

I do **not** want decorative floating particles.
I want a **true shape-forming particle system**:
- At the top of the page, particles begin as a **swirling circle / spherical swarm**.
- As the user scrolls down through sections, the **same particles smoothly reorganize into different recognizable shapes**.
- The morphing must feel fluid, continuous, and intentional — not like abrupt scene changes.
- The transitions between shapes must be driven by **scroll progress**, not button clicks.
- The particles should always look alive, with slight motion/jitter/energy, even when forming a stable shape.

## Required Particle Tech
Use **JavaScript particle animation with Three.js**.
Use the exact implementation style of the following base setup for the particle effect:
- `three`
- `OrbitControls`
- `EffectComposer`
- `RenderPass`
- `UnrealBloomPass`
- `InstancedMesh`
- `TetrahedronGeometry`
- dynamic instance matrices and colors
- animation loop with `target.set(...)`, lerping positions, and updating `instanceMatrix`

Use my existing particle architecture as the foundation.
The particle effect should be the main visual identity of the page.

## Important Change From My Current Version
Right now my particle code only creates a circular / swarm-style motion.
I want you to modify the behavior so that **scrolling morphs the particle targets into different shapes**.

### Scroll-driven shape sequence
Map page scroll progress to particle formation states like this:
1. **Hero:** circular / orbital swarm
2. **About theme section:** triangle
3. **Speakers section:** square
4. **Schedule section:** star
5. **Register / final CTA:** hexagon or abstract TEDx-inspired geometric form

The particles should interpolate between target formations smoothly.
No hard jumps.

## How the particle system should work
Implement a shape-target system where each particle has a target position depending on the current scroll stage.

### Requirements
- Keep a fixed particle count, around 12,000 to 20,000.
- Precompute target positions for each shape.
- On scroll, calculate normalized scroll progress.
- Convert that progress into a shape index + interpolation factor.
- Lerp each particle from the current shape target to the next shape target.
- Add subtle noise/jitter so the formations feel alive.
- Keep bloom/glow subtle but visible.
- Preserve performance for desktop and mobile.
- Respect `prefers-reduced-motion` with a lighter fallback.

## Shape generation requirements
Create particle target generators for:
- circle / sphere swarm
- triangle
- square
- star
- hexagon

If needed, distribute particles along outlines plus partially inside the shape so the forms read clearly.
The shapes must be recognizable from a front-facing camera.

## Scroll behavior
Create a smooth scrolling storytelling website where the content sections drive the particle morphs.

### Sections
- Hero
- About the theme
- Speakers
- Schedule
- Register
- Footer

Each section should have enough height so the particle transitions have room to breathe.
Use smooth scroll behavior and clean section snapping feel, but do not use aggressive snapping.

## Visual direction
- Background: near-black / charcoal
- Accent: TED red
- Text: off-white
- Style: premium, modern, immersive
- Avoid cheesy gradients, purple glows, generic SaaS cards, or over-designed startup visuals
- Use elegant typography and strong whitespace
- Keep content layered above the particle canvas

## Layout / implementation requirements
- Single HTML entry point
- Static site only
- Use semantic HTML
- Canvas/WebGL scene fixed behind the content
- Content should scroll normally over the scene
- Use responsive design for mobile and desktop
- Keep navigation simple and clean
- Use section IDs and anchor links

## Technical implementation details
Use this exact architectural approach for the particle layer:
- fixed full-screen WebGL canvas
- Three.js scene with perspective camera
- Instanced mesh particles using tetrahedron geometry
- bloom post-processing
- animation loop updating instance matrices every frame
- per-particle target positions derived from shape generators
- scroll progress influences morph blending between shapes
- camera remains mostly stable; do not turn this into a free-orbit demo

Do **not** make this feel like a generic 3D playground.
It is a storytelling event website with a highly controlled visual system.

## Important constraints
- Keep it deployable on Cloudflare Pages
- No backend
- No localStorage dependency
- Use CDN imports if needed
- Ensure performance and responsive resizing
- Keep code organized and readable

## Use my particle code as the base
Use this exact code structure as the basis for the particle system and modify it so the particle targets form different shapes based on scroll progress.
Preserve the use of:
- `COUNT`
- `scene`, `camera`, `renderer`
- `EffectComposer`
- `UnrealBloomPass`
- `InstancedMesh`
- `positions[]`
- `target`
- `dummy`
- per-frame loop and lerping

The important thing is:
**replace the single swarm target logic with scroll-controlled multi-shape target generation and morph interpolation.**

## Output expectation
Generate the complete website code.
The final result should:
- look like a polished TEDx event site
- have a scroll-driven particle background
- morph particles into different shapes across sections
- feel smooth, premium, and intentional
- be ready for deployment on Cloudflare Pages

## If helpful, use this wording inside the implementation notes
"Use scroll progress to interpolate particle target positions between multiple precomputed shape fields, so the swarm continuously morphs from a circle into a triangle, square, star, and hexagon as the user moves through the page."

## My particle base code
Use the following as the particle-effect foundation and extend it for shape morphing:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Particles Swarm Export</title>
    <style>body { margin: 0; overflow: hidden; background: #000; }</style>
    <script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
    </script>
</head>
<body>
    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        // CONFIG
        const COUNT = 20000;
        const SPEED_MULT = 1;
        const AUTO_SPIN = true;

        // SETUP
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.01);
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 0, 100);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = AUTO_SPIN;
        controls.autoRotateSpeed = 2.0;

        // POST PROCESSING
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.strength = 1.8; bloomPass.radius = 0.4; bloomPass.threshold = 0;
        composer.addPass(bloomPass);

        // SWARM OBJECTS
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();
        const target = new THREE.Vector3();
        const pColor = new THREE.Color(); // Kept for safety, for potential references
        
        // INSTANCED MESH
        const geometry = new THREE.TetrahedronGeometry(0.25);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(instancedMesh);

        // DATA ARRAYS
        const positions = [];
        for(let i=0; i<COUNT; i++) {
            positions.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
            instancedMesh.setColorAt(i, color.setHex(0x00ff88)); // Init Color
        }

        // CONTROL STUBS
        const PARAMS = {"spd":0.5,"rad":46.4,"nrg":2};
        const addControl = (id, label, min, max, val) => {
            return PARAMS[id] !== undefined ? PARAMS[id] : val;
        };
        const setInfo = () => {};
        const annotate = () => {};

        // ANIMATION LOOP
        const clock = new THREE.Clock();
        
        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime() * SPEED_MULT;
            
            // Shader Time Update
            if(material.uniforms && material.uniforms.uTime) {
                material.uniforms.uTime.value = time;
            }

            controls.update();

            // SWARM LOGIC
            const count = COUNT; // Alias for user code compatibility
            for(let i=0; i<COUNT; i++) {
                 // USER CODE INJECTION START
                 const spreadSpeed = addControl("spd", "Spread Speed", 0.5, 4.0, 1.5);
                 const crowdRadius = addControl("rad", "Crowd Radius", 20, 80, 45);
                 const viralEnergy = addControl("nrg", "Viral Energy", 0.1, 2.0, 0.8);
                 
                 const phi = Math.acos(1.0 - 2.0 * (i + 0.5) / count);
                 const theta = 2.399963 * i;
                 
                 const bx = crowdRadius * Math.sin(phi) * Math.cos(theta);
                 const by = crowdRadius * Math.cos(phi);
                 const bz = crowdRadius * Math.sin(phi) * Math.sin(theta);
                 
                 const dist = Math.sqrt(bx * bx + by * by + bz * bz) + 0.001;
                 
                 const cycleDur = 8.0 / spreadSpeed;
                 const tCycle = time % cycleDur;
                 const waveFront = (tCycle / cycleDur) * crowdRadius * 1.3;
                 const waveWidth = crowdRadius * 0.15;
                 
                 const infection = Math.max(0.0, Math.min(1.0, (waveFront - dist) / waveWidth));
                 
                 const jitter = infection * viralEnergy;
                 const wx = Math.sin(time * 4.1 + i * 0.73) * jitter * 2.0;
                 const wy = Math.cos(time * 3.7 + i * 1.17) * jitter * 2.0;
                 const wz = Math.sin(time * 3.3 + i * 0.91) * jitter * 2.0;
                 
                 const pushFactor = 1.0 + infection * 0.15;
                 target.set(bx * pushFactor + wx, by * pushFactor + wy, bz * pushFactor + wz);
                 
                 const hue = 0.1 * (1.0 - infection);
                 const sat = 0.2 + infection * 0.8;
                 const lit = 0.25 + infection * 0.35;
                 color.setHSL(hue, sat, lit);
                 
                 if (i === 0) {
                   setInfo("Viral Marketing Campaign", "One spark ignites 20,000. Watch the idea spread like wildfire.");
                   annotate("pz", new THREE.Vector3(0, 0, 0), "Patient Zero");
                 }
                 // USER CODE INJECTION END

                 // LERP & UPDATE
                 positions[i].lerp(target, 0.1);
                 dummy.position.copy(positions[i]);
                 dummy.updateMatrix();
                 instancedMesh.setMatrixAt(i, dummy.matrix);
                 instancedMesh.setColorAt(i, color); // Fix: Use 'color' which user modifies
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
            instancedMesh.instanceColor.needsUpdate = true;

            composer.render();
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>
```
