"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Upload,
  Image as ImageIcon,
  Star,
  StarOff,
} from "lucide-react";
import { PropertyMedia } from "@/types/property";

interface PropertyMediaUploadProps {
  media: PropertyMedia[];
  onMediaChange: (media: PropertyMedia[]) => void;
  maxFiles?: number;
}

export function PropertyMediaUpload({
  media = [],
  onMediaChange,
  maxFiles = 10,
}: PropertyMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newMediaItems: PropertyMedia[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validar tipo de arquivo
        if (!file.type.startsWith("image/")) {
          alert(`Arquivo ${file.name} não é uma imagem válida`);
          continue;
        }

        // Validar tamanho (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Arquivo ${file.name} é muito grande (máximo 5MB)`);
          continue;
        }

        // Simular upload local - criar URL temporária
        const url = URL.createObjectURL(file);

        const newItem: PropertyMedia = {
          id: `temp-${Date.now()}-${i}`,
          url,
          alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extensão do nome
          isCover: media.length === 0 && i === 0, // Primeira imagem é capa por padrão
          order: media.length + i,
        };

        newMediaItems.push(newItem);
      }

      onMediaChange([...media, ...newMediaItems]);
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      alert("Erro ao fazer upload das imagens");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (mediaId: string) => {
    const updatedMedia = media.filter((item) => item.id !== mediaId);
    // Reordenar
    const reorderedMedia = updatedMedia.map((item, index) => ({
      ...item,
      order: index,
    }));
    onMediaChange(reorderedMedia);
  };

  const handleSetCover = (mediaId: string) => {
    const updatedMedia = media.map((item) => ({
      ...item,
      isCover: item.id === mediaId,
    }));
    onMediaChange(updatedMedia);
  };

  const handleAltChange = (mediaId: string, alt: string) => {
    const updatedMedia = media.map((item) =>
      item.id === mediaId ? { ...item, alt } : item
    );
    onMediaChange(updatedMedia);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-sm font-semibold">4</span>
          </div>
          Imagens da Propriedade
        </CardTitle>
        <CardDescription>
          Faça upload das imagens da propriedade. A primeira imagem será
          definida como capa automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              Clique para fazer upload ou arraste as imagens aqui
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, JPEG até 5MB cada
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Máximo {maxFiles} imagens
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={isUploading || media.length >= maxFiles}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Fazendo upload..." : "Selecionar Imagens"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* Media List */}
        {media.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">
              Imagens ({media.length}/{maxFiles})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div key={item.id} className="relative group">
                    <Card className="overflow-hidden">
                      <div className="aspect-video relative bg-gray-100">
                        <img
                          src={item.url}
                          alt={item.alt || "Imagem da propriedade"}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay com ações */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSetCover(item.id)}
                              className={
                                item.isCover
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : ""
                              }
                            >
                              {item.isCover ? (
                                <Star className="h-4 w-4 fill-current" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveMedia(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Badge de capa */}
                        {item.isCover && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Capa
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <Label htmlFor={`alt-${item.id}`} className="text-xs">
                            Descrição da imagem
                          </Label>
                          <Input
                            id={`alt-${item.id}`}
                            value={item.alt || ""}
                            onChange={(e) =>
                              handleAltChange(item.id, e.target.value)
                            }
                            placeholder="Descrição da imagem..."
                            className="text-xs"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
