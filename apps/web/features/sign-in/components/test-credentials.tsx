"use client";

import { useState } from "react";
import {
  ChevronDown,
  Copy,
  Check,
  Shield,
  AlertCircle,
  Lock,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestCredential {
  id: string;
  name: string;
  tenantId: string;
  email: string;
  password: string;
  status: "active" | "inactive" | "pastDue" | "canceled";
  twoFactor: boolean;
  plan: string;
  description: string;
}

const TEST_CREDENTIALS: TestCredential[] = [
  {
    id: "1",
    name: "João Silva",
    tenantId: "tech-startup-co",
    email: "joao@techstartup.com",
    password: "SenhaForte123!@#",
    status: "active",
    twoFactor: false,
    plan: "PROFESSIONAL",
    description: "Usuário básico sem 2FA",
  },
  {
    id: "2",
    name: "Maria Santos",
    tenantId: "tech-startup-co",
    email: "maria@techstartup.com",
    password: "SenhaForte123!@#",
    status: "active",
    twoFactor: true,
    plan: "PROFESSIONAL",
    description: "Usuário com 2FA habilitado (teste fluxo 2FA)",
  },
  {
    id: "3",
    name: "Carlos Mendes",
    tenantId: "digital-agency",
    email: "carlos@digitalagency.com",
    password: "SenhaForte123!@#",
    status: "active",
    twoFactor: false,
    plan: "STARTER",
    description: "Usuário do plano Starter",
  },
  {
    id: "4",
    name: "Ana Costa",
    tenantId: "enterprise-corp",
    email: "ana@enterprisecorp.com",
    password: "SenhaForte123!@#",
    status: "active",
    twoFactor: true,
    plan: "ENTERPRISE",
    description: "Usuário Enterprise com 2FA",
  },
  {
    id: "5",
    name: "Roberto Gomes",
    tenantId: "enterprise-corp",
    email: "roberto@enterprisecorp.com",
    password: "SenhaForte123!@#",
    status: "inactive",
    twoFactor: false,
    plan: "ENTERPRISE",
    description: "Usuário inativo (deve falhar no login)",
  },
  {
    id: "6",
    name: "Pedro Oliveira",
    tenantId: "overdue-business",
    email: "pedro@overduebiz.com",
    password: "SenhaForte123!@#",
    status: "pastDue",
    twoFactor: false,
    plan: "STARTER",
    description: "Assinatura em atraso (teste fluxo de cobrança)",
  },
  {
    id: "7",
    name: "Lucas Ferreira",
    tenantId: "former-customer",
    email: "lucas@formercustomer.com",
    password: "SenhaForte123!@#",
    status: "canceled",
    twoFactor: false,
    plan: "PROFESSIONAL",
    description: "Assinatura cancelada",
  },
];

const getStatusBadge = (status: TestCredential["status"]) => {
  const statusMap = {
    active: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      label: "Ativo",
      icon: "✅",
    },
    inactive: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      label: "Inativo",
      icon: "⛔",
    },
    pastDue: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      label: "Data vencida",
      icon: "⚠️",
    },
    canceled: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      label: "Cancelado",
      icon: "❌",
    },
  };
  return statusMap[status];
};

