"use client";

import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";

const UsersPage = () => {
  return (
    <>
      <HeaderContainer
        title="Usuários"
        subtitle="Gerencie os usuários da sua conta"
        content={
          <>
            <ProfileHeader />
          </>
        }
      />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">Usuários</div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
