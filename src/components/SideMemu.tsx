import React, { useState } from 'react';

interface SideMenuProps {
    points: number;
    length: number;
    onLengthChange: (length: number) => void;
    magnification: number;
    onMagnificationChange: (magnification: number) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ points, length, onLengthChange, magnification, onMagnificationChange }) => {
    const [inputLength, setInputLength] = useState(length);
    const [selectedMagnification, setSelectedMagnification] = useState(magnification);

    const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLength = parseFloat(e.target.value);
        setInputLength(newLength);
        onLengthChange(newLength);
    };

    const handleMagnificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMagnification = parseFloat(e.target.value);
        setSelectedMagnification(newMagnification);
        onMagnificationChange(newMagnification);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Selected file:', file.name);
            // 处理文件
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>参数配置</h2>
            <div style={styles.row}>
                <label style={styles.label}>点数: </label>
                <input type="text" value={points} readOnly style={styles.input} />
            </div>
            <div style={styles.row}>
                <label style={styles.label}>长度: </label>
                <input type="number" value={inputLength} onChange={handleLengthChange} style={styles.input} />
            </div>
            <div style={styles.row}>
                <label style={styles.label}>放大倍率: </label>
                <select value={selectedMagnification} onChange={handleMagnificationChange} style={styles.select}>
                    <option value={0.1}>0.1</option>
                    <option value={1}>1</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <div style={styles.row}>
                <button onClick={() => document.getElementById('fileInput')?.click()} style={styles.button}>选择数据源</button>
                <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleFileSelect} />
                <button style={{ ...styles.button, marginLeft: '10px' }}>确认参数</button>
            </div>
            <div style={styles.row}>
                <button style={styles.button}>开始模拟</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        color: 'black',
        padding: '20px',
        boxSizing: 'border-box' as 'border-box',
    },
    title: {
        textAlign: 'center' as 'center',
        marginBottom: '40px',
        fontSize: '36px',
        fontWeight: 'bold' as 'bold',
    },
    row: {
        marginBottom: '20px',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    label: {
        marginRight: '10px',
        flex: '1',
    },
    input: {
        fontSize: '18px',
        padding: '5px',
        flex: '2',
    },
    select: {
        fontSize: '18px',
        padding: '5px',
        flex: '2',
    },
    button: {
        fontSize: '18px',
        padding: '10px 20px',
        cursor: 'pointer' as 'pointer',
        flex: '1',
    },
};

export default SideMenu;