interface ProfileInformationProps {
  profileData?: {
    id: string;
    name: string;
    username: string;
    email: string;
    tenantId: string;
    planName: string;
    expiresAt: string;
    avatar?: string | null;
    twoFactorEnabled: boolean;
  };
}

export const ProfileInformation = ({
  profileData,
}: ProfileInformationProps) => {
  // Format date to DD/MM/YYYY format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Nome</label>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-base font-medium text-gray-900">{profileData?.name || "—"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Usuário</label>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-base font-medium text-gray-900">@{profileData?.username || "—"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Email</label>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-base font-medium text-gray-900">{profileData?.email || "—"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Tenant ID</label>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="font-mono text-xs text-gray-900">{profileData?.tenantId || "—"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Plano</label>
        <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200/50">
          <div className="inline-flex items-center px-3 py-1.5 bg-white rounded-lg border border-blue-100">
            <span className="text-sm font-semibold text-blue-700">{profileData?.planName || "—"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600">Expira em</label>
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-base font-medium text-gray-900">
            {profileData?.expiresAt ? formatDate(profileData.expiresAt) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};
