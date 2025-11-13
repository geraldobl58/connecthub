/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientsList } from "./clients-list";
import { useClients } from "../hooks/useClients";

// Mock dos m�dulos externos
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("../hooks/useClients", () => ({
  useClients: vi.fn(),
}));

vi.mock("./columns", () => ({
  clientsColumns: [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }: any) => <div>{row.original.name}</div>,
    },
  ],
}));

vi.mock("./clients-filter", () => ({
  ClientsFilter: ({
    onSearch,
    isLoading,
  }: {
    onSearch: (search: string) => void;
    isLoading: boolean;
  }) => (
    <div data-testid="clients-filter">
      <input
        data-testid="search-input"
        onChange={(e) => onSearch(e.target.value)}
        disabled={isLoading}
      />
    </div>
  ),
}));

vi.mock("@/components/dynamic-data-table", () => ({
  DynamicDataTable: ({
    data,
    isLoading,
    onPageChange,
    onLimitChange,
  }: any) => (
    <div data-testid="dynamic-data-table">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div data-testid="table-data">{data.length} items</div>
          <button
            data-testid="next-page"
            onClick={() => onPageChange && onPageChange(2)}
          >
            Next
          </button>
          <button
            data-testid="change-limit"
            onClick={() => onLimitChange && onLimitChange(20)}
          >
            Change Limit
          </button>
        </>
      )}
    </div>
  ),
}));

