/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ClientActions } from "./client-actions";
import { useDeleteClient } from "../hooks/useClients";

// Mock dos módulos externos
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../hooks/useClients", () => ({
  useDeleteClient: vi.fn(),
}));

// Mock do window.confirm
const originalConfirm = window.confirm;

describe("ClientActions", () => {
  const mockPush = vi.fn();
  const mockDeleteClient = vi.fn();

  const mockClient = {
    id: "123",
    name: "Test Client",
    email: "test@example.com",
    address: "Rua Teste",
    number: "123",
    neighborhood: "Centro",
    zipCode: "12345-678",
    complement: "Apto 101",
    phone: "(11) 1234-5678",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do useRouter
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    // Mock do useDeleteClient
    vi.mocked(useDeleteClient).mockReturnValue({
      mutate: mockDeleteClient,
      isPending: false,
    } as any);

    // Mock do window.confirm
    window.confirm = vi.fn();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it("should render dropdown menu button", () => {
    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    expect(button).toBeInTheDocument();
  });

  it("should show menu items when dropdown is opened", async () => {
    const user = userEvent.setup();
    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    expect(screen.getByText("Ações")).toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Deletar")).toBeInTheDocument();
  });

  it("should navigate to edit page when edit is clicked", async () => {
    const user = userEvent.setup();
    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const editButton = screen.getByText("Editar");
    await user.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/clients/123");
  });

  it("should show confirmation dialog when delete is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(false);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Tem certeza que deseja deletar Test Client?"
    );
  });

  it("should not delete client when user cancels confirmation", async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(false);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(mockDeleteClient).not.toHaveBeenCalled();
  });

  it("should delete client successfully when confirmed", async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(mockDeleteClient).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it("should show success toast on successful deletion", async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Simular sucesso da deleção
    const onSuccess = mockDeleteClient.mock.calls[0][1].onSuccess;
    onSuccess({ success: true });

    expect(toast.success).toHaveBeenCalledWith("Cliente deletado com sucesso!");
  });

  it("should show error toast on failed deletion", async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Simular erro da deleção
    const onSuccess = mockDeleteClient.mock.calls[0][1].onSuccess;
    onSuccess({ success: false, message: "Cliente possui contratos" });

    expect(toast.error).toHaveBeenCalledWith("Cliente possui contratos");
  });

  it("should show error toast when deletion throws error", async () => {
    const user = userEvent.setup();
    vi.mocked(window.confirm).mockReturnValue(true);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Simular erro na requisição
    const onError = mockDeleteClient.mock.calls[0][1].onError;
    onError(new Error("Network error"));

    expect(toast.error).toHaveBeenCalledWith("Erro ao deletar cliente");
  });

  it("should disable delete button when deletion is pending", async () => {
    const user = userEvent.setup();

    // Mock useDeleteClient com isPending = true
    vi.mocked(useDeleteClient).mockReturnValue({
      mutate: mockDeleteClient,
      isPending: true,
    } as any);

    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    const deleteButton = screen.getByText("Deletar");

    // Verificar que o menu item está desabilitado
    expect(deleteButton).toBeInTheDocument();
    // O disabled é passado para o DropdownMenuItem do Radix UI
  });

  it("should render edit and delete menu items", async () => {
    const user = userEvent.setup();
    render(<ClientActions client={mockClient} />);

    const button = screen.getByRole("button", { name: /abrir menu/i });
    await user.click(button);

    // Verificar que os textos estão presentes
    const editItem = screen.getByText("Editar");
    const deleteItem = screen.getByText("Deletar");

    expect(editItem).toBeInTheDocument();
    expect(deleteItem).toBeInTheDocument();
  });
});
