import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAllClients } from "@/features/clients/hooks/useClients";
import * as clientActions from "@/features/clients/actions/client";

// Mock das actions
vi.mock("@/features/clients/actions/client", () => ({
  getAllClientsAction: vi.fn(),
}));

describe("useAllClients hook", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Reset do QueryClient antes de cada teste
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should fetch all clients successfully", async () => {
    const mockClients = [
      { id: "1", name: "Client 1", email: "client1@example.com" },
      { id: "2", name: "Client 2", email: "client2@example.com" },
    ];

    vi.mocked(clientActions.getAllClientsAction).mockResolvedValue({
      success: true,
      data: mockClients,
    });

    const { result } = renderHook(() => useAllClients(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clients).toEqual(mockClients);
    expect(result.current.isError).toBe(false);
  });

  it("should handle empty clients list", async () => {
    vi.mocked(clientActions.getAllClientsAction).mockResolvedValue({
      success: true,
      data: [],
    });

    const { result } = renderHook(() => useAllClients(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clients).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it("should handle error when fetching clients", async () => {
    vi.mocked(clientActions.getAllClientsAction).mockResolvedValue({
      success: false,
      message: "Failed to fetch clients",
    });

    const { result } = renderHook(() => useAllClients(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.clients).toEqual([]);
  });

  it("should return empty array when data is undefined", async () => {
    vi.mocked(clientActions.getAllClientsAction).mockResolvedValue({
      success: true,
      data: undefined,
    });

    const { result } = renderHook(() => useAllClients(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.clients).toEqual([]);
  });
});
