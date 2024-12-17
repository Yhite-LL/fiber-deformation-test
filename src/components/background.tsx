import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as XLSX from 'xlsx';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointsData, setPointsData] = useState<any[]>([]);
  const [zeroPoints, setZeroPoints] = useState<any[]>([]);

  useEffect(() => {
    // 读取 Excel 文件
    const fetchData = async () => {
      const response = await fetch('/data/两端固定.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // 根据第一项的值划分为不同的子数组
      const groupedData = data.slice(1).reduce((acc: any, row: any[]) => {
        const key = row[0];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(row);
        return acc;
      }, {});

      console.log(groupedData)

      setPointsData(groupedData);
      setZeroPoints(groupedData[0] || []); // 过滤第一项为0的点
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!containerRef.current || pointsData.length === 0) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -20;
    plane.receiveShadow = true;

    const helper = new THREE.GridHelper(100, 100);
    helper.position.y = -10;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    scene.add(new THREE.AmbientLight(0xf0f0f0, 3));

    const light = new THREE.SpotLight(0xffffff, 4.5);
    light.position.set(0, 10, 200);
    light.angle = Math.PI * 0.2;
    light.decay = 0;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 100;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 50, 50);
    scene.add(camera);

    plane.receiveShadow = true;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const point = new THREE.Mesh(geometry, material);
    scene.add(point);

    const newGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const newMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const newPoint = new THREE.Mesh(newGeometry, newMaterial);
    scene.add(newPoint);

    const zeroPointsMeshes = zeroPoints.map((_, index) => {
      const zeroGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const zeroMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      const zeroPoint = new THREE.Mesh(zeroGeometry, zeroMaterial);
      scene.add(zeroPoint);
      return zeroPoint;
    });

    let flag = 0;

    const animate = () => {
      // requestAnimationFrame(animate);

      zeroPointsMeshes.forEach((mesh, index) => {
        const [_, zx, zy, zz, displacement] = pointsData[flag][index];

        mesh.position.set(zx, zz + displacement * 10, zy);
      });

      renderer.render(scene, camera);
    };

    if(flag < 40)
      setInterval(() => { animate();flag++; }, 1000);

    return () => {
      renderer.dispose();
      material.dispose();
      newMaterial.dispose();
      newGeometry.dispose();
      zeroPointsMeshes.forEach(mesh => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, [pointsData, zeroPoints]);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}></div>
  );
};

export default ThreeScene;