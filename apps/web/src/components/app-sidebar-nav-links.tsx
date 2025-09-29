import {
  Binoculars,
  BookOpen,
  Briefcase,
  Calendar,
  Calendar1Icon,
  Car,
  CarFront,
  ChartPie,
  CirclePlus,
  DollarSign,
  Dumbbell,
  Gavel,
  HandHelping,
  Headset,
  Home,
  Hourglass,
  ImagePlus,
  Layers,
  Megaphone,
  Percent,
  SearchCheck,
  Settings,
  TrendingUp,
  WalletMinimal,
} from "lucide-react";

export interface SubItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: React.ReactNode;
  subitems?: SubItem[];
}

// Seção Plataforma
export const platformItems: NavItem[] = [
  {
    title: "Parque infantil",
    url: "/playground",
    icon: Home,
  },
  {
    title: "Modelos",
    url: "/models",
    icon: Briefcase,
  },
  {
    title: "Documentação",
    url: "/docs",
    icon: BookOpen,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
];

// Seção Projetos
export const projectItems: NavItem[] = [
  {
    title: "# Engenharia de Design",
    url: "/projects/design-engineering",
    icon: Home,
  },
  {
    title: "Vendas e Marketing",
    url: "/projects/sales-marketing",
    icon: TrendingUp,
    subitems: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Veículos",
        url: "/vehicles",
        icon: Car,
      },
      {
        title: "Gestão de Leads",
        url: "/leads",
        icon: Headset,
      },
      {
        title: "Agenda de Test Drives",
        url: "/test-drives",
        icon: CarFront,
      },
      {
        title: "Propostas e Vendas",
        url: "/sales",
        icon: WalletMinimal,
      },
      {
        title: "Relatórios",
        url: "/reports",
        icon: ChartPie,
      },
    ],
  },
];

// Manter os itens originais para compatibilidade
export const mainItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Gestão de Leads",
    url: "/leads",
    icon: Headset,
    subitems: [
      {
        title: "Cadastro",
        url: "/leads/new",
        icon: CirclePlus,
      },
      {
        title: "Visualizar",
        url: "/leads/list",
        icon: Binoculars,
      },
      {
        title: "Buscar Leads",
        url: "/leads/search",
        icon: SearchCheck,
      },
    ],
  },
  {
    title: "Imóveis",
    url: "/properties",
    icon: CarFront,
    subitems: [
      {
        title: "Buscar Imóveis",
        url: "/properties/list",
        icon: Megaphone,
      },
      {
        title: "Novo",
        url: "/properties/new",
        icon: Calendar,
      },
      {
        title: "Visualizar",
        url: "/properties/list",
        icon: Calendar1Icon,
      },
    ],
  },
  {
    title: "Propostas e Vendas",
    url: "/sales",
    icon: WalletMinimal,
    subitems: [
      {
        title: "Registros",
        url: "/sales/records",
        icon: HandHelping,
      },
      {
        title: "Propostas",
        url: "/sales/proposals",
        icon: TrendingUp,
      },
      {
        title: "Vendas",
        url: "/sales/sales",
        icon: Gavel,
      },
    ],
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: ChartPie,
    subitems: [
      {
        title: "Vendedores",
        url: "/reports/sellers",
        icon: Percent,
      },
      {
        title: "Tempo médio",
        url: "/reports/average-time",
        icon: Hourglass,
      },
      {
        title: "Estoque por status",
        url: "/reports/stock-status",
        icon: Layers,
      },
    ],
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: ChartPie,
    subitems: [
      {
        title: "Usuários",
        url: "/settings/users",
        icon: Percent,
      },
      {
        title: "Planos",
        url: "/settings/plans",
        icon: Hourglass,
      },
      {
        title: "Integrações",
        url: "/settings/integrations",
        icon: Layers,
      },
    ],
  },
];
