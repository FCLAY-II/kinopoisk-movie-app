import React from 'react';
import styles from './Loading.module.scss';

export const Loading: React.FC = () => (
    <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
    </div>
);
