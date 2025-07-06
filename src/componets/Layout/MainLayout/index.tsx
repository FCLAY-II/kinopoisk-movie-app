import React from 'react';
import Header from '../Header';
import {MainLayoutProps} from './types';
import styles from './MainLayout.module.scss';

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};