import React, { useState } from 'react';

type SideMenuProps = {
    points: number;
    length: number;
    onLengthChange: (newLength: number) => void;
    magnification: number;
    onMagnificationChange: (newMagnification: number) => void;
    onStartSimulation: () => void;
    onConfirmMoment: (moment: number) => void; // 新增的属性，用于将时刻信息传递给父组件
};

const SideMenu: React.FC<SideMenuProps> = ({
    points,
    length,
    onLengthChange,
    magnification,
    onMagnificationChange,
    onStartSimulation,
    onConfirmMoment
}) => {
    const [inputLength, setInputLength] = useState(length);
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制弹窗显示
    const [moment, setMoment] = useState(0); // 当前选择的时刻

    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLength = parseFloat(e.target.value);
        if (!isNaN(newLength)) {
            setInputLength(newLength);
            onLengthChange(newLength);
        }
    };

    const handleMagnificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMagnification = parseFloat(e.target.value);
        if (!isNaN(newMagnification)) {
            onMagnificationChange(newMagnification);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Selected file:', file.name);
            // 处理文件
        }
    };

    // 打开弹窗
    const handlePress = () => {
        setIsModalOpen(true);
    };

    // 关闭弹窗
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // 处理时刻输入
    const handleMomentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setMoment(value);
        }
    };

    // // 增加时刻
    // const handleIncrement = () => {
    //     setMoment((prev) => prev + 1);
    // };

    // // 减少时刻
    // const handleDecrement = () => {
    //     setMoment((prev) => (prev > 0 ? prev - 1 : 0));
    // };

    // 确认时刻
    const handleConfirm = () => {
        console.log('确认时刻:', moment);
        onConfirmMoment(moment); // 调用父组件传递的函数，传递时刻信息
        setIsModalOpen(false); // 关闭弹窗
        //获取当前滑块对应的值 触发APP中事件
    };

    // 删除时刻
    const handleDelete = () => {
        console.log('删除时刻:', moment);
        setMoment(0); // 重置时刻
    };

    return (
        <div style={{
            padding: '20px',
            borderRight: '1px solid #ccc',
            height: '100vh',
            boxSizing: 'border-box',
            backgroundColor: '#f4f4f4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>参数配置</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ width: '100px', color: '#555', textAlign: 'right', marginRight: '10px' }}>点数: </label>
                <input type="text" value={points} readOnly style={{ padding: '8px', width: '150px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ width: '100px', color: '#555', textAlign: 'right', marginRight: '10px' }}>长度: </label>
                <input type="number" value={inputLength} onChange={handleLengthChange} style={{ padding: '8px', width: '150px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ width: '100px', color: '#555', textAlign: 'right', marginRight: '10px' }}>放大倍率: </label>
                <select value={magnification} onChange={handleMagnificationChange} style={{ padding: '8px', width: '150px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <option value={0.01}>0.01</option>
                    <option value={0.1}>0.1</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <button onClick={() => document.getElementById('fileInput')?.click()} style={{ padding: '8px 15px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>选择数据源</button>
                <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileSelect} />
                <button style={{ padding: '8px 15px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>修改参数</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <button style={{ padding: '8px 15px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={onStartSimulation}>开始模拟</button>
            </div>
            <button style={{ padding: '8px 15px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handlePress}>查看时刻变化</button>
            {/* 弹窗 */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '350px',
                        position: 'relative'
                    }}>
                        {/* 关闭按钮 */}
                        <button style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '20px',
                            color: '#555'
                        }} onClick={handleCloseModal}>
                            ×
                        </button>

                        {/* 时刻选择 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <label style={{ width: '100px', color: '#555', textAlign: 'right', marginRight: '10px' }}>选择时刻: </label>
                            <input
                                type="number"
                                value={moment}
                                onChange={handleMomentChange}
                                style={{ padding: '8px', width: '150px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            {/* <button style={{ padding: '8px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleDecrement}>
                                -1
                            </button>
                            <button style={{ padding: '8px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }} onClick={handleIncrement}>
                                +1
                            </button> */}
                        </div>

                        {/* 滑动条 */}
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={moment}
                                onChange={(e) => setMoment(parseFloat(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* 底部按钮 */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }} onClick={handleConfirm}>
                                确认
                            </button>
                            <button style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={handleDelete}>
                                删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideMenu;