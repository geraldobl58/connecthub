import { useState, useEffect } from "react";
import api from "@/lib/api";
import { convertToAbsoluteUrl, convertMediaUrls } from "@/lib/image-utils";

export interface Media {
  id: string;
  propertyId: string;
  url: string;
  alt?: string;
  isCover: boolean;
  order: number;
}

export interface CreateMediaData {
  propertyId: string;
  url: string;
  alt?: string;
  isCover?: boolean;
  order?: number;
}

interface UseMediaProps {
  enabled?: boolean;
}

interface UseMediaReturn {
  media: Media[];
  isLoading: boolean;
  error: string | null;
  createMedia: (data: CreateMediaData) => Promise<Media>;
  updateMedia: (id: string, data: Partial<CreateMediaData>) => Promise<Media>;
  deleteMedia: (id: string) => Promise<void>;
  reorderMedia: (propertyId: string, mediaIds: string[]) => Promise<Media[]>;
  uploadFiles: (propertyId: string, files: File[]) => Promise<Media[]>;
  uploadTempFiles: (
    files: File[]
  ) => Promise<{ url: string; filename: string; alt?: string }[]>;
}

export function useMedia({
  enabled = true,
}: UseMediaProps = {}): UseMediaReturn {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMedia = async (data: CreateMediaData): Promise<Media> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/media", data);
      const newMedia = response.data;
      // Converter URL para absoluta
      newMedia.url = convertToAbsoluteUrl(newMedia.url);
      setMedia((prev) => [...prev, newMedia]);
      return newMedia;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar mídia";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedia = async (
    id: string,
    data: Partial<CreateMediaData>
  ): Promise<Media> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/media/${id}`, data);
      const updatedMedia = response.data;
      // Converter URL para absoluta
      updatedMedia.url = convertToAbsoluteUrl(updatedMedia.url);
      setMedia((prev) => prev.map((m) => (m.id === id ? updatedMedia : m)));
      return updatedMedia;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar mídia";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedia = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/media/${id}`);
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir mídia";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const reorderMedia = async (
    propertyId: string,
    mediaIds: string[]
  ): Promise<Media[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.patch(
        `/media/reorder/${propertyId}`,
        mediaIds
      );
      const reorderedMedia = response.data;
      const convertedMedia = convertMediaUrls(reorderedMedia);
      setMedia(convertedMedia);
      return convertedMedia;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao reordenar mídias";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (
    propertyId: string,
    files: File[]
  ): Promise<Media[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post(
        `/properties/${propertyId}/media/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedMedia = response.data.media;
      const convertedMedia = convertMediaUrls(uploadedMedia);
      setMedia((prev) => [...prev, ...convertedMedia]);
      return convertedMedia;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer upload";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadTempFiles = async (
    files: File[]
  ): Promise<{ url: string; filename: string; alt?: string }[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", file.name.replace(/\.[^/.]+$/, ""));

        const response = await api.post("/media/upload/temp", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return {
          ...response.data,
          url: convertToAbsoluteUrl(response.data.url),
        };
      });

      return await Promise.all(uploadPromises);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer upload";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMediaByProperty = async (propertyId: string): Promise<void> => {
    if (!enabled || !propertyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/media/property/${propertyId}`);
      const mediaData = response.data || [];
      const convertedMedia = convertMediaUrls(mediaData);
      setMedia(convertedMedia);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar mídias";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    media,
    isLoading,
    error,
    createMedia,
    updateMedia,
    deleteMedia,
    reorderMedia,
    uploadFiles,
    uploadTempFiles,
    loadMediaByProperty,
  };
}