describe("ClientsList", () => {
  const mockPush = vi.fn();
  const mockGet = vi.fn();
  const mockHandlePageChange = vi.fn();
  const mockHandleLimitChange = vi.fn();
  const mockHandleSearch = vi.fn();

  const mockClientsData = [
    {
      id: "1",
      name: "Client 1",
      email: "client1@example.com",
      address: "Rua Teste",
      number: "123",
      neighborhood: "Centro",
      zipCode: "12345-678",
      complement: "Apto 101",
      phone: "(11) 1234-5678",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Client 2",
      email: "client2@example.com",
      address: "Rua Teste 2",
      number: "456",
      neighborhood: "Vila Nova",
      zipCode: "98765-432",
      complement: "Casa",
      phone: "(21) 9876-5432",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do useRouter
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    // Mock do useSearchParams
    vi.mocked(useSearchParams).mockReturnValue({
      get: mockGet,
    } as any);

    // Mock do useClients
    vi.mocked(useClients).mockReturnValue({
      clients: mockClientsData,
      total: 2,
      page: 1,
      limit: 10,
      pageSize: 2,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 10 },
      refetch: vi.fn(),
    } as any);

    mockGet.mockReturnValue(null);
  });

  it("should render clients list with filter and new client button", () => {
    render(<ClientsList />);

    expect(screen.getByTestId("clients-filter")).toBeInTheDocument();
    expect(screen.getByText("Novo Cliente")).toBeInTheDocument();
    expect(screen.getByTestId("dynamic-data-table")).toBeInTheDocument();
  });

  it("should render DynamicDataTable with correct data", () => {
    render(<ClientsList />);

    expect(screen.getByTestId("table-data")).toHaveTextContent("2 items");
  });

  it("should show loading state when isLoading is true", () => {
    vi.mocked(useClients).mockReturnValue({
      clients: [],
      total: 0,
      page: 1,
      limit: 10,
      pageSize: 0,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: true,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 10 },
      refetch: vi.fn(),
    } as any);

    render(<ClientsList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should have link to new client page", () => {
    render(<ClientsList />);

    const link = screen.getByRole("link", { name: /novo cliente/i });
    expect(link).toHaveAttribute("href", "/dashboard/clients/new");
  });

  it("should call handleSearch when search is performed", async () => {
    const user = userEvent.setup();
    render(<ClientsList />);

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "test");

    // O mock do ClientsFilter chama onSearch com o valor completo do input
    expect(mockHandleSearch).toHaveBeenCalledWith("t");
    expect(mockHandleSearch).toHaveBeenCalledWith("te");
    expect(mockHandleSearch).toHaveBeenCalledWith("tes");
    expect(mockHandleSearch).toHaveBeenCalledWith("test");
  });

  it("should call handlePageChange when page is changed", async () => {
    const user = userEvent.setup();
    render(<ClientsList />);

    const nextButton = screen.getByTestId("next-page");
    await user.click(nextButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });

  it("should call handleLimitChange when limit is changed", async () => {
    const user = userEvent.setup();
    render(<ClientsList />);

    const changeLimitButton = screen.getByTestId("change-limit");
    await user.click(changeLimitButton);

    expect(mockHandleLimitChange).toHaveBeenCalledWith(20);
  });

  it("should read page parameter from URL", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "page") return "2";
      return null;
    });

    render(<ClientsList />);

    expect(useClients).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  it("should read limit parameter from URL", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "limit") return "20";
      return null;
    });

    render(<ClientsList />);

    expect(useClients).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 20 })
    );
  });

  it("should read search parameter from URL", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "search") return "test search";
      return null;
    });

    render(<ClientsList />);

    expect(useClients).toHaveBeenCalledWith(
      expect.objectContaining({ search: "test search" })
    );
  });

  it("should use default values when no URL parameters", () => {
    mockGet.mockReturnValue(null);

    render(<ClientsList />);

    expect(useClients).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10, search: undefined })
    );
  });

  it("should update URL when queryParams change", async () => {
    const { rerender } = render(<ClientsList />);

    // Mudar os queryParams
    vi.mocked(useClients).mockReturnValue({
      clients: mockClientsData,
      total: 2,
      page: 2,
      limit: 10,
      pageSize: 2,
      hasNextPage: false,
      hasPrevPage: true,
      isLoading: false,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 2, limit: 10 },
      refetch: vi.fn(),
    } as any);

    rerender(<ClientsList />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/dashboard/clients?page=2",
        expect.objectContaining({ scroll: false })
      );
    });
  });

  it("should update URL with limit when different from default", async () => {
    vi.mocked(useClients).mockReturnValue({
      clients: mockClientsData,
      total: 2,
      page: 1,
      limit: 20,
      pageSize: 2,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 20 },
      refetch: vi.fn(),
    } as any);

    render(<ClientsList />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/dashboard/clients?limit=20",
        expect.objectContaining({ scroll: false })
      );
    });
  });

  it("should update URL with search parameter", async () => {
    vi.mocked(useClients).mockReturnValue({
      clients: mockClientsData,
      total: 2,
      page: 1,
      limit: 10,
      pageSize: 2,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 10, search: "test" },
      refetch: vi.fn(),
    } as any);

    render(<ClientsList />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/dashboard/clients?search=test",
        expect.objectContaining({ scroll: false })
      );
    });
  });

  it("should not update URL when it hasn't changed", () => {
    // Simular que a URL j� est� correta
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/dashboard/clients",
        search: "",
      },
      writable: true,
    });

    vi.mocked(useClients).mockReturnValue({
      clients: mockClientsData,
      total: 2,
      page: 1,
      limit: 10,
      pageSize: 2,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 10 },
      refetch: vi.fn(),
    } as any);

    render(<ClientsList />);

    // N�o deve chamar push se a URL j� est� correta
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should render Plus icon in new client button", () => {
    const { container } = render(<ClientsList />);

    const plusIcon = container.querySelector(".lucide-plus");
    expect(plusIcon).toBeInTheDocument();
  });

  it("should pass correct props to DynamicDataTable", () => {
    render(<ClientsList />);

    const table = screen.getByTestId("dynamic-data-table");
    expect(table).toBeInTheDocument();
  });

  it("should disable search when loading", () => {
    vi.mocked(useClients).mockReturnValue({
      clients: [],
      total: 0,
      page: 1,
      limit: 10,
      pageSize: 0,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: true,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 10 },
      refetch: vi.fn(),
    } as any);

    render(<ClientsList />);

    const searchInput = screen.getByTestId("search-input");
    expect(searchInput).toBeDisabled();
  });

  it("should render with empty clients array", () => {
    vi.mocked(useClients).mockReturnValue({
      clients: [],
      total: 0,
      page: 1,
      limit: 10,
      pageSize: 0,
      hasNextPage: false,
      hasPrevPage: false,
      isLoading: false,
      handlePageChange: mockHandlePageChange,
      handleLimitChange: mockHandleLimitChange,
      handleSearch: mockHandleSearch,
      queryParams: { page: 1, limit: 10 },
      refetch: vi.fn(),
    } as any);

    render(<ClientsList />);

    expect(screen.getByTestId("table-data")).toHaveTextContent("0 items");
  });

  it("should handle multiple URL parameters correctly", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "page") return "3";
      if (key === "limit") return "25";
      if (key === "search") return "john";
      return null;
    });

    render(<ClientsList />);

    expect(useClients).toHaveBeenCalledWith(
      expect.objectContaining({ page: 3, limit: 25, search: "john" })
    );
  });
});
