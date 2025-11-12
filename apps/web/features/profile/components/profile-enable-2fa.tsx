"use client";

import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Copy,
  Check,
  AlertCircle,
  Loader,
  ShieldCheck,
  RefreshCw,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import {
  generate2FAAction,
  enable2FAAction,
  check2FAStatusAction,
  disable2FAAction,
  regenerateBackupCodesAction,
} from "../actions/two-factor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Step =
  | "loading"
  | "disabled"
  | "generate"
  | "verify"
  | "success"
  | "enabled"
  | "regenerate-success";

export const ProfileEnable2FA = () => {
  const [step, setStep] = useState<Step>("loading");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [disableCode, setDisableCode] = useState("");
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);
  const [regenerateCode, setRegenerateCode] = useState("");

  /**
   * Check 2FA status and initiate appropriate flow on mount
   */
  useEffect(() => {
    const initialize2FA = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getCookie("access_token");
        if (!token) {
          setError(
            "Token de autenticação não encontrado. Faça login novamente."
          );
          setIsLoading(false);
          return;
        }

        // Check current 2FA status
        const statusResult = await check2FAStatusAction(token as string);

        if (!statusResult.success) {
          setError(statusResult.message || "Erro ao verificar status 2FA");
          setIsLoading(false);
          return;
        }

        // If 2FA is enabled, show the enabled view
        if (statusResult.data?.twoFactorEnabled) {
          setStep("enabled");
          setIsLoading(false);
          return;
        }

        // If 2FA is disabled, generate the secret
        const generateResult = await generate2FAAction(token);

        if (generateResult.success && generateResult.data) {
          setQrCode(generateResult.data.qrCode);
          setSecret(generateResult.data.secret);
          setStep("disabled");
        } else {
          setError(generateResult.message || "Erro ao gerar código 2FA");
        }
      } catch (err) {
        console.error("Initialize 2FA error:", err);
        setError("Erro ao inicializar 2FA. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    initialize2FA();
  }, []);

  /**
   * Handle copy secret
   */
  const handleCopy = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Handle verify 2FA
   */
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Digite um código de 6 dígitos");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getCookie("access_token");
      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const result = await enable2FAAction(code, token as string);

      if (result.success && result.data) {
        setBackupCodes(result.data.backupCodes);
        setStep("success");
      } else {
        setError(result.message || "Código inválido");
      }
    } catch (err) {
      console.error("Enable 2FA error:", err);
      setError("Erro ao verificar código. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setStep("disabled");
    setCode("");
    setError(null);
  };

  /**
   * Handle disable 2FA
   */
  const handleDisable = async () => {
    if (disableCode.length < 6 || disableCode.length > 8) {
      setError("Digite um código de 6-8 caracteres");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getCookie("access_token");
      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const result = await disable2FAAction(disableCode, token as string);

      if (result.success) {
        setStep("disabled");
        setDisableCode("");
        // Reset to show the enable flow again
        const generateResult = await generate2FAAction(token);
        if (generateResult.success && generateResult.data) {
          setQrCode(generateResult.data.qrCode);
          setSecret(generateResult.data.secret);
        }
      } else {
        setError(result.message || "Código inválido");
      }
    } catch (err) {
      console.error("Disable 2FA error:", err);
      setError("Erro ao desativar 2FA. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle regenerate backup codes
   */
  const handleRegenerateBackupCodes = async () => {
    if (regenerateCode.length < 6 || regenerateCode.length > 8) {
      setError("Digite um código de 6-8 caracteres");
      return;
    }

    setRegenerateLoading(true);
    setError(null);

    try {
      const token = getCookie("access_token");
      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setRegenerateLoading(false);
        return;
      }

      const result = await regenerateBackupCodesAction(regenerateCode, token as string);

      if (result.success && result.data) {
        setBackupCodes(result.data.backupCodes);
        setShowRegenerateModal(false);
        setRegenerateCode("");
        setStep("regenerate-success");
      } else {
        setError(result.message || "Erro ao regenerar códigos de backup");
      }
    } catch (err) {
      console.error("Regenerate backup codes error:", err);
      setError("Erro ao regenerar códigos. Tente novamente.");
    } finally {
      setRegenerateLoading(false);
    }
  };

  // Loading state
  if (step === "loading") {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              Autenticação de dois fatores (2FA)
            </p>
            <p className="text-xs text-amber-800 mt-1">
              Melhore significativamente a segurança da sua conta habilitando a
              autenticação em dois fatores.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  // Regenerate backup codes success view
  if (step === "regenerate-success") {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex gap-3">
            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Códigos de backup regenerados com sucesso!
              </p>
              <p className="text-xs text-green-800 mt-1">
                Os códigos anteriores não funcionarão mais.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-600">
            Seus novos códigos de backup
          </Label>
          <p className="text-xs text-gray-600">
            Salve esses códigos em um local seguro. Use-os para acessar sua
            conta se perder acesso ao seu app de autenticação.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            {backupCodes.map((code, index) => (
              <div key={index} className="font-mono text-sm text-gray-700">
                {code}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            setStep("enabled");
            setError(null);
          }}
          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg"
        >
          Concluído
        </Button>
      </div>
    );
  }

  // 2FA already enabled view
  if (step === "enabled") {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">
              2FA já está ativo
            </p>
            <p className="text-xs text-green-800 mt-1">
              Sua conta está protegida por autenticação em dois fatores.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Erro</p>
              <p className="text-xs text-red-800 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-600">
            Desativar autenticação em dois fatores
          </Label>
          <p className="text-xs text-gray-600">
            Digite seu código TOTP (6 dígitos) ou código de backup (6-8
            caracteres) para desativar.
          </p>
          <Input
            type="text"
            placeholder="000000 ou código de backup"
            maxLength={8}
            value={disableCode}
            onChange={(e) => setDisableCode(e.target.value.replace(/\s/g, ""))}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-center font-mono disabled:opacity-50"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <Button
            onClick={handleDisable}
            disabled={disableCode.length < 6 || isLoading}
            variant="destructive"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Desativando..." : "Desativar 2FA"}
          </Button>
          <Button
            onClick={() => setShowRegenerateModal(true)}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerar Códigos
          </Button>
        </div>

        {/* Regenerate backup codes modal */}
        {showRegenerateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Regenerar códigos de backup?
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Os códigos de backup antigos não funcionarão mais. Digite seu código TOTP (6 dígitos) ou código de backup (6-8 caracteres) para confirmar.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRegenerateModal(false);
                    setRegenerateCode("");
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="000000 ou código de backup"
                  maxLength={8}
                  value={regenerateCode}
                  onChange={(e) => setRegenerateCode(e.target.value.replace(/\s/g, ""))}
                  disabled={regenerateLoading}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-center font-mono disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  onClick={() => {
                    setShowRegenerateModal(false);
                    setRegenerateCode("");
                    setError(null);
                  }}
                  variant="outline"
                  disabled={regenerateLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleRegenerateBackupCodes}
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={regenerateCode.length < 6 || regenerateLoading}
                >
                  {regenerateLoading ? "Regenerando..." : "Regenerar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Success state - show backup codes
  if (step === "success") {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex gap-3">
            <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                2FA ativado com sucesso!
              </p>
              <p className="text-xs text-green-800 mt-1">
                Sua conta está protegida por autenticação em dois fatores.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-600">
            Códigos de backup
          </Label>
          <p className="text-xs text-gray-600">
            Salve esses códigos em um local seguro. Use-os para acessar sua
            conta se perder acesso ao seu app de autenticação.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            {backupCodes.map((code, index) => (
              <div key={index} className="font-mono text-sm text-gray-700">
                {code}
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            setStep("enabled");
            setCode("");
            setError(null);
          }}
          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg"
        >
          Concluído
        </Button>
      </div>
    );
  }

  // Default: Enable flow (disabled state)
  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-900">
            Autenticação de dois fatores (2FA)
          </p>
          <p className="text-xs text-amber-800 mt-1">
            Melhore significativamente a segurança da sua conta habilitando a
            autenticação em dois fatores.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Erro</p>
            <p className="text-xs text-red-800 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-600">
          1. Escaneie o código QR
        </Label>
        <div className="w-full max-w-xs mx-auto bg-linear-to-br from-gray-50 to-gray-100 p-8 rounded-lg border border-gray-200 flex items-center justify-center">
          {qrCode ? (
            <img src={qrCode} alt="QR Code" className="w-full h-auto" />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-2">📱</div>
              <p className="text-sm">Carregando código QR...</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-600">
          2. Ou insira a chave manualmente
        </Label>
        <div className="flex gap-2">
          <Input
            type="text"
            readOnly
            value={secret || "Carregando..."}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-900"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!secret || isLoading}
            className="px-4"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-600">
          3. Digite o código gerado pelo seu app
        </Label>
        <Input
          type="text"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          disabled={isLoading}
          className="w-32 px-4 py-2 border border-gray-200 rounded-lg text-center text-2xl font-bold tracking-widest disabled:opacity-50"
        />
      </div>

      <div className="pt-2 flex gap-3">
        <Button
          onClick={handleVerify}
          disabled={code.length !== 6 || isLoading}
          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verificando..." : "Ativar 2FA"}
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          disabled={isLoading}
          className="rounded-lg"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
