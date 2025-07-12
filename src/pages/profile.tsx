import React from 'react';
import dynamic from 'next/dynamic';
const Profile = dynamic(() => import('@/components/Profile'));
import MainLayout from "@/components/Layout/MainLayout";

const ProfilePage: React.FC = () => {
    return (
        <MainLayout>
            <Profile />
        </MainLayout>
    );
};

export default ProfilePage;