"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/logout/hooks/useLogout";
import {
  LogOut,
  Wallet,
  Bell,
  ChevronsUpDown,
  Users,
  Stars,
  Lamp,
  Droplet,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import Image from "next/image";

/**
 * Avatar display component that shows image if available, otherwise shows initials
 */
const AvatarDisplay = ({
  avatar,
  initials,
  size = "sm",
}: {
  avatar?: string | null;
  initials: string;
  size?: "sm" | "md";
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
  };

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt="User avatar"
        width={96}
        height={96}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-blue-300`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}
    >
      {initials}
    </div>
  );
};

export const Profile = () => {
  const router = useRouter();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { profileData, isLoading } = useProfile();

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // Mostrar skeleton enquanto carrega
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg p-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden sm:flex flex-col gap-1">
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  // Gerar avatar com iniciais
  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer bg-transparent border-none">
        {/* Avatar */}
        <AvatarDisplay
          avatar={profileData.avatar}
          initials={initials}
          size="sm"
        />
        {/* Informações do usuário */}
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-900">
            {profileData.name}
          </span>
          <span className="text-xs text-gray-500">{profileData.email}</span>
        </div>
        <div>
          <ChevronsUpDown className="size-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* Header com usuário */}
        <div className="px-2 py-1.5 mb-1">
          <div className="flex items-center gap-3">
            <AvatarDisplay
              avatar={profileData.avatar}
              initials={initials}
              size="sm"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {profileData.name}
              </span>
              <span className="text-xs text-gray-500">{profileData.email}</span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Account */}
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full flex items-start justify-stretch"
          >
            <Link href="/settings/profile">
              <Users className="w-4 h-4 mr-2 text-gray-600 inline" />
              Meu Perfil
            </Link>
          </Button>
        </DropdownMenuItem>

        {/* Billing */}
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full flex items-start justify-stretch"
          >
            <Link href="/settings/my-plan">
              <Wallet className="w-4 h-4 mr-2 text-gray-600 inline" />
              Meu Plano
            </Link>
          </Button>
        </DropdownMenuItem>

        {/* Notifications */}
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full flex items-start justify-stretch"
          >
            <Link href="/settings/notifications">
              <Bell className="w-4 h-4 mr-2 text-gray-600 inline" />
              Notificações
              {/* Mudar para pegar quando o usuário não tiver um plano */}
              {!profileData.expiresAt ? (
                ""
              ) : (
                <Droplet className="w-4 h-4 -mt-2 mr-2 text-red-500 inline" />
              )}
            </Link>
          </Button>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Log out */}
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-start justify-stretch text-left text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2 inline" />
            Sair do Sistema
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
