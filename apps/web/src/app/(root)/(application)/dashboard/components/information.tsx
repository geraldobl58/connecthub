"use client";

import { useAuth } from "@/hooks/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  User,
  Shield,
  Clock,
  Calendar,
  LogOut,
  Users,
  BarChart3,
  Settings,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PlanCounter } from "@/components/plan-counter";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export const Information = () => {
  const { user, isLoading, isAuthenticated, logout, hasPermission } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} text="Carregando..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={32} text="Carregando dashboard..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Acesso Negado</h2>
          <p className="text-gray-500 mt-2">
            Faça login para acessar o dashboard
          </p>
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "AGENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "VIEWER":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Acesso completo ao sistema";
      case "MANAGER":
        return "Gerenciamento de equipes e vendas";
      case "AGENT":
        return "Vendas e atendimento a clientes";
      case "VIEWER":
        return "Apenas visualização de dados";
      default:
        return "Usuário padrão";
    }
  };

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

  const getRoleFeatures = (role: string) => {
    const baseFeatures = [
      { name: "Visualizar dados pessoais", icon: User, available: true },
      { name: "Ver informações do tenant", icon: Building2, available: true },
    ];

    switch (role) {
      case "ADMIN":
        return [
          ...baseFeatures,
          { name: "Gerenciar usuários", icon: Users, available: true },
          { name: "Configurar sistema", icon: Settings, available: true },
          { name: "Relatórios completos", icon: BarChart3, available: true },
          { name: "Auditoria e logs", icon: Shield, available: true },
          { name: "Análise financeira", icon: TrendingUp, available: true },
        ];

      case "MANAGER":
        return [
          ...baseFeatures,
          { name: "Gerenciar equipes", icon: Users, available: true },
          { name: "Relatórios gerenciais", icon: BarChart3, available: true },
          { name: "Análise de performance", icon: TrendingUp, available: true },
          {
            name: "Configurações avançadas",
            icon: Settings,
            available: false,
            reason: "Apenas ADMIN",
          },
          {
            name: "Auditoria completa",
            icon: Shield,
            available: false,
            reason: "Apenas ADMIN",
          },
        ];

      case "AGENT":
        return [
          ...baseFeatures,
          { name: "Gerenciar leads", icon: Users, available: true },
          { name: "Relatórios básicos", icon: BarChart3, available: true },
          { name: "Configurar perfil", icon: Settings, available: true },
          {
            name: "Relatórios avançados",
            icon: TrendingUp,
            available: false,
            reason: "MANAGER ou ADMIN",
          },
          {
            name: "Gerenciar equipes",
            icon: Users,
            available: false,
            reason: "MANAGER ou ADMIN",
          },
        ];

      case "VIEWER":
        return [
          ...baseFeatures,
          { name: "Visualizar dados", icon: Eye, available: true },
          { name: "Relatórios básicos", icon: BarChart3, available: true },
          {
            name: "Gerenciar leads",
            icon: Users,
            available: false,
            reason: "AGENT ou superior",
          },
          {
            name: "Configurações",
            icon: Settings,
            available: false,
            reason: "AGENT ou superior",
          },
          {
            name: "Relatórios avançados",
            icon: TrendingUp,
            available: false,
            reason: "MANAGER ou ADMIN",
          },
        ];

      default:
        return baseFeatures;
    }
  };

  const getAccessibleSections = () => {
    const sections = [];

    sections.push({
      title: "📊 Área Pessoal",
      description: "Seus dados e informações básicas",
      accessible: true,
    });

    if (hasPermission("AGENT")) {
      sections.push({
        title: "🎯 Área Operacional",
        description: "Gestão de leads e atividades diárias",
        accessible: true,
      });
    } else {
      sections.push({
        title: "🎯 Área Operacional",
        description: "Gestão de leads e atividades diárias",
        accessible: false,
        reason: "Requer permissão AGENT ou superior",
      });
    }

    if (hasPermission("MANAGER")) {
      sections.push({
        title: "👥 Área Gerencial",
        description: "Gestão de equipes e relatórios avançados",
        accessible: true,
      });
    } else {
      sections.push({
        title: "👥 Área Gerencial",
        description: "Gestão de equipes e relatórios avançados",
        accessible: false,
        reason: "Requer permissão MANAGER ou superior",
      });
    }

    if (hasPermission("ADMIN")) {
      sections.push({
        title: "⚙️ Área Administrativa",
        description: "Configurações do sistema e controle total",
        accessible: true,
      });
    } else {
      sections.push({
        title: "⚙️ Área Administrativa",
        description: "Configurações do sistema e controle total",
        accessible: false,
        reason: "Requer permissão ADMIN",
      });
    }

    return sections;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bem-vindo ao painel de controle, {user.name}!
          </p>
        </div>
        <div className="flex items-center gap-3 justify-end">
          <Badge
            variant="outline"
            className={`px-3 py-1 ${getRoleColor(user.role)}`}
          >
            {user.role}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 min-w-fit"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dados Pessoais
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Nome:</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email:</p>
                <p className="font-medium text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ID do Usuário:</p>
                <p className="font-mono text-xs text-gray-600">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tenant/Empresa
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Nome:</p>
                <p className="font-medium">{user.tenant?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Slug:</p>
                <p className="font-mono text-sm">
                  {user.tenant?.slug || user.tenantId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ID do Tenant:</p>
                <p className="font-mono text-xs text-gray-600">
                  {user.tenantId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissões e Status */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissões</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Função:</p>
                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Descrição:</p>
                <p className="text-sm">{getRoleDescription(user.role)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status:</p>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {user.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlanCounter />
        </div>
        <div className="lg:col-span-2">
          {/* Placeholder para outros widgets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Resumo de Atividades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-gray-600">Leads Este Mês</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">32</div>
                  <div className="text-sm text-gray-600">Conversões</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">25%</div>
                  <div className="text-sm text-gray-600">Taxa Conversão</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhes da Conta</CardTitle>
          <CardDescription>
            Informações detalhadas sobre sua conta e acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Criado em:</p>
                  <p className="font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Última atualização:</p>
                  <p className="font-medium">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Isolamento Multi-Tenant:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    ✅ Seus dados estão isolados por tenant
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Apenas usuários do mesmo tenant ({user.tenantId}) podem ver
                    informações relacionadas
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Segurança:</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700">
                    🔒 Autenticação JWT ativa
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Seu acesso está protegido e criptografado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            🎯 Funcionalidades por Permissão
          </CardTitle>
          <CardDescription>
            O que você pode fazer com sua role <strong>{user.role}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRoleFeatures(user.role).map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  feature.available
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <feature.icon
                  className={`h-5 w-5 ${
                    feature.available ? "text-green-600" : "text-red-400"
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      feature.available ? "text-green-800" : "text-red-700"
                    }`}
                  >
                    {feature.name}
                  </p>
                  {!feature.available &&
                    "reason" in feature &&
                    feature.reason && (
                      <p className="text-xs text-red-500 mt-1">
                        {feature.reason}
                      </p>
                    )}
                </div>
                <div className="flex-shrink-0">
                  {feature.available ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ✅ Permitido
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-red-200 text-red-600"
                    >
                      ❌ Negado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessible Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏢 Áreas do Sistema</CardTitle>
          <CardDescription>
            Seções que você pode acessar baseado na sua permissão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getAccessibleSections().map((section, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  section.accessible
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      section.accessible ? "text-blue-900" : "text-gray-600"
                    }`}
                  >
                    {section.title}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      section.accessible ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {section.description}
                  </p>
                  {!section.accessible &&
                    "reason" in section &&
                    section.reason && (
                      <p className="text-xs text-gray-400 mt-2">
                        🔒 {section.reason}
                      </p>
                    )}
                </div>
                <div className="flex-shrink-0 ml-4">
                  {section.accessible ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      🔓 Acesso
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-500"
                    >
                      🔒 Bloqueado
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Hierarchy */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-lg text-purple-800">
            🏆 Hierarquia de Permissões
          </CardTitle>
          <CardDescription className="text-purple-600">
            Como funciona o sistema de roles no {user.tenant?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-100 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">ADMIN</p>
                  <p className="text-sm text-red-600">
                    Acesso completo ao sistema
                  </p>
                </div>
              </div>
              <Badge className="bg-red-200 text-red-800">Nível 4</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-100 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">MANAGER</p>
                  <p className="text-sm text-blue-600">
                    Gerenciamento de equipes e vendas
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-200 text-blue-800">Nível 3</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-100 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">AGENT</p>
                  <p className="text-sm text-green-600">
                    Vendas e atendimento a clientes
                  </p>
                </div>
              </div>
              <Badge className="bg-green-200 text-green-800">Nível 2</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-800">VIEWER</p>
                  <p className="text-sm text-gray-600">
                    Apenas visualização de dados
                  </p>
                </div>
              </div>
              <Badge className="bg-gray-200 text-gray-800">Nível 1</Badge>
            </div>

            <div className="mt-4 p-3 bg-purple-100 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>Seu nível atual:</strong> {user.role} (Nível{" "}
                {user.role === "ADMIN"
                  ? "4"
                  : user.role === "MANAGER"
                    ? "3"
                    : user.role === "AGENT"
                      ? "2"
                      : "1"}
                )
              </p>
              <p className="text-xs text-purple-600 mt-1">
                Você tem acesso a todas as funcionalidades do seu nível e
                inferiores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Isolation Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-800">
            🛡️ Isolamento de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
              <strong>Multi-tenancy ativo:</strong> Todos os seus dados estão
              completamente isolados do tenant{" "}
              <code className="bg-yellow-100 px-1 rounded">
                {user.tenantId}
              </code>
              .
            </p>
            <p>
              <strong>Privacidade garantida:</strong> Você não pode ver dados de
              outros tenants, e outros tenants não podem ver seus dados.
            </p>
            <p>
              <strong>Seu nível de acesso:</strong> Como{" "}
              <code className="bg-yellow-100 px-1 rounded">{user.role}</code>,
              você tem {getRoleDescription(user.role).toLowerCase()}.
            </p>
          </div>
        </CardContent>
      </Card>

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
};
