import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { HeroText, Particles, SkillGem } from './Models';
import Lighthouse from './Lighthouse';
import Loader from '../UI/Loader';
import { portfolioData } from '../../constants/data';

const ScrollBasedHero = () => {
    const scroll = useScroll();
    const ref = useRef();
    const { viewport } = useThree();

    useFrame(() => {
        if (!ref.current) return;
        // Scroll offset goes 0..1. 
        // We want the text to move up and fade out as we scroll past the first section.
        // The first section is roughly 1/pages of the total height.
        // Let's say we want it gone by the time we scroll 1 full viewport height.

        // Total scrollable height in viewports approx = pages.
        // current scroll in viewports = scroll.offset * pages.

        const scrollY = scroll.offset * scroll.pages * viewport.height;

        // Move up:
        ref.current.position.y = scrollY * 1; // Move at normal speed (or slightly faster/slower)

        // Actually, preventing overlap is easier if we just fade it out quickly or move it faster.
        // Let's move it UP along with the camera (static) ?? 
        // No, ScrollControls moves the camera via HTML scroll usually? No, drei ScrollControls keeps camera static and moves <Scroll> contents UP.
        // So if we are OUTSIDE <Scroll>, we are static.
        // To behave like normal content, we should move UP as scroll increases.
        // To behave like "background" that scrolls away, we move UP.

        ref.current.position.y = scroll.offset * scroll.pages * viewport.height;

        // But the issue is "always in background", implying it's STUCK.
        // If I put it in <Scroll>, it automatically does `position.y = offset * height`.
        // If that wasn't working, manual won't work unless I multiply by something else.

        // Maybe the user wants it to disappear?
        // Let's add opacity fade.

        // Accelerate upwards
        ref.current.position.y = scroll.offset * scroll.pages * viewport.height * 1.5;

        // Opacity/Visibility Logic
        // We use the RAW DOM scroll (scroll.el) to check visibility.
        // This avoids the "damping" lag where the 3D scroll trails behind the actual page scroll.
        const scrollContainer = scroll.el;
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const rawScroll = scrollHeight > 0 ? scrollContainer.scrollTop / scrollHeight : 0;

        // Smooth Fade Logic
        // Start fading at 0, fully faded out by 0.05 (5% scroll)
        const fadeStart = 0;
        const fadeEnd = 0.05;
        const opacity = 1 - Math.min(Math.max((rawScroll - fadeStart) / (fadeEnd - fadeStart), 0), 1);

        ref.current.visible = opacity > 0;

        // Traverse and update opacity for all child meshes
        ref.current.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = opacity;
                // Ensure depth write is disabled when transparent to avoid artifacts, optionally
                // child.material.depthWrite = opacity > 0.5; 
            }
        });
    });

    return (
        <group ref={ref} position={[0, 0, 0]}>
            <HeroText />
        </group>
    );
};

const DayNightController = () => {
    const { scene } = useThree();
    const scroll = useScroll();

    // Define colors for cycle
    const colors = useMemo(() => ({
        night: new THREE.Color('#050505'),
        sunrise: new THREE.Color('#351c4d'), // Deep purple/orange mix
        day: new THREE.Color('#87CEEB'), // Sky blue
        sunset: new THREE.Color('#fd5e53'), // Coral/Orange
    }), []);

    useFrame(() => {
        if (!scroll) return;
        const offset = scroll.offset;
        const targetColor = new THREE.Color();
        const targetFogColor = new THREE.Color();

        // Interpolation Logic
        if (offset < 0.1) {
            // Night
            targetColor.copy(colors.night);
        } else if (offset < 0.25) {
            // Night -> Sunrise
            const t = (offset - 0.1) / 0.15;
            targetColor.lerpColors(colors.night, colors.sunrise, t);
        } else if (offset < 0.4) {
            // Sunrise -> Day
            const t = (offset - 0.25) / 0.15;
            targetColor.lerpColors(colors.sunrise, colors.day, t);
        } else if (offset < 0.6) {
            // Day
            targetColor.copy(colors.day);
        } else if (offset < 0.75) {
            // Day -> Sunset
            const t = (offset - 0.6) / 0.15;
            targetColor.lerpColors(colors.day, colors.sunset, t);
        } else if (offset < 0.9) {
            // Sunset -> Night
            const t = (offset - 0.75) / 0.15;
            targetColor.lerpColors(colors.sunset, colors.night, t);
        } else {
            // Night
            targetColor.copy(colors.night);
        }

        // Apply to scene background and fog
        scene.background.lerp(targetColor, 0.1);
        scene.fog.color.lerp(targetColor, 0.1);
    });

    return null;
};

