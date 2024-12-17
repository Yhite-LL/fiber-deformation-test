import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee); 

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;//“阴影渲染”
    containerRef.current.appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    //平面创建
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(- Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -200;
    plane.receiveShadow = true;
    scene.add(plane);


    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = -199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    scene.add(new THREE.AmbientLight(0xf0f0f0, 3)); // 创建环境光，使场景均匀照亮


    const light = new THREE.SpotLight(0xffffff, 4.5);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.decay = 0;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 250, 1000);
    scene.add(camera);

    // 地面接收阴影
    plane.receiveShadow = true;

    // 聚光灯投射阴影
    light.castShadow = true;

    // 为了确保灯光的阴影效果可以正常显示，增加必要的阴影参数
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    //视角的转动
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    //小球以及动画效果
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
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

