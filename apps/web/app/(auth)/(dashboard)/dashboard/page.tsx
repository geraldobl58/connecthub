"use client";

import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";

const DashboardPage = () => {
  return (
    <>
      <HeaderContainer
        title="Dashboard"
        subtitle="Overview of your account"
        content={
          <>
            <ProfileHeader />
          </>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao seu painel de controle!
          </p>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
