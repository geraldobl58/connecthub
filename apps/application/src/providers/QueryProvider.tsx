import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import type { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            gcTime: 1000 * 60 * 10, // 10 minutos (substitui cacheTime)
            retry: (failureCount, error: unknown) => {
              // Não retry em erros 4xx
              if (error && typeof error === "object" && "status" in error) {
                const status = (error as { status: number }).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              // Retry até 3 vezes para outros erros
              return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
