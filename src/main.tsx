import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointPosition, setPointPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0)); 

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; 

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement); 

    const gridHelper = new THREE.GridHelper(10, 10); 
    scene.add(gridHelper);

    const geometry = new THREE.SphereGeometry(0.1, 32, 32); 
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 
    const point = new THREE.Mesh(geometry, material);
    scene.add(point);

    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;
      point.position.x = Math.sin(time) * 2; 
      point.position.y = Math.cos(time) * 2; 

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      material.dispose(); // 释放材质
      geometry.dispose(); // 释放几何体
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}></div>
  );
};

export default ThreeScene;
