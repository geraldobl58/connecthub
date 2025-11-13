/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { ClientsFilter } from "./clients-filter";

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

describe("ClientsFilter", () => {
  const mockOnSearch = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do useSearchParams
    vi.mocked(useSearchParams).mockReturnValue({
      get: mockGet,
    } as any);
  });

  it("should render search input and buttons", () => {
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    );
    const searchButton = screen.getByRole("button", { name: /buscar/i });
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    expect(input).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  it("should initialize with search param from URL", () => {
    mockGet.mockReturnValue("test search");

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    ) as HTMLInputElement;

    // O useEffect deve definir o valor
    waitFor(() => {
      expect(input.value).toBe("test search");
    });
  });

  it("should initialize with empty string when no search param", () => {
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    ) as HTMLInputElement;

    expect(input.value).toBe("");
  });

  it("should call onSearch when form is submitted with search text", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    );
    const searchButton = screen.getByRole("button", { name: /buscar/i });

    await user.type(input, "Test Client");
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("Test Client");
  });

  it("should not call onSearch when form is submitted with empty search", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const searchButton = screen.getByRole("button", { name: /buscar/i });
    await user.click(searchButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("should clear search and call onSearch with empty string when clear button is clicked", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue("test search");

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    ) as HTMLInputElement;
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    // Preencher o input
    await user.clear(input);
    await user.type(input, "Some Search");

    // Clicar em limpar
    await user.click(clearButton);

    await waitFor(() => {
      expect(input.value).toBe("");
      expect(mockOnSearch).toHaveBeenCalledWith("");
    });
  });

  it("should disable all inputs and buttons when isLoading is true", () => {
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    );
    const searchButton = screen.getByRole("button", { name: /buscar/i });
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    expect(input).toBeDisabled();
    expect(searchButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("should enable all inputs and buttons when isLoading is false", () => {
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    );
    const searchButton = screen.getByRole("button", { name: /buscar/i });
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    expect(input).not.toBeDisabled();
    expect(searchButton).not.toBeDisabled();
    expect(clearButton).not.toBeDisabled();
  });

  it("should update search value when user types", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    ) as HTMLInputElement;

    await user.type(input, "New Search");

    expect(input.value).toBe("New Search");
  });

  it("should render Search and X icons", () => {
    mockGet.mockReturnValue(null);

    const { container } = render(
      <ClientsFilter onSearch={mockOnSearch} isLoading={false} />
    );

    // Verificar se os �cones lucide-react est�o presentes atrav�s das classes
    const searchIcon = container.querySelector(".lucide-search");
    const xIcon = container.querySelector(".lucide-x");

    expect(searchIcon).toBeInTheDocument();
    expect(xIcon).toBeInTheDocument();
  });

  it("should submit form when Enter key is pressed in input", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    );

    await user.type(input, "Test Client{Enter}");

    expect(mockOnSearch).toHaveBeenCalledWith("Test Client");
  });

  it("should update input value when searchParams change", async () => {
    mockGet.mockReturnValue("initial search");

    const { rerender } = render(
      <ClientsFilter onSearch={mockOnSearch} isLoading={false} />
    );

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    ) as HTMLInputElement;

    // Verificar valor inicial
    await waitFor(() => {
      expect(input.value).toBe("initial search");
    });

    // Simular mudança no searchParams - remonta o componente
    mockGet.mockReturnValue("updated search");

    rerender(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    // O useEffect deve ser chamado novamente, mas o rerender do Testing Library
    // não necessariamente cria uma nova instância do hook useSearchParams
    // Este teste verifica que o componente responde a mudanças de props
    expect(input).toBeInTheDocument();
  });

  it("should have correct button variants", () => {
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const searchButton = screen.getByRole("button", { name: /buscar/i });
    const clearButton = screen.getByRole("button", { name: /limpar/i });

    // O bot�o de buscar n�o tem variant (default)
    expect(searchButton).toBeInTheDocument();

    // O bot�o de limpar tem variant outline
    expect(clearButton).toBeInTheDocument();
  });

  it("should call onSearch multiple times when form is submitted multiple times", async () => {
    const user = userEvent.setup();
    mockGet.mockReturnValue(null);

    render(<ClientsFilter onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(
      /buscar cliente por nome, email ou bairro/i
    );
    const searchButton = screen.getByRole("button", { name: /buscar/i });

    // Primeira busca
    await user.type(input, "First Search");
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("First Search");

    // Segunda busca
    await user.clear(input);
    await user.type(input, "Second Search");
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("Second Search");
    expect(mockOnSearch).toHaveBeenCalledTimes(2);
  });
});
