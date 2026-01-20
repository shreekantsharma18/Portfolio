import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Cylinder, Cone, useScroll } from '@react-three/drei';
import * as THREE from 'three';

const Lighthouse = ({ position }) => {
    const headRef = useRef();
    const beamRef = useRef();
    const lightRef = useRef();
    const { viewport, camera } = useThree();
    const target = new THREE.Vector3();
    const scroll = useScroll(); // Access scroll data

    useFrame(({ pointer }) => {
        if (!headRef.current) return;

        // Mouse tracking logic
        const x = (pointer.x * viewport.width) / 2;
        const y = (pointer.y * viewport.height) / 2;
        target.set(x, y, camera.position.z);
        headRef.current.lookAt(target);

        // Day-Night Cycle Logic for Beam
        if (scroll) {
            // Cycle: Night (0) -> Sunrise (0.15) -> Day (0.3 - 0.6) -> Sunset (0.75) -> Night (0.9)
            const offset = scroll.offset;

            let intensity = 1;

            if (offset < 0.1) {
                // Night (Full Beam)
                intensity = 1;
            } else if (offset < 0.25) {
                // Sunrise (Fade Out)
                intensity = 1 - (offset - 0.1) / 0.15;
            } else if (offset < 0.6) {
                // Day (No Beam)
                intensity = 0;
            } else if (offset < 0.75) {
                // Sunset (Fade In)
                intensity = (offset - 0.6) / 0.15;
            } else {
                // Night (Full Beam)
                intensity = 1;
            }

            // Clamp intensity
            intensity = Math.max(0, Math.min(1, intensity));

            // Apply to Beam Mesh
            if (beamRef.current) {
                beamRef.current.material.opacity = 0.2 * intensity;
                beamRef.current.visible = intensity > 0.01;
            }

            // Apply to SpotLight
            if (lightRef.current) {
                lightRef.current.intensity = 50 * intensity;
            }
        }
    });

    return (
        <group position={position}>
            {/* Tower Body */}
            <group position={[0, -2, 0]}>
                <Cylinder args={[0.8, 1, 4, 8]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#888" roughness={0.8} />
                </Cylinder>
                <Cylinder args={[0.5, 0.7, 6, 8]} position={[0, 5, 0]}>
                    <meshStandardMaterial color="#fff" />
                </Cylinder>
                <Cylinder args={[0.52, 0.72, 1, 8]} position={[0, 4, 0]}>
                    <meshStandardMaterial color="#d00" />
                </Cylinder>
                <Cylinder args={[0.56, 0.76, 1, 8]} position={[0, 6, 0]}>
                    <meshStandardMaterial color="#d00" />
                </Cylinder>
            </group>

            {/* Rotating Lamp House / Head */}
            <group position={[0, 5.5, 0]} ref={headRef}>
                <Cylinder args={[0.6, 0.6, 1, 8]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#222" />
                </Cylinder>

                <group>
                    <Cone ref={beamRef} args={[1.5, 20, 32, 1, true]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 10]}>
                        <meshStandardMaterial
                            color="#ffff00"
                            transparent
                            opacity={0.2}
                            side={THREE.DoubleSide}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                        />
                    </Cone>

                    <group rotation={[0, Math.PI, 0]}>
                        <spotLight
                            ref={lightRef}
                            color="#ffff00"
                            intensity={50}
                            distance={50}
                            angle={0.5}
                            penumbra={0.5}
                            position={[0, 0, 0]}
                        />
                    </group>
                </group>
            </group>
        </group>
    );
};

export default Lighthouse;
