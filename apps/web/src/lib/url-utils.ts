import { UserListParams } from "@/types/users";
import { Role } from "@/types/permissions";

/**
 * Extrair parâmetros de filtro da URL
 */
export const extractFiltersFromUrl = (
  searchParams: URLSearchParams
): UserListParams => {
  const isActiveParam = searchParams.get("isActive");
  let isActive: boolean | undefined = undefined;

  if (isActiveParam === "true") {
    isActive = true;
  } else if (isActiveParam === "false") {
    isActive = false;
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
    role: (searchParams.get("role") as Role) || undefined,
    isActive,
    page,
    limit,
  };
};

/**
 * Construir URL com parâmetros de filtro
 */
export const buildUrlWithFilters = (filters: UserListParams): string => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.role) {
    params.set("role", filters.role);
  }
  if (filters.isActive !== undefined) {
    params.set("isActive", filters.isActive.toString());
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
