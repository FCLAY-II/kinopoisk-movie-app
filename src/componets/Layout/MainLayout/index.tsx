import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import { Loading } from '@/componets/Loading';
import s from './MainLayout.module.scss';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true);
        };
        const handleComplete = () => {
            setIsLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    if (isLoading) {
        return (
            <Loading 
                text="Переход на страницу..." 
                subtext="Загружаем контент"
            />
        );
    }

    return (
        <div className={s.layout}>
            <Header />
            <main className={s.main}>
                <div className={s.container}>
                    <div className={s.content}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;