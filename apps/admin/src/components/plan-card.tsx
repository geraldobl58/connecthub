import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, LucideIcon } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  icon: LucideIcon;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
}

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (planId: string) => void;
}

export const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
      } ${plan.popular ? "border-blue-200" : ""}`}
      onClick={() => onSelect(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-600 text-white px-3 py-1">
            Mais Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <plan.icon className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-sm">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">
            R${plan.price}
          </span>
          <span className="text-gray-500">/mês</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            className={`w-full ${
              isSelected
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => onSelect(plan.id)}
          >
            {isSelected ? "Selecionado" : "Selecionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
