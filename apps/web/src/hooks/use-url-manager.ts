"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { UserListParams } from "@/types/users";
import { buildUrlWithFilters, extractFiltersFromUrl } from "@/lib/url-utils";

export const useUrlManager = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = (newFilters: UserListParams) => {
    const newURL = buildUrlWithFilters(newFilters);
    router.push(`/settings/users${newURL}`, { scroll: false });
  };

  const updatePage = (page: number) => {
    const currentFilters = extractFiltersFromUrl(searchParams);
    const newFilters = { ...currentFilters, page };
    const newURL = buildUrlWithFilters(newFilters);
    router.push(`/settings/users${newURL}`, { scroll: false });
  };

  const updateLimit = (limit: number) => {
    const currentFilters = extractFiltersFromUrl(searchParams);
    const newFilters = { ...currentFilters, limit, page: 1 }; // Reset to page 1
    const newURL = buildUrlWithFilters(newFilters);
    router.push(`/settings/users${newURL}`, { scroll: false });
  };

  return {
    updateURL,
    updatePage,
    updateLimit,
  };
};
