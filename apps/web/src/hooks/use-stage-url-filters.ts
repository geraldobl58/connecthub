"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { StageListParams } from "@/types/stages";
import { extractStageFiltersFromUrl } from "@/lib/stage-url-utils";

export const useStageUrlFilters = (): StageListParams => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    return extractStageFiltersFromUrl(searchParams);
  }, [searchParams]);
};
