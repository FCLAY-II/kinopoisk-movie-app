import React from 'react';
import Profile from '@/componets/Profile';
import MainLayout from "@/componets/Layout/MainLayout";

const ProfilePage: React.FC = () => {
    return (
        <MainLayout>
            <Profile />
        </MainLayout>
    );
};

export default ProfilePage;