import { StageListParams } from "@/types/stages";

/**
 * Extrair parâmetros de filtro da URL para stages
 */
export const extractStageFiltersFromUrl = (
  searchParams: URLSearchParams
): StageListParams => {
  const isWonParam = searchParams.get("isWon");
  const isLostParam = searchParams.get("isLost");

  let isWon: boolean | undefined = undefined;
  let isLost: boolean | undefined = undefined;

  if (isWonParam === "true") {
    isWon = true;
  } else if (isWonParam === "false") {
    isWon = false;
  }

  if (isLostParam === "true") {
    isLost = true;
  } else if (isLostParam === "false") {
    isLost = false;
  }

  // Extrair paginação da URL
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  let page: number | undefined = undefined;
  let limit: number | undefined = undefined;

  if (pageParam) {
    const parsedPage = parseInt(pageParam, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }

  if (limitParam) {
    const parsedLimit = parseInt(limitParam, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
      limit = parsedLimit;
    }
  }

  return {
    search: searchParams.get("search") || undefined,
    type: (searchParams.get("type") as "SALES" | "SUPPORT") || undefined,
    isWon,
    isLost,
    page,
    limit,
  };
};

/**
 * Construir URL com parâmetros de filtro para stages
 */
export const buildStageUrlWithFilters = (filters: StageListParams): string => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.type) {
    params.set("type", filters.type);
  }
  if (filters.isWon !== undefined) {
    params.set("isWon", filters.isWon.toString());
  }
  if (filters.isLost !== undefined) {
    params.set("isLost", filters.isLost.toString());
  }
  if (filters.page && filters.page > 1) {
    params.set("page", filters.page.toString());
  }
  if (filters.limit && filters.limit !== 10) {
    params.set("limit", filters.limit.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};
