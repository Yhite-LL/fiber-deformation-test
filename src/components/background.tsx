import React, { useEffect, useState, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { read, utils } from 'xlsx';

// 定义组件的属性类型
interface ThreeSceneProps {
    isSimulationStarted: boolean;
    magnification: number;
    confirmedMoment: number;
}

const frameInterval = 1000 / 20;
let flag = 0;

const ThreeScene: React.FC<ThreeSceneProps> = ({
    isSimulationStarted,
    magnification,
    confirmedMoment,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pointsData, setPointsData] = useState<any[]>([]);
    const [zeroPoints, setZeroPoints] = useState<any[]>([]);
    const [selectedPoint, setSelectedPoint] = useState<{
        x: number;
        y: number;
        z: number;
        info: any;
    } | null>(null);
    // 新增：用于存储选中点的数组
    const [selectedPointsTable, setSelectedPointsTable] = useState<any[]>([]);

    // 异步获取数据
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/data/模态.xlsx");
            const arrayBuffer = await response.arrayBuffer();
            const workbook = read(arrayBuffer, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = utils.sheet_to_json(sheet, { header: 1 });

            const groupedData = data.slice(1).reduce<{ [key: number]: any[] }>((acc, row: any[]) => {
                const key = row[0];
                if (!acc[key]) {
                    acc[key] = [];
                }
                const convertedRow = row.map((cell: any) => {
                    if (typeof cell === 'string' && cell.match(/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/)) {
                        return parseFloat(cell);
                    }
                    return cell;
                });
                acc[key].push(convertedRow);
                return acc;
            }, {});

            console.log(groupedData);

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

        const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        const boxMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const edges = new THREE.EdgesGeometry(boxGeometry);
        const boxFrame = new THREE.LineSegments(edges, boxMaterial);


        let lastTime = 0;

        const animate = (time: number) => {
            if (flag < 15) {
                if (time - lastTime >= frameInterval) {
                    zeroPointsMeshes.forEach((mesh, index) => {
                        const [_, zx, zy, zz, displacement] = pointsData[flag][index];
                        mesh.position.set(zx, zz + displacement * magnification, zy);
                    });
                    renderer.render(scene, camera);
                    lastTime = time;
                    if (flag < 15) {
                        flag++;
                    }
                }
                requestAnimationFrame(animate);
            }
            else{
                zeroPointsMeshes.forEach((mesh, index) => {
                    const [_, zx, zy, zz, displacement] = pointsData[confirmedMoment][index];
                    mesh.position.set(zx, zz + displacement * magnification, zy);
                });
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }

        };
        if (isSimulationStarted) {
            requestAnimationFrame(animate);
        }




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
                        y: zy,
                        z: zz + displacement * magnification,
                        info: pointsData[flag][index][4],
                    });
                    boxFrame.position.set(zx, zz + displacement * magnification, zy);
                    // 新增：将选中点的应变大小添加到表格数组中
                    setSelectedPointsTable(prevTable => [
                        ...prevTable,
                        {
                            x: zx,
                            y: zy,
                            z: zz + displacement * magnification,
                            displacement
                        }
                    ]);
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
    }, [pointsData, zeroPoints, isSimulationStarted, confirmedMoment, magnification]);

    useEffect(() => {
        const cleanup = initScene();
        return cleanup;
    }, [initScene]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", position: "relative" }}
        >
            {/* 新增：左上角的表格展示 */}
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    padding: "10px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    borderRadius: "5px",
                }}
            >
                <table>
                    <thead>
                        <tr>
                            <th>X</th>
                            <th>Y</th>
                            <th>Z</th>
                            <th>应变大小</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedPointsTable.map((point, index) => (
                            <tr key={index}>
                                <td>{point.x.toFixed(2)}</td>
                                <td>{point.y.toFixed(2)}</td>
                                <td>{point.z.toFixed(2)}</td>
                                <td>{point.displacement.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedPoint && (
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        padding: "10px",
                        background: "rgba(0, 0, 0, 0.7)",
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