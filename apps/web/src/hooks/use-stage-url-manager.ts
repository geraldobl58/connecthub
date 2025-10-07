"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { StageListParams } from "@/types/stages";
import {
  buildStageUrlWithFilters,
  extractStageFiltersFromUrl,
} from "@/lib/stage-url-utils";

export const useStageUrlManager = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = (newFilters: StageListParams) => {
    const newURL = buildStageUrlWithFilters(newFilters);
    router.push(`/settings/stages${newURL}`, { scroll: false });
  };

  const updatePage = (page: number) => {
    const currentFilters = extractStageFiltersFromUrl(searchParams);
    const newFilters = { ...currentFilters, page };
    const newURL = buildStageUrlWithFilters(newFilters);
    router.push(`/settings/stages${newURL}`, { scroll: false });
  };

  const updateLimit = (limit: number) => {
    const currentFilters = extractStageFiltersFromUrl(searchParams);
    const newFilters = { ...currentFilters, limit, page: 1 }; // Reset to page 1
    const newURL = buildStageUrlWithFilters(newFilters);
    router.push(`/settings/stages${newURL}`, { scroll: false });
  };

  return {
    updateURL,
    updatePage,
    updateLimit,
  };
};
