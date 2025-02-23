import React from 'react';
import Background from 'three/src/renderers/common/Background.js';

interface ModalProps {
    isShow: boolean;
    x: number;
    y: number;
    z: number;
    offset?: number;
    width: number;
    height: number;
}

const Modal: React.FC<ModalProps> = ({ isShow, x, y, z, offset, width, height }) => {
    if (!isShow) {
        return null;
    }

    return (
        <div style={{ ...styles.modal, width: `${width}px`, height: `${height}px` }}>
            <div style={styles.row}>x: {x}</div>
            <div style={styles.row}>y: {y}</div>
            <div style={styles.row}>z: {z}</div>
            <div style={styles.row}>偏移量: {offset}</div>
        </div>
    );
};

const styles = {
    modal: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed' as 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#000000',
        borderWidth: '1px',
    },
    row: {
        margin: '5px 0',
    }
};

export default Modal;