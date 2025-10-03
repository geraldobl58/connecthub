"use client";

import { useState, useRef, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { PropertyMedia } from "@/types/property";
import { useMedia, Media } from "@/hooks/use-media";
import { toast } from "sonner";

interface PropertyMediaUploadProps {
  media: PropertyMedia[];
  onMediaChange: (media: PropertyMedia[]) => void;
  maxFiles?: number;
  propertyId?: string; // Para upload direto para API
  onUploadFiles?: (files: File[]) => Promise<PropertyMedia[]>; // Callback para upload durante criação
}

export function PropertyMediaUpload({
  media = [],
  onMediaChange,
  maxFiles = 10,
  propertyId,
  onUploadFiles,
}: PropertyMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFiles, updateMedia, deleteMedia } = useMedia({
    enabled: false,
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const fileArray = Array.from(files);

      // Validar arquivos
      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          toast.error(`Arquivo ${file.name} não é uma imagem válida`);
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          // 10MB como na API
          toast.error(`Arquivo ${file.name} é muito grande (máximo 10MB)`);
          return;
        }
      }

      if (propertyId) {
        // Upload direto para API (edição)
        const uploadedMedia = await uploadFiles(propertyId, fileArray);

        // Converter para formato PropertyMedia
        const newMediaItems: PropertyMedia[] = uploadedMedia.map((item) => ({
          id: item.id,
          url: item.url,
          alt: item.alt || "",
          isCover: item.isCover,
          order: item.order,
        }));

        onMediaChange([...media, ...newMediaItems]);
        toast.success(`${fileArray.length} imagem(ns) enviada(s) com sucesso!`);
      } else if (onUploadFiles) {
        // Upload via callback (criação)
        const uploadedMedia = await onUploadFiles(fileArray);
        onMediaChange([...media, ...uploadedMedia]);
        toast.success(`${fileArray.length} imagem(ns) enviada(s) com sucesso!`);
      } else {
        // Modo local (fallback - não recomendado)
        const newMediaItems: PropertyMedia[] = [];

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];
          const url = URL.createObjectURL(file);

          const newItem: PropertyMedia = {
            id: `temp-${Date.now()}-${i}`,
            url,
            alt: file.name.replace(/\.[^/.]+$/, ""),
            isCover: media.length === 0 && i === 0,
            order: media.length + i,
          };

          newMediaItems.push(newItem);
        }

        onMediaChange([...media, ...newMediaItems]);
        toast.warning(
          "Imagens salvas localmente. Serão enviadas ao salvar a propriedade."
        );
      }
    } catch (error) {
      console.error("Erro ao processar arquivos:", error);
      toast.error("Erro ao fazer upload das imagens");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = async (mediaId: string) => {
    try {
      // Se não é um ID temporário, deletar da API
      if (!mediaId.startsWith("temp-") && propertyId) {
        await deleteMedia(mediaId);
        toast.success("Imagem removida com sucesso!");
      }

      const updatedMedia = media.filter((item) => item.id !== mediaId);
      // Reordenar
      const reorderedMedia = updatedMedia.map((item, index) => ({
        ...item,
        order: index,
      }));
      onMediaChange(reorderedMedia);
    } catch (error) {
      console.error("Erro ao remover mídia:", error);
      toast.error("Erro ao remover imagem");
    }
  };

  const handleSetCover = async (mediaId: string) => {
    try {
      // Se não é um ID temporário, atualizar na API
      if (!mediaId.startsWith("temp-") && propertyId) {
        // Primeiro, remover capa de todas as outras
        for (const item of media) {
          if (
            item.id !== mediaId &&
            item.isCover &&
            !item.id.startsWith("temp-")
          ) {
            await updateMedia(item.id, { isCover: false });
          }
        }
        // Definir nova capa
        await updateMedia(mediaId, { isCover: true });
        toast.success("Imagem de capa alterada!");
      }

      const updatedMedia = media.map((item) => ({
        ...item,
        isCover: item.id === mediaId,
      }));
      onMediaChange(updatedMedia);
    } catch (error) {
      console.error("Erro ao alterar capa:", error);
      toast.error("Erro ao alterar imagem de capa");
    }
  };

  const handleAltChange = async (mediaId: string, alt: string) => {
    try {
      // Se não é um ID temporário, atualizar na API
      if (!mediaId.startsWith("temp-") && propertyId) {
        await updateMedia(mediaId, { alt });
      }

      const updatedMedia = media.map((item) =>
        item.id === mediaId ? { ...item, alt } : item
      );
      onMediaChange(updatedMedia);
    } catch (error) {
      console.error("Erro ao alterar descrição:", error);
      toast.error("Erro ao alterar descrição da imagem");
    }
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
              PNG, JPG, JPEG, GIF, WebP até 10MB cada
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
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
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
