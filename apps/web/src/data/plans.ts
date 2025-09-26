import { Crown, Star, Zap, LucideIcon } from "lucide-react";

export interface Plan {
  id: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  name: string;
  icon: LucideIcon;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

export const plans: Plan[] = [
  {
    id: "STARTER",
    name: "Starter",
    icon: Star,
    price: 149,
    description: "Perfeito para pequenos negócios",
    features: [
      "Até 5 usuários",
      "1.000 leads/mês",
      "Suporte básico",
      "Dashboard essencial",
      "Relatórios básicos",
    ],
    popular: false,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    icon: Crown,
    price: 299,
    description: "Ideal para empresas em crescimento",
    features: [
      "Até 20 usuários",
      "5.000 leads/mês",
      "Suporte prioritário",
      "Relatórios avançados",
      "Integrações API",
      "Gestão de equipes",
    ],
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    icon: Zap,
    price: 599,
    description: "Para empresas de grande porte",
    features: [
      "Usuários ilimitados",
      "Leads ilimitados",
      "Suporte 24/7",
      "Customizações avançadas",
      "White label",
      "Integração personalizada",
    ],
    popular: false,
  },
];
