import {
  Binoculars,
  Calendar,
  CarFront,
  ChartPie,
  CirclePlus,
  Headset,
  Home,
  Layers,
  MessageSquare,
  Settings,
  StickyNote,
  Tag,
  TrendingUp,
  Users,
  WalletMinimal,
  Workflow,
} from "lucide-react";

import { NavItem, PERMISSIONS } from "@/types/permissions";

// Menu baseado no schema do Prisma
export const mainItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    // Dashboard é acessível para todos os usuários autenticados
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Headset,
    permission: PERMISSIONS.LEADS_READ,
    subitems: [
      {
        title: "Listar Leads",
        url: "/leads",
        icon: Binoculars,
        permission: PERMISSIONS.LEADS_READ,
      },
      {
        title: "Novo Lead",
        url: "/leads/new",
        icon: CirclePlus,
        permission: PERMISSIONS.LEADS_CREATE,
      },
      {
        title: "Pipeline",
        url: "/leads/pipeline",
        icon: Workflow,
        permission: PERMISSIONS.LEADS_READ,
      },
      {
        title: "Tags",
        url: "/leads/tags",
        icon: Tag,
        permission: PERMISSIONS.LEADS_READ,
      },
    ],
  },
  {
    title: "Imóveis",
    url: "/properties",
    icon: CarFront,
    permission: PERMISSIONS.PROPERTIES_READ,
    subitems: [
      {
        title: "Listar Imóveis",
        url: "/properties",
        icon: Binoculars,
        permission: PERMISSIONS.PROPERTIES_READ,
      },
      {
        title: "Novo Imóvel",
        url: "/properties/new",
        icon: CirclePlus,
        permission: PERMISSIONS.PROPERTIES_CREATE,
      },
      {
        title: "Proprietários",
        url: "/properties/owners",
        icon: Users,
        permission: PERMISSIONS.PROPERTIES_READ,
      },
    ],
  },
  {
    title: "Negócios",
    url: "/deals",
    icon: WalletMinimal,
    permission: PERMISSIONS.DEALS_READ,
    subitems: [
      {
        title: "Listar Negócios",
        url: "/deals",
        icon: Binoculars,
        permission: PERMISSIONS.DEALS_READ,
      },
      {
        title: "Novo Negócio",
        url: "/deals/new",
        icon: CirclePlus,
        permission: PERMISSIONS.DEALS_CREATE,
      },
    ],
  },
  {
    title: "Tarefas",
    url: "/tasks",
    icon: Calendar,
    permission: PERMISSIONS.TASKS_READ,
    subitems: [
      {
        title: "Listar Tarefas",
        url: "/tasks",
        icon: Binoculars,
        permission: PERMISSIONS.TASKS_READ,
      },
      {
        title: "Nova Tarefa",
        url: "/tasks/new",
        icon: CirclePlus,
        permission: PERMISSIONS.TASKS_CREATE,
      },
    ],
  },
  {
    title: "WhatsApp",
    url: "/whatsapp",
    icon: MessageSquare,
    permission: PERMISSIONS.LEADS_READ, // Usando permissão de leads para mensagens
    subitems: [
      {
        title: "Mensagens",
        url: "/whatsapp/messages",
        icon: MessageSquare,
        permission: PERMISSIONS.LEADS_READ,
      },
      {
        title: "Configurações",
        url: "/whatsapp/settings",
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_UPDATE,
      },
    ],
  },
  {
    title: "Notas",
    url: "/notes",
    icon: StickyNote,
    permission: PERMISSIONS.LEADS_READ, // Notas podem estar relacionadas a leads, properties, etc.
    subitems: [
      {
        title: "Todas as Notas",
        url: "/notes",
        icon: StickyNote,
        permission: PERMISSIONS.LEADS_READ,
      },
    ],
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: ChartPie,
    permission: PERMISSIONS.REPORTS_READ,
    subitems: [
      {
        title: "Vendas",
        url: "/reports/sales",
        icon: TrendingUp,
        permission: PERMISSIONS.REPORTS_READ,
      },
      {
        title: "Leads",
        url: "/reports/leads",
        icon: Headset,
        permission: PERMISSIONS.REPORTS_READ,
      },
      {
        title: "Imóveis",
        url: "/reports/properties",
        icon: CarFront,
        permission: PERMISSIONS.REPORTS_READ,
      },
      {
        title: "Atividades",
        url: "/reports/activities",
        icon: Layers,
        permission: PERMISSIONS.REPORTS_READ,
      },
    ],
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_READ,
    subitems: [
      {
        title: "Usuários",
        url: "/settings/users",
        icon: Users,
        permission: PERMISSIONS.USERS_READ,
      },
      {
        title: "Planos",
        url: "/settings/plans",
        icon: WalletMinimal,
        permission: PERMISSIONS.SUBSCRIPTIONS_READ,
      },
      {
        title: "Empresa",
        url: "/settings/tenant",
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_UPDATE,
      },
    ],
  },
];
