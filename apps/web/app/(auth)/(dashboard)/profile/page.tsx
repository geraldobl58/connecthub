"use client";

import { HeaderContainer } from "@/components/header-container";
import { ProfileHeader } from "@/components/profile-header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAvatar } from "@/features/profile/components/profile-avatar";
import { ProfileChangePassword } from "@/features/profile/components/profile-change-password";
import { ProfileEnable2FA } from "@/features/profile/components/profile-enable-2fa";
import { ProfileInformation } from "@/features/profile/components/profile-information";
import { Loading } from "@/components/loading";
import { AlertCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const ProfilePage = () => {
  const { profileData, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return (
      <Loading
        fullscreen
        color="blue"
        title="Carregando perfil..."
        message="Aguarde enquanto buscamos suas informações."
      />
    );
  }

  if (error) {
    return (
      <>
        <HeaderContainer
          title="Meu Perfil"
          subtitle="Visão geral da sua conta"
          content={
            <>
              <ProfileHeader />
            </>
          }
        />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="shrink-0 pt-1">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Erro ao carregar perfil
                </h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderContainer
        title="Meu Perfil"
        subtitle="Visão geral da sua conta"
        content={
          <>
            <ProfileHeader />
          </>
        }
      />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {profileData?.name}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    @{profileData?.username}
                  </p>
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100/50">
                  <span className="text-sm font-semibold text-blue-700">
                    {profileData?.planName}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 overflow-hidden">
              <Tabs defaultValue="information" className="w-full">
                <div className="border-b border-gray-200/50 bg-gray-50/50 px-6 sm:px-8">
                  <TabsList className="bg-transparent border-b-0 gap-1 h-auto p-0">
                    <TabsTrigger
                      value="information"
                      className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-transparent rounded-none border-b-2 border-transparent px-4 py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Informações
                    </TabsTrigger>
                    <TabsTrigger
                      value="avatar"
                      className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-transparent rounded-none border-b-2 border-transparent px-4 py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Avatar
                    </TabsTrigger>
                    <TabsTrigger
                      value="change-password"
                      className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-transparent rounded-none border-b-2 border-transparent px-4 py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Alterar Senha
                    </TabsTrigger>
                    <TabsTrigger
                      value="enable-2fa"
                      className="data-[state=active]:bg-linear-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-transparent rounded-none border-b-2 border-transparent px-4 py-4 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      2FA
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 sm:p-8">
                  <TabsContent value="information" className="mt-0">
                    <ProfileInformation
                      profileData={profileData || undefined}
                    />
                  </TabsContent>
                  <TabsContent value="avatar" className="mt-0">
                    <ProfileAvatar
                      onUploadSuccess={refetch}
                      profileData={profileData || undefined}
                    />
                  </TabsContent>
                  <TabsContent value="change-password" className="mt-0">
                    <ProfileChangePassword />
                  </TabsContent>
                  <TabsContent value="enable-2fa" className="mt-0">
                    <ProfileEnable2FA />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
