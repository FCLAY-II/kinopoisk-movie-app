import React from 'react';
import Header from "@/componets/Layout/Header";
import { MainLayoutProps } from "@/componets/Layout/MainLayout/types";


export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}