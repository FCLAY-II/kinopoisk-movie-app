import React from 'react';
import Profile from '@/components/Profile';
import MainLayout from "@/components/Layout/MainLayout";

const ProfilePage: React.FC = () => {
    return (
        <MainLayout>
            <Profile />
        </MainLayout>
    );
};

export default ProfilePage;