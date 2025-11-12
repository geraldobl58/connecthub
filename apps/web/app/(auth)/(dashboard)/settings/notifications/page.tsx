"use client";

import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";

const NotificationPage = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Configurações de Notificações
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas preferências de notificações e alertas
          </p>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
