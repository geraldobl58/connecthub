"use client";

import { useState } from "react";
import { ChevronDown, LogOut, Star, Check, Bell, Receipt } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import { LoadingSpinner } from "./common/loading-spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebarUser() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      logout();
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
    }, 500);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!user) return null;

  return (
    <div className="mt-auto p-4">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 p-2 h-auto hover:bg-transparent"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                alt={user.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56"
          side="top"
          sideOffset={8}
        >
          <div className="flex items-center gap-3 p-2 border-b">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                alt={user.name}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
          </div>
          <DropdownMenuItem>
            <Star className="mr-2 h-4 w-4" />
            <span>Atualizar para Pro</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Check className="mr-2 h-4 w-4" />
            <span>Conta</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Receipt className="mr-2 h-4 w-4" />
            <span>Faturamento</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notificações</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de Confirmação de Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Confirmar Logout
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tem certeza que deseja sair da sua conta?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelLogout}
                className="text-gray-600"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <LoadingSpinner size={12} text="Saindo..." />
                ) : (
                  "Sair"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
