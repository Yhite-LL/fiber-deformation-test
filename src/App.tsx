import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import ThreeScene from "./components/background";
import SideMenu from "./components/SideMemu";
import Modal from "./components/modal";

function App() {
    const [isSimulationStarted, setIsSimulationStarted] = useState(false);
    const [magnification, setMagnification] = useState(1000000);
    const [confirmedMoment, setConfirmedMoment] = useState<number>(0);
    const [length, setLength] = useState(10);

    const handleStartSimulation = () => {
        setIsSimulationStarted(true);
    };

    const onConfirmMoment =  (moment: number) => {
        // 这里只是存储回调，不要在渲染时调用
       
        setConfirmedMoment(moment);
    };
  
    const onLengthChange = (newLength: number) => {
        setLength(newLength);
    };

    return (
        <div className="App">
            <div className="column left-column">
                <ThreeScene
                    isSimulationStarted={isSimulationStarted}
                    magnification={magnification}
                    confirmedMoment={confirmedMoment}
                />
                <div style={{position:'absolute'}}>
                    模型框架three，js
                    zhanshishike:di{confirmedMoment}shike,
                    间距：10
                </div>
            </div>
            <div className="column right-column">
                <div>
                    <div style={{ color: 'black', height: '200px' }}>这里展示 python 绘制的画面</div>
                </div>
                <SideMenu
                    points={100}
                    length={length}
                    onStartSimulation={handleStartSimulation}
                    magnification={magnification}
                    onMagnificationChange={(newMagnification: number) => {
                        setMagnification(newMagnification);
                    }}
                    onLengthChange={onLengthChange}
                    onConfirmMoment={onConfirmMoment}
                />
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Failed to find the root element.");
}

export default App;