"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { getCookie } from "cookies-next";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { changePasswordAction } from "../actions/change-password";

export const ProfileChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from cookie
      const token = getCookie("access_token");
      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const result = await changePasswordAction(
        currentPassword,
        newPassword,
        confirmPassword,
        token as string
      );

      if (result.success) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Show success message and logout after 2 seconds
        setTimeout(() => {
          // Redirect to sign-in (cookie will be cleared on logout action)
          window.location.href = "/auth/sign-in";
        }, 2000);
      } else {
        setError(result.message || "Erro ao alterar senha");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Erro ao alterar senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Password strength indicator
   */
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Fraca", color: "text-red-600" },
      { strength: 2, label: "Regular", color: "text-yellow-600" },
      { strength: 3, label: "Boa", color: "text-blue-600" },
      { strength: 4, label: "Forte", color: "text-green-600" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Erro</p>
            <p className="text-xs text-red-800 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">Sucesso</p>
            <p className="text-xs text-green-800 mt-1">
              Senha alterada com sucesso. Redirecionando...
            </p>
          </div>
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-2">
        <Label
          htmlFor="current-password"
          className="text-sm font-semibold text-gray-600"
        >
          Senha atual
        </Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Digite sua senha atual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
            className="rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {showCurrentPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label
          htmlFor="new-password"
          className="text-sm font-semibold text-gray-600"
        >
          Nova senha
        </Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            placeholder="Digite sua nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            className="rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {showNewPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Password Strength */}
        {newPassword && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gray-200 h-1 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  passwordStrength.strength === 1
                    ? "bg-red-600 w-1/4"
                    : passwordStrength.strength === 2
                      ? "bg-yellow-600 w-2/4"
                      : passwordStrength.strength === 3
                        ? "bg-blue-600 w-3/4"
                        : "bg-green-600 w-full"
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium ${passwordStrength.color}`}
            >
              {passwordStrength.label}
            </span>
          </div>
        )}

        {/* Password Requirements */}
        {newPassword && (
          <div className="text-xs text-gray-600 space-y-1 mt-3">
            <div
              className={
                newPassword.length >= 8
                  ? "text-green-600"
                  : "text-gray-400"
              }
            >
              ✓ Mínimo 8 caracteres
            </div>
            <div
              className={
                /[A-Z]/.test(newPassword)
                  ? "text-green-600"
                  : "text-gray-400"
              }
            >
              ✓ Uma letra maiúscula
            </div>
            <div
              className={
                /[0-9]/.test(newPassword)
                  ? "text-green-600"
                  : "text-gray-400"
              }
            >
              ✓ Um número
            </div>
            <div
              className={
                /[^A-Za-z0-9]/.test(newPassword)
                  ? "text-green-600"
                  : "text-gray-400"
              }
            >
              ✓ Um caractere especial
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirm-password"
          className="text-sm font-semibold text-gray-600"
        >
          Confirmar senha
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme sua nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className="rounded-lg pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Password Match Indicator */}
        {newPassword && confirmPassword && (
          <div
            className={`text-xs font-medium mt-2 ${
              newPassword === confirmPassword
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {newPassword === confirmPassword
              ? "✓ Senhas conferem"
              : "✗ Senhas não conferem"}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Alterando..." : "Salvar senha"}
        </Button>
      </div>

      {/* Security Info */}
      <p className="text-xs text-gray-600 mt-4">
        ℹ️ Após salvar, você será desconectado automaticamente por questões de
        segurança.
      </p>
    </form>
  );
};
