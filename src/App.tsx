import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { SimulationPart } from './SimulationPart';

function App() {
  // Define the force state, default is 1.0 (standard load), range 0.0 to 2.0
  const [force, setForce] = useState<number>(1.0);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#141414', position: 'relative' }}>
      
      {/* Control Panel UI */}
      <div style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        color: 'white', 
        zIndex: 10, 
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
        width: '300px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Cantilever Beam Simulation</h3>
        <p style={{ margin: '0 0 20px 0', color: '#888', fontSize: '13px' }}>Stress & Deflection Analysis</p>
        
        {/* Slider Component */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span>Applied Load:</span>
            <span style={{ color: '#0adb50', fontWeight: 'bold' }}>{(force * 50).toFixed(0)} kN</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.05" 
            value={force} 
            onChange={(e) => setForce(parseFloat(e.target.value))}
            style={{ 
              width: '100%', 
              cursor: 'pointer',
              accentColor: '#0adb50'
            }} 
          />
        </div>

        <div style={{ borderTop: '1px solid #333', paddingTop: '10px', fontSize: '12px', color: '#aaa' }}>
          <p style={{ margin: '4px 0' }}>💡 <strong>Key Observations:</strong></p>
          <p style={{ margin: '2px 0' }}>1. Bending deformation increases at the right end as the load increases.</p>
          <p style={{ margin: '2px 0' }}>2. The fixed constraint (left) shifts from blue to red due to stress concentration.</p>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 45 }}>
        <color attach="background" args={['#141414']} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />

        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.4} adjustCamera={false}>
            {/* Pass the dynamic force value down to the simulation part */}
            <SimulationPart force={force} />
          </Stage>
        </Suspense>

        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.1} />
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ff3653', '#0adb50', '#2c8fdf']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}

export default App;