"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit2 } from "lucide-react";

interface Feature {
  key: string;
  value: string;
}

interface PropertyFeaturesProps {
  features?: Record<string, string>;
  onChange: (features: Record<string, string>) => void;
}

export function PropertyFeatures({
  features = {},
  onChange,
}: PropertyFeaturesProps) {
  const [featureList, setFeatureList] = useState<Feature[]>(() => {
    return Object.entries(features).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  });

  const [newFeature, setNewFeature] = useState<Feature>({ key: "", value: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddFeature = () => {
    if (newFeature.key.trim() && newFeature.value.trim()) {
      const updatedFeatures = [...featureList, { ...newFeature }];
      setFeatureList(updatedFeatures);
      setNewFeature({ key: "", value: "" });

      // Convert to object and notify parent
      const featuresObject = updatedFeatures.reduce(
        (acc, feature) => {
          acc[feature.key] = feature.value;
          return acc;
        },
        {} as Record<string, string>
      );

      onChange(featuresObject);
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = featureList.filter((_, i) => i !== index);
    setFeatureList(updatedFeatures);
    setEditingIndex(null);

    // Convert to object and notify parent
    const featuresObject = updatedFeatures.reduce(
      (acc, feature) => {
        acc[feature.key] = feature.value;
        return acc;
      },
      {} as Record<string, string>
    );

    onChange(featuresObject);
  };

  const handleUpdateFeature = (index: number, updatedFeature: Feature) => {
    const updatedFeatures = [...featureList];
    updatedFeatures[index] = updatedFeature;
    setFeatureList(updatedFeatures);
    setEditingIndex(null);

    // Convert to object and notify parent
    const featuresObject = updatedFeatures.reduce(
      (acc, feature) => {
        acc[feature.key] = feature.value;
        return acc;
      },
      {} as Record<string, string>
    );

    onChange(featuresObject);
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-sm font-semibold">4</span>
          </div>
          Características Especiais
        </CardTitle>
        <CardDescription>
          Adicione características especiais da propriedade como amenidades,
          equipamentos ou outras informações relevantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de features existentes */}
        {featureList.length > 0 && (
          <div className="space-y-3">
            <Label>Características adicionadas:</Label>
            <div className="flex flex-wrap gap-2">
              {featureList.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  {editingIndex === index ? (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-white">
                      <Input
                        value={feature.key}
                        onChange={(e) => {
                          const updated = { ...feature, key: e.target.value };
                          setFeatureList((prev) =>
                            prev.map((f, i) => (i === index ? updated : f))
                          );
                        }}
                        placeholder="Nome da característica"
                        className="w-32"
                      />
                      <Input
                        value={feature.value}
                        onChange={(e) => {
                          const updated = { ...feature, value: e.target.value };
                          setFeatureList((prev) =>
                            prev.map((f, i) => (i === index ? updated : f))
                          );
                        }}
                        placeholder="Valor"
                        className="w-32"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateFeature(index, feature)}
                        className="h-8 px-2"
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingIndex(null)}
                        className="h-8 px-2"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <span className="font-medium">{feature.key}:</span>
                      <span>{feature.value}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(index)}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFeature(index)}
                        className="h-4 w-4 p-0 ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulário para adicionar nova feature */}
        <div className="space-y-3">
          <Label>Adicionar nova característica:</Label>
          <div className="flex gap-2">
            <Input
              value={newFeature.key}
              onChange={(e) =>
                setNewFeature((prev) => ({ ...prev, key: e.target.value }))
              }
              placeholder="Ex: Piscina, Ar condicionado, Elevador..."
              className="flex-1"
            />
            <Input
              value={newFeature.value}
              onChange={(e) =>
                setNewFeature((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="Ex: Sim, 2 unidades, Disponível..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddFeature}
              disabled={!newFeature.key.trim() || !newFeature.value.trim()}
              className="px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Sugestões de features comuns */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Sugestões:</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "Piscina", value: "Sim" },
              { key: "Ar Condicionado", value: "Central" },
              { key: "Elevador", value: "2 unidades" },
              { key: "Portaria 24h", value: "Sim" },
              { key: "Academia", value: "Completa" },
              { key: "Playground", value: "Sim" },
              { key: "Salão de Festas", value: "Sim" },
              { key: "Churrasqueira", value: "Área gourmet" },
              { key: "Vaga Coberta", value: "Sim" },
              { key: "Sistema de Segurança", value: "Monitorado" },
            ].map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNewFeature(suggestion)}
                className="text-xs"
              >
                {suggestion.key}: {suggestion.value}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