const CelestialSystem = () => {
    const sunRef = useRef();
    const moonRef = useRef();
    const scroll = useScroll();
    const { viewport } = useThree();

    useFrame(() => {
        if (!scroll) return;
        const offset = scroll.offset;

        // Visual Radius for celestial bodies (far background)
        const radius = 15;
        const verticalOffset = -2; // Horizon adjustment

        // --- SUN LOGIC ---
        // Sun visible from ~0.1 (Dawn) to ~0.8 (Dusk)
        // Peak at 0.45 (Noon)
        // Map offset range [0.1, 0.8] to angle range [PI, 0] (Left to Right arc)
        // Or simpler: Angle = PI + (offset * someFactor)

        if (sunRef.current) {
            // Sun Cycle:
            // 0.0 - 0.15: Below horizon
            // 0.15: Rise (Angle PI)
            // 0.45: Zenith (Angle PI/2)
            // 0.75: Set (Angle 0)

            // Normalize time for sun:
            // We want 0.15 -> PI (Left horizon)
            // 0.45 -> PI/2 (Top)
            // 0.75 -> 0 (Right horizon)

            let sunAngle = -1; // Default hidden
            if (offset >= 0.1 && offset <= 0.8) {
                // Map [0.1, 0.8] to [PI, 0]
                const sunProgress = (offset - 0.1) / 0.7;
                sunAngle = Math.PI * (1 - sunProgress);
            }

            if (sunAngle >= 0) {
                const x = Math.cos(sunAngle) * radius;
                const y = Math.sin(sunAngle) * radius + verticalOffset;
                sunRef.current.position.set(x, y, -10);
                sunRef.current.visible = true;

                // Scale effect for rise/set
                const scale = 1 + Math.sin(sunAngle) * 0.5;
                sunRef.current.scale.setScalar(scale);
            } else {
                sunRef.current.visible = false;
            }
        }

        // --- MOON LOGIC ---
        // Moon opposite to Sun generally, or just visible at Night.
        // Night is [0, 0.15] and [0.75, 1.0]

        if (moonRef.current) {
            // Moon Phase:
            // 0.0 - 0.15: High to setting
            // 0.75 - 1.0: Rising to High

            let moonAngle = -1;

            if (offset < 0.2) {
                // Early Night: Setting
                // 0.0 -> PI/2 (High)
                // 0.2 -> 0 (Set Right)
                const moonProgress = offset / 0.2;
                moonAngle = (Math.PI / 2) * (1 - moonProgress);
            } else if (offset > 0.7) {
                // Late Night: Rising
                // 0.7 -> PI (Rise Left)
                // 1.0 -> PI/2 (High)
                const moonProgress = (offset - 0.7) / 0.3;
                moonAngle = Math.PI - (moonProgress * Math.PI / 2);
            } else {
                moonAngle = -1; // Hide during day
            }

            if (moonAngle >= 0) {
                const x = Math.cos(moonAngle) * radius;
                const y = Math.sin(moonAngle) * radius + verticalOffset;
                moonRef.current.position.set(x, y, -10);
                moonRef.current.visible = true;
            } else {
                moonRef.current.visible = false;
            }
        }
    });

    return (
        <group>
            {/* SUN */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color="#ffffaa" />
                {/* Sun Glow */}
                <pointLight intensity={2} distance={50} color="#ffaa00" />
            </mesh>

            {/* MOON */}
            <mesh ref={moonRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#ffffff" emissive="#222222" />
                {/* Moon Glow */}
                <pointLight intensity={0.5} distance={30} color="#aaaaff" />
            </mesh>
        </group>
    );
};

const Scene = ({ children }) => {
    return (
        <div className="w-full h-screen fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }}>
                <fog attach="fog" args={['#050505', 5, 25]} />
                <color attach="background" args={['#050505']} />

                {/* Lighting - dynamic intensity could be added here too, but simple ambient works for now */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />

                <Suspense fallback={<Loader />}>
                    <ScrollControls pages={7} damping={0.2}>
                        {/* Environmental Controls */}
                        <DayNightController />
                        <CelestialSystem />

                        {/* Static Background Layer - Moved INSIDE so it gets context */}
                        <group position={[5, -2, -8]}>
                            <Lighthouse position={[0, 0, 0]} />
                        </group>

                        {/* Custom managed Hero Text */}
                        <ScrollBasedHero />

                        {/* 3D Content Layer - MOVES WITH SCROLL */}
                        <Scroll>

                            {/* Skills Section Visuals (Approx placement) */}
                            <group position={[0, -20, 0]}>
                                {portfolioData.skills.map((skill, i) => (
                                    <SkillGem
                                        key={skill.name}
                                        skill={skill}
                                        position={[(i - 2) * 1.5, Math.sin(i) * 1, 0]}
                                    />
                                ))}
                            </group>

                            {/* White/Bright Dust for contrast in dark mode */}
                            <Particles position={[0, 0, -5]} count={2000} />
                        </Scroll>

                        {/* HTML/UI Content Layer */}
                        <Scroll html style={{ width: '100%' }}>
                            {children}
                        </Scroll>
                    </ScrollControls>

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;
