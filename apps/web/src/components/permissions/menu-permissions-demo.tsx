"use client";

import { useAuth } from "@/hooks/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { Role } from "@/types/permissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Componente de demonstração para mostrar as permissões do menu
 * baseado na role do usuário atual
 */
export function MenuPermissionsDemo() {
  const { user } = useAuth();
  const {
    canCreateUsers,
    canManageUsers,
    canViewUsers,
    canManageProperties,
    canViewProperties,
    canManageLeads,
    canViewLeads,
    canManageDeals,
    canViewDeals,
    canViewReports,
    canManageSettings,
    canViewSettings,
    canManageSubscriptions,
    canViewSubscriptions,
  } = usePermissions();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissões do Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Usuário não autenticado</p>
        </CardContent>
      </Card>
    );
  }

  const menuItems = [
    {
      title: "Dashboard",
      description: "Página inicial do sistema",
      accessible: true, // Sempre acessível
      reason: "Acessível para todos os usuários autenticados",
    },
    {
      title: "Gestão de Leads",
      description: "Gerenciar leads do sistema",
      accessible: canViewLeads(),
      reason: canViewLeads()
        ? "Você tem permissão para visualizar leads"
        : "Você não tem permissão para visualizar leads",
      subitems: [
        {
          title: "Cadastro de Leads",
          accessible: canManageLeads(),
          reason: canManageLeads()
            ? "Você pode criar novos leads"
            : "Apenas MANAGER e ADMIN podem criar leads",
        },
        {
          title: "Visualizar Leads",
          accessible: canViewLeads(),
          reason: canViewLeads()
            ? "Você pode visualizar leads"
            : "Você não tem permissão para visualizar leads",
        },
      ],
    },
    {
      title: "Imóveis",
      description: "Gerenciar propriedades",
      accessible: canViewProperties(),
      reason: canViewProperties()
        ? "Você tem permissão para visualizar propriedades"
        : "Você não tem permissão para visualizar propriedades",
      subitems: [
        {
          title: "Novo Imóvel",
          accessible: canManageProperties(),
          reason: canManageProperties()
            ? "Você pode criar novos imóveis"
            : "Apenas MANAGER e ADMIN podem criar imóveis",
        },
        {
          title: "Visualizar Imóveis",
          accessible: canViewProperties(),
          reason: canViewProperties()
            ? "Você pode visualizar imóveis"
            : "Você não tem permissão para visualizar imóveis",
        },
      ],
    },
    {
      title: "Propostas e Vendas",
      description: "Gerenciar negócios e vendas",
      accessible: canViewDeals(),
      reason: canViewDeals()
        ? "Você tem permissão para visualizar deals"
        : "Você não tem permissão para visualizar deals",
      subitems: [
        {
          title: "Nova Proposta",
          accessible: canManageDeals(),
          reason: canManageDeals()
            ? "Você pode criar novas propostas"
            : "Apenas AGENT, MANAGER e ADMIN podem criar propostas",
        },
        {
          title: "Visualizar Vendas",
          accessible: canViewDeals(),
          reason: canViewDeals()
            ? "Você pode visualizar vendas"
            : "Você não tem permissão para visualizar vendas",
        },
      ],
    },
    {
      title: "Relatórios",
      description: "Visualizar relatórios do sistema",
      accessible: canViewReports(),
      reason: canViewReports()
        ? "Você tem permissão para visualizar relatórios"
        : "Você não tem permissão para visualizar relatórios",
    },
    {
      title: "Configurações",
      description: "Configurações do sistema",
      accessible: canViewSettings(),
      reason: canViewSettings()
        ? "Você tem permissão para visualizar configurações"
        : "Você não tem permissão para visualizar configurações",
      subitems: [
        {
          title: "Usuários",
          accessible: canViewUsers(),
          reason: canViewUsers()
            ? "Você pode visualizar usuários"
            : "Apenas MANAGER e ADMIN podem visualizar usuários",
        },
        {
          title: "Criar Usuário",
          accessible: canCreateUsers(),
          reason: canCreateUsers()
            ? "Você pode criar novos usuários"
            : "Apenas ADMIN pode criar novos usuários",
        },
        {
          title: "Planos",
          accessible: canViewSubscriptions(),
          reason: canViewSubscriptions()
            ? "Você pode visualizar planos"
            : "Apenas ADMIN pode visualizar planos",
        },
      ],
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800";
      case Role.MANAGER:
        return "bg-blue-100 text-blue-800";
      case Role.AGENT:
        return "bg-green-100 text-green-800";
      case Role.VIEWER:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Nome:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>
              <Badge className={`ml-2 ${getRoleColor(user.role)}`}>
                {user.role}
              </Badge>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissões do Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.title} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <Badge
                    variant={item.accessible ? "default" : "secondary"}
                    className={
                      item.accessible
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {item.accessible ? "Acessível" : "Bloqueado"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <p className="text-xs text-gray-500">{item.reason}</p>

                {item.subitems && (
                  <div className="mt-3 space-y-2">
                    <h4 className="text-sm font-medium">Subitens:</h4>
                    {item.subitems.map((subitem, index) => (
                      <div key={index} className="ml-4 p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{subitem.title}</span>
                          <Badge
                            variant={
                              subitem.accessible ? "default" : "secondary"
                            }
                            className={
                              subitem.accessible
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {subitem.accessible ? "Acessível" : "Bloqueado"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {subitem.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo das Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Usuários</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Criar:</span>
                  <Badge variant={canCreateUsers() ? "default" : "secondary"}>
                    {canCreateUsers() ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Gerenciar:</span>
                  <Badge variant={canManageUsers() ? "default" : "secondary"}>
                    {canManageUsers() ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Visualizar:</span>
                  <Badge variant={canViewUsers() ? "default" : "secondary"}>
                    {canViewUsers() ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Propriedades</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Gerenciar:</span>
                  <Badge
                    variant={canManageProperties() ? "default" : "secondary"}
                  >
                    {canManageProperties() ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Visualizar:</span>
                  <Badge
                    variant={canViewProperties() ? "default" : "secondary"}
                  >
                    {canViewProperties() ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Leads</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Gerenciar:</span>
                  <Badge variant={canManageLeads() ? "default" : "secondary"}>
                    {canManageLeads() ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Visualizar:</span>
                  <Badge variant={canViewLeads() ? "default" : "secondary"}>
                    {canViewLeads() ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Deals</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Gerenciar:</span>
                  <Badge variant={canManageDeals() ? "default" : "secondary"}>
                    {canManageDeals() ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Visualizar:</span>
                  <Badge variant={canViewDeals() ? "default" : "secondary"}>
                    {canViewDeals() ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Relatórios</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Visualizar:</span>
                  <Badge variant={canViewReports() ? "default" : "secondary"}>
                    {canViewReports() ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Configurações</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span>Gerenciar:</span>
                  <Badge
                    variant={canManageSettings() ? "default" : "secondary"}
                  >
                    {canManageSettings() ? "Sim" : "Não"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Visualizar:</span>
                  <Badge variant={canViewSettings() ? "default" : "secondary"}>
                    {canViewSettings() ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
