/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { ContractsFilter } from "./contracts-filter";

// Mock do Next.js navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("ContractsFilter", () => {
  const mockOnSearch = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do useSearchParams
    vi.mocked(useSearchParams).mockReturnValue({
      get: mockGet,
    } as any);

    // Por padrão, não retorna nenhum parâmetro de busca
    mockGet.mockReturnValue(null);
  });

  it("should render search input and buttons", () => {
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    expect(
      screen.getByPlaceholderText("Buscar contratos por nome")
    ).toBeInTheDocument();
    expect(screen.getByText("Buscar")).toBeInTheDocument();
    expect(screen.getByText("Limpar")).toBeInTheDocument();
  });

  it("should call onSearch when form is submitted", async () => {
    const user = userEvent.setup();
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    const submitButton = screen.getByText("Buscar");

    await user.type(input, "contrato teste");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("contrato teste");
    });
  });

  it("should call onSearch when Enter is pressed", async () => {
    const user = userEvent.setup();
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");

    await user.type(input, "contrato teste{Enter}");

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("contrato teste");
    });
  });

  it("should not call onSearch when search is empty", async () => {
    const user = userEvent.setup();
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const submitButton = screen.getByText("Buscar");
    await user.click(submitButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("should clear search input and call onSearch with empty string when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    const clearButton = screen.getByText("Limpar");

    await user.type(input, "contrato teste");
    await user.click(clearButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("");
      expect(input).toHaveValue("");
    });
  });

  it("should disable all inputs and buttons when isLoading is true", () => {
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    const submitButton = screen.getByText("Buscar");
    const clearButton = screen.getByText("Limpar");

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("should initialize with search param from URL", () => {
    mockGet.mockImplementation((key: string) => {
      if (key === "search") return "initial search";
      return null;
    });

    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    expect(input).toHaveValue("initial search");
  });

  it("should initialize with empty string when no search param in URL", () => {
    mockGet.mockReturnValue(null);

    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    expect(input).toHaveValue("");
  });

  it("should render Search icon in submit button", () => {
    const { container } = render(
      <ContractsFilter onSearch={mockOnSearch} isLoading={false} />
    );

    const searchIcon = container.querySelector(".lucide-search");
    expect(searchIcon).toBeInTheDocument();
  });

  it("should render X icon in clear button", () => {
    const { container } = render(
      <ContractsFilter onSearch={mockOnSearch} isLoading={false} />
    );

    const xIcon = container.querySelector(".lucide-x");
    expect(xIcon).toBeInTheDocument();
  });

  it("should have correct button types", () => {
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const submitButton = screen.getByText("Buscar");
    const clearButton = screen.getByText("Limpar");

    expect(submitButton).toHaveAttribute("type", "submit");
    expect(clearButton).toHaveAttribute("type", "button");
  });

  it("should have outline variant on clear button", () => {
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const clearButton = screen.getByText("Limpar");
    expect(clearButton.className).toContain("outline");
  });

  it("should handle multiple searches", async () => {
    const user = userEvent.setup();
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    const submitButton = screen.getByText("Buscar");

    // Primeira busca
    await user.type(input, "primeira busca");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("primeira busca");
    });

    // Limpar
    await user.clear(input);

    // Segunda busca
    await user.type(input, "segunda busca");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("segunda busca");
    });

    expect(mockOnSearch).toHaveBeenCalledTimes(2);
  });

  it("should handle search with special characters", async () => {
    const user = userEvent.setup();
    render(<ContractsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText("Buscar contratos por nome");
    const submitButton = screen.getByText("Buscar");

    await user.type(input, "contrato & teste @ 123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("contrato & teste @ 123");
    });
  });
});
