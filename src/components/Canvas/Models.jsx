import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Text3D, Center, Points, PointMaterial, useScroll } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { portfolioData } from '../../constants/data';

export const HeroText = () => {
    return (
        <Float floatIntensity={1} speed={2} rotationIntensity={0.5}>
            <Center position={[0, 0, 0]}>
                <Text3D
                    font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                    size={0.7}
                    height={0.2}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={5}
                >
                    {portfolioData.name}
                    <meshStandardMaterial color="#ffffff" emissive="#555555" roughness={0.2} metalness={0.1} />
                </Text3D>
            </Center>
            <Center position={[0, -1, 0]}>
                <Text3D
                    font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                    size={0.4}
                    height={0.1}
                >
                    {portfolioData.position}
                    <meshStandardMaterial color="#aaa" />
                </Text3D>
            </Center>
        </Float>
    );
};

export const Particles = (props) => {
    const ref = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 5 }));
    const scroll = useScroll();

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;

        // Day-Night Opacity Logic
        if (scroll) {
            const offset = scroll.offset;
            let opacity = 0.6; // Base opacity

            // Fade out during day (0.2 to 0.8)
            if (offset > 0.2 && offset < 0.8) {
                // Determine day intensity (peak at 0.5)
                const dayProgress = (offset - 0.2) / 0.6; // 0 to 1
                // 0 -> 0.5 -> 1
                // Distance from noon (0.5)
                const distFromNoon = Math.abs(dayProgress - 0.5) * 2; // 1 at edges, 0 at noon

                // Opacity should be low at noon
                opacity = 0.6 * distFromNoon;
            }

            ref.current.material.opacity = Math.max(0.05, opacity); // Keep slight visibility or 0
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
};

export const SkillGem = ({ position, skill }) => {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.2;
        mesh.current.rotation.y += delta * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={mesh}
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={hovered ? 1.2 : 1}
            >
                <dodecahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial color={hovered ? "cyan" : "#444"} wireframe />
                <Center position={[0, -1, 0]}>
                </Center>
            </mesh>
        </Float>
    );
};
