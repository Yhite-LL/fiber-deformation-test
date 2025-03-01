import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import ThreeScene from "./components/background";
import SideMenu from "./components/SideMemu";
import Modal from "./components/modal";

function App() {
  // 状态管理：模拟是否开始
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  // 状态管理：放大倍数
  const [magnification, setMagnification] = useState(1000000);
  // 状态管理：确认的时刻
  const [confirmedMoment, setConfirmedMoment] = useState<number>(0);
  // 状态管理：长度
  const [length, setLength] = useState(10);

  // 处理开始模拟的函数
  const handleStartSimulation = () => {
    setIsSimulationStarted(true);
  };

  // 处理确认时刻的函数
  const onConfirmMoment = (moment: number) => {
    // 这里只是存储回调，不要在渲染时调用
    setConfirmedMoment(moment);
  };

  // 处理长度变化的函数
  const onLengthChange = (newLength: number) => {
    setLength(newLength);
  };

  // 处理按钮点击，唤起终端并执行命令
  const handleButtonClick = () => {
    console.log(11);
    // 替换为有效的 URL
    window.open('https://www.example.com', '_blank');
  };

  return (
    <div className="App">
      {/* 左侧列 */}
      <div className="column left-column">
        {/* 渲染 ThreeScene 组件 */}
        <ThreeScene
          isSimulationStarted={isSimulationStarted}
          magnification={magnification}
          confirmedMoment={confirmedMoment}
        />
        {/* 显示信息的 div */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '320px',
            padding: '30px',
            background: 'transparent',
            color: 'black',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          展示时刻：第{confirmedMoment}时刻  间距:10
          <br />
          step time:50ms
        </div>
      </div>
      {/* 右侧列 */}
      <div className="column right-column">
        <div>
          {/* 显示 python 绘制画面的 div */}
          <div style={{ color: 'black', height: '200px' }}>这里展示 python 绘制的画面</div>
          {/* 新增按钮 */}
          <button
            style={{
              marginTop: '20px',
              padding: '8px 15px',
              backgroundColor: '#555',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={handleButtonClick}
          >
            唤起终端执行命令
          </button>
        </div>
        {/* 渲染 SideMenu 组件 */}
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

// 获取根元素
const rootElement = document.getElementById("root");

if (rootElement) {
  // 创建 React 根节点
  const root = ReactDOM.createRoot(rootElement);
  // 渲染 App 组件
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // 找不到根元素时输出错误信息
  console.error("Failed to find the root element.");
}

export default App;