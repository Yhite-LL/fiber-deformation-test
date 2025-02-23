import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as XLSX from "xlsx";

const frameInterval = 1000 / 20;

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointsData, setPointsData] = useState<any[]>([]);
  const [zeroPoints, setZeroPoints] = useState<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<{
    x: number;
    y: number;
    z: number;
    info: any;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/模态.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const groupedData = data.slice(1).reduce((acc: any, row: any[]) => {
        const key = row[0];
        if (!acc[key]) {
          acc[key] = [];
        }
        // 将科学计数法表示的数字转换为浮点数
        const convertedRow = row.map((cell: any) => {
          if (typeof cell === 'string' && cell.match(/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/)) {
            return parseFloat(cell);
          }
          return cell;
        });
        acc[key].push(convertedRow);
        return acc;
      }, {});

      console.log(groupedData)

      setPointsData(groupedData);
      setZeroPoints(groupedData[0] || []);
    };

    fetchData();
  }, []);

  const initScene = useCallback(() => {
    if (!containerRef.current || pointsData.length === 0) return;
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      70,
      container.offsetWidth / container.offsetHeight,
      1,
      10000
    );
    camera.position.set(0, 100, 200);
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    const zeroPointsMeshes = zeroPoints.map((_, index) => {
      const zeroGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const zeroMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      const zeroPoint = new THREE.Mesh(zeroGeometry, zeroMaterial);
      scene.add(zeroPoint);
      return zeroPoint;
    });
    
    // 添加一个固定显示的框
    const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    const boxMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const boxFrame = new THREE.LineSegments(edges, boxMaterial);
    scene.add(boxFrame);

    let flag = 0;
    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime >= frameInterval) {
        zeroPointsMeshes.forEach((mesh, index) => {
          const [_, zx, zy, zz, displacement] = pointsData[flag][index];
          mesh.position.set(zx, zz + displacement * 1000000, zy);
        });
        renderer.render(scene, camera);
        lastTime = time;
        if (flag < 15) {
          flag++;
        }
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // 鼠标点击事件
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(zeroPointsMeshes);

      if (intersects.length > 0) {
        const intersected = intersects[0].object as THREE.Mesh;
        const index = zeroPointsMeshes.indexOf(intersected);
        if (index !== -1) {
          const [_, zx, zy, zz, displacement] = pointsData[flag][index];
          setSelectedPoint({
            x: zx,
            y: zz + displacement * 10,
            z: zy,
            info: pointsData[flag][index],
          });
          boxFrame.position.set(zx, zz + displacement * 10, zy);
        }
      }
    };

    renderer.domElement.addEventListener("click", onMouseClick);

    return () => {
      renderer.dispose();
      boxGeometry.dispose();
      boxMaterial.dispose();
      zeroPointsMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, [pointsData, zeroPoints]);

  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {selectedPoint && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: "5px",
          }}
        >
          <p>X: {selectedPoint.x.toFixed(2)}</p>
          <p>Y: {selectedPoint.y.toFixed(2)}</p>
          <p>Z: {selectedPoint.z.toFixed(2)}</p>
          <p>Info: {JSON.stringify(selectedPoint.info)}</p>
        </div>
      )}
    </div>
  );
};

export default ThreeScene;
