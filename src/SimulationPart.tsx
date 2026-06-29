import React, { useMemo } from 'react';
import * as THREE from 'three';

interface SimulationPartProps {
  force: number; // Receive the applied load magnitude from the parent
}

export const SimulationPart: React.FC<SimulationPartProps> = ({ force }) => {
  // Define beam dimensions
  const length = 10;
  const height = 1.5;
  const width = 1.5;

  // Recalculate geometry vertices and colors only when 'force' changes
  const { geometry } = useMemo(() => {
    // Generate a fresh BoxGeometry to grab the original, undeformed vertex data
    // High segmentation (100 along length) ensures smooth bending and color gradients
    const geo = new THREE.BoxGeometry(length, height, width, 100, 15, 15);
    const count = geo.attributes.position.count;
    
    const colors = new Float32Array(count * 3);

    // Set a baseline maximum expected stress to normalize the color scale
    // This ensures low forces remain mostly blue, and high forces transition to red
    const maxExpectedStress = 16.0; 

    for (let i = 0; i < count; i++) {
      const x = geo.attributes.position.getX(i);
      const y = geo.attributes.position.getY(i);
      const z = geo.attributes.position.getZ(i);

      // --- Physical Stress Calculation ---
      // Moment arm: Distance from the loaded end (right side, x = 5)
      const distanceToLoad = 5 - x; 
      
      // Bending stress is proportional to the moment arm, distance from neutral axis (|y|), and applied force
      const bendingStress = distanceToLoad * Math.abs(y) * force;
      
      // Simulate localized stress concentration at the fixed support (x < -4.8)
      const isFixedEnd = x < -4.8;
      const concentration = isFixedEnd ? (Math.abs(y) * 2 + Math.abs(z) * 2) * force : 0;
      const totalStress = bendingStress + concentration;

      // --- Dynamic Deformation (Deflection) ---
      // Map x-coordinate to a relative ratio 't' (0 at fixed end, 1 at loaded end)
      const t = (x + 5) / length; 
      
      // Approximate the deflection curve of a cantilever beam: ~ 3*t^2 - t^3
      // The coefficient (force * 0.6) controls the maximum visual displacement
      const deflection = force * 0.6 * (3 * t * t - t * t * t);
      
      // Dynamically update the Y position of the current vertex (bend downwards)
      geo.attributes.position.setY(i, y - deflection);

      // --- Contour Plot Color Mapping ---
      // Normalize stress and cap it at 1.0
      const normalizedStress = Math.min(1.0, totalStress / maxExpectedStress);
      
      // HSL Hue range: 0.66 (Pure Blue, Low Stress) to 0.0 (Pure Red, High Stress)
      const hue = (1.0 - normalizedStress) * 0.66;
      
      const color = new THREE.Color();
      color.setHSL(hue, 1.0, 0.5);
      
      // Assign the RGB values to the color buffer array
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    // Overwrite the geometry's color attribute with the new computed colors
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Recompute vertex normals to ensure accurate lighting/shadows on the deformed shape
    geo.computeVertexNormals();

    return { geometry: geo };
  }, [force]); // Dependency array: trigger recalculation when 'force' changes

  return (
    <group>
      {/* Main Cantilever Beam Body */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
          vertexColors={true} 
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Fixed Constraint Visualization: A rigid gray wall mount at the left end */}
      <mesh position={[-5.1, 0, 0]}>
        <boxGeometry args={[0.2, 4, 4]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
};