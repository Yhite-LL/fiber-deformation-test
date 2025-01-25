import React from 'react';
import ReactDOM from 'react-dom/client';  // 使用 React 18 的新的 API
import './App.css';
import ThreeScene from './components/background';
import SideMenu from './components/SideMemu';
import  Modal from './components/modal';

function App() {
  return (
    <div className='App'>
      <div className='column left-column'>
        <ThreeScene />
      </div>
      {/* <Modal isShow={true} x={10} y={10} z={10} offset={20} width={200} height={200}></Modal> */}
      <div className='column right-column'>
        <SideMenu points={100} length={10} magnification={10}/>
      </div>
    </div>
  );
}

// 获取 id 为 'root' 的 DOM 元素并确保它存在
const rootElement = document.getElementById('root');

// 如果 rootElement 存在，创建一个 React 渲染根，并渲染 App 组件
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);  // React 18 的 createRoot API
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element.');
}

export default App;