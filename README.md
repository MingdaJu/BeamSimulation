# Mechanical Part Simulation: Cantilever Beam

An interactive, high-performance 3D visualization of a mechanical cantilever beam undergoing physical stress and deformation, built with React and Three.js. This project demonstrates dynamic data visualization and WebGL performance optimization techniques.

## Features

* **Dynamic Deformation:** Real-time geometric displacement calculation based on the applied external load, simulating accurate cantilever deflection.
* **Stress Contour Plot:** Procedural mapping of structural stress distribution (bending stress and localized stress concentration) into a responsive color gradient (Blue = Low Stress, Red = High Stress).
* **High-Performance Rendering:** Leverages React's `useMemo` and `@react-three/fiber` to efficiently mutate localized vertex attributes (`BufferAttribute`), avoiding costly full-component re-renders while maintaining strict data-driven view updates.
* **Interactive 3D Environment:** Full orbit controls (pan, zoom, rotate) and an integrated viewport gizmo for a professional engineering software feel.

## Tech Stack

* React
* TypeScript
* Three.js
* `@react-three/fiber` (R3F)
* `@react-three/drei`

## Getting Started

### Prerequisites
Ensure you have Node.js installed on your local machine.

### Installation

1. Clone this repository or download the project files.
2. Navigate to the project directory:
   ```bash
   cd mechanical-simulation-demo


<img width="3801" height="1767" alt="image" src="https://github.com/user-attachments/assets/46b1a18f-77bb-4b42-950c-b7094b19b6a2" />
