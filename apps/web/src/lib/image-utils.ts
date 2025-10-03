// Função para converter URL relativa em absoluta
export const convertToAbsoluteUrl = (url: string): string => {
  if (url.startsWith("http")) {
    return url; // Já é absoluta
  }
  if (url.startsWith("/uploads/")) {
    // URL relativa da API - converter para absoluta
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
    return `${baseUrl}${url}`;
  }
  return url; // URL local ou blob
};

// Função para converter URLs de mídias em um array
export const convertMediaUrls = (media: any[]): any[] => {
  if (!media || !Array.isArray(media)) {
    return [];
  }

  return media.map((item) => ({
    ...item,
    url: convertToAbsoluteUrl(item.url),
  }));
};