export const TestCredentials = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 mb-4 bg-violet-500 border border-violet-400 rounded-lg hover:bg-violet-800 transition-colors flex items-center justify-between text-sm font-medium text-white"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Credenciais de Teste (Desenvolvimento)
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Credentials Panel */}
      {isOpen && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          {/* Warning */}
          <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-yellow-900">
                Apenas para desenvolvimento
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Use as credenciais abaixo para testar diferentes cenários de
                login, incluindo 2FA, planos e status de assinatura.
              </p>
            </div>
          </div>

          {/* Credentials List */}
          <div className="space-y-3">
            {TEST_CREDENTIALS.map((cred) => {
              const isExpanded = expandedCard === cred.id;
              const statusBadge = getStatusBadge(cred.status);

              return (
                <div
                  key={cred.id}
                  className={`border rounded-lg transition-all ${
                    isExpanded
                      ? "border-blue-300 bg-white"
                      : "border-blue-200 bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : cred.id)}
                    className="w-full px-3 py-2 flex items-center justify-between text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {cred.name}
                        </p>
                        <span
                          className={`${statusBadge.bg} ${statusBadge.border} ${statusBadge.text} px-2 py-0.5 rounded text-xs font-medium border`}
                        >
                          {statusBadge.icon} {statusBadge.label}
                        </span>
                        {cred.twoFactor && (
                          <span className="bg-purple-100 border border-purple-200 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                            🔐 2FA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {cred.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Card Body */}
                  {isExpanded && (
                    <div className="border-t border-blue-200 px-3 py-3 space-y-3 bg-white">
                      {/* Tenant ID */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                          <Building className="w-3 h-3" />
                          Tenant ID
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={cred.tenantId}
                            className="flex-1 px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700"
                          />
                          <button
                            onClick={() =>
                              handleCopy(cred.tenantId, `tenant-${cred.id}`)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copiedField === `tenant-${cred.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                          <User className="w-3 h-3" />
                          Email
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={cred.email}
                            className="flex-1 px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700"
                          />
                          <button
                            onClick={() =>
                              handleCopy(cred.email, `email-${cred.id}`)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copiedField === `email-${cred.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                          <Lock className="w-3 h-3" />
                          Senha
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={cred.password}
                            className="flex-1 px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700"
                          />
                          <button
                            onClick={() =>
                              handleCopy(cred.password, `password-${cred.id}`)
                            }
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            {copiedField === `password-${cred.id}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Plan Info */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-600">
                            Plano
                          </p>
                          <p className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                            {cred.plan}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-600">
                            2FA
                          </p>
                          <p className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
                            {cred.twoFactor
                              ? "✅ Habilitado"
                              : "❌ Desabilitado"}
                          </p>
                        </div>
                      </div>

                      {/* Quick Action Button */}
                      <Button
                        onClick={() => {
                          // Find inputs by name attribute (react-hook-form)
                          const tenantInput = document.querySelector(
                            'input[name="tenantId"]'
                          ) as HTMLInputElement;
                          const emailInput = document.querySelector(
                            'input[name="email"]'
                          ) as HTMLInputElement;
                          const passwordInput = document.querySelector(
                            'input[name="password"]'
                          ) as HTMLInputElement;

                          // Set values
                          if (tenantInput) {
                            tenantInput.value = cred.tenantId;
                            tenantInput.dispatchEvent(
                              new Event("change", { bubbles: true })
                            );
                            tenantInput.dispatchEvent(
                              new Event("input", { bubbles: true })
                            );
                          }
                          if (emailInput) {
                            emailInput.value = cred.email;
                            emailInput.dispatchEvent(
                              new Event("change", { bubbles: true })
                            );
                            emailInput.dispatchEvent(
                              new Event("input", { bubbles: true })
                            );
                          }
                          if (passwordInput) {
                            passwordInput.value = cred.password;
                            passwordInput.dispatchEvent(
                              new Event("change", { bubbles: true })
                            );
                            passwordInput.dispatchEvent(
                              new Event("input", { bubbles: true })
                            );
                          }

                          setIsOpen(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded"
                      >
                        Preencher Formulário
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg text-xs text-blue-900">
            <p className="font-medium mb-1">💡 Dicas de teste:</p>
            <ul className="space-y-1 text-blue-800">
              <li>
                • Clique em Preencher Formulário para auto-completar os dados
              </li>
              <li>• Teste o fluxo 2FA com Maria Santos ou Ana Costa</li>
              <li>• Tente login com Roberto Gomes (usuário inativo)</li>
              <li>• Verifique diferentes planos e status de assinatura</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
