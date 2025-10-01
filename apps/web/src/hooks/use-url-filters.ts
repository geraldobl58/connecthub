"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { UserListParams } from "@/types/users";
import { extractFiltersFromUrl } from "@/lib/url-utils";

export const useUrlFilters = (): UserListParams => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    return extractFiltersFromUrl(searchParams);
  }, [searchParams]);
};
