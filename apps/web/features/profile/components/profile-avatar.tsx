"use client";

import { Button } from "@/components/ui/button";
import { Upload, Check, AlertCircle } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { getCookie } from "cookies-next";
import { uploadAvatarAction } from "../actions/upload-avatar";
import Image from "next/image";

interface ProfileAvatarProps {
  onUploadSuccess?: () => Promise<void>;
  profileData?: {
    avatar?: string | null;
  };
}

export const ProfileAvatar = ({
  onUploadSuccess,
  profileData,
}: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Handle file selection and preview
   */
  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const acceptedFormats = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
    ];
    if (!acceptedFormats.includes(file.type)) {
      setError("Formato deve ser PNG, JPG, GIF ou WebP");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Arquivo deve ser menor que 5MB");
      return;
    }

    // Clear previous errors and success
    setError(null);
    setSuccess(false);

    // Set selected file
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Handle file input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Handle upload button click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle avatar save
   */
  const handleSaveAvatar = async () => {
    if (!selectedFile) {
      setError("Selecione uma imagem primeiro");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from cookie
      const token = getCookie("access_token");
      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const result = await uploadAvatarAction(selectedFile, token as string);

      if (result.success) {
        setSuccess(true);
        setSelectedFile(null);
        setPreview(null);

        // Call refetch callback to update profile data
        if (onUploadSuccess) {
          await onUploadSuccess();
        }

        // Reset after 2 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      } else {
        setError(result.message || "Erro ao enviar avatar");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Erro ao enviar avatar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Preview */}
      <div className="space-y-4">
        <label className="text-sm font-semibold text-gray-600">Avatar</label>
        <div className="relative">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              width={96}
              height={96}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-dashed border-blue-300">
              <span className="text-4xl">
                {profileData?.avatar ? (
                  <Image
                    src={profileData.avatar}
                    alt="Current avatar"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  "😊"
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Erro</p>
            <p className="text-xs text-red-800 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">Sucesso</p>
            <p className="text-xs text-green-800 mt-1">
              Avatar enviado com sucesso
            </p>
          </div>
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLoading}
      />

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
      >
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700">
          {selectedFile
            ? selectedFile.name
            : "Arraste sua imagem aqui ou clique para selecionar"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {selectedFile
            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`
            : "PNG, JPG, GIF até 5MB"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-3">
        <Button
          onClick={handleSaveAvatar}
          disabled={!selectedFile || isLoading}
          className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Enviando..." : "Salvar Avatar"}
        </Button>
        {selectedFile && (
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto rounded-lg"
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
};
