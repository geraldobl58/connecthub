/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContractsActions } from "./contracts-actions";
import { useDeleteContract } from "../hooks/useContracts";
import { ContractResponse } from "../schemas/contract";

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

vi.mock("../hooks/useContracts", () => ({
  useDeleteContract: vi.fn(),
}));

describe("ContractsActions", () => {
  const mockPush = vi.fn();
  const mockMutate = vi.fn();
  const mockConfirm = vi.fn();

  const mockContract: ContractResponse = {
    id: "123",
    title: "Contrato de Teste",
    identifier: "CTR-001",
    content: "Conteúdo do contrato",
    initialEffectiveDate: "2024-01-15T12:00:00.000Z",
    finalEffectiveDate: "2024-12-31T12:00:00.000Z",
    clientId: "client-123",
    clients: {
      id: "client-123",
      name: "Cliente Teste",
      email: "cliente@example.com",
      address: "Rua Teste",
      number: "123",
      neighborhood: "Centro",
      zipCode: "12345-678",
      complement: "Apto 101",
      phone: "(11) 1234-5678",
      createdAt: "2024-01-01T12:00:00.000Z",
      updatedAt: "2024-01-01T12:00:00.000Z",
    },
    signedAt: "2024-01-15T10:30:00.000Z",
    createdAt: "2024-01-15T12:00:00.000Z",
    updatedAt: "2024-01-15T12:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock do useRouter
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    // Mock do useDeleteContract
    vi.mocked(useDeleteContract).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    // Mock do window.confirm
    global.confirm = mockConfirm;
  });

  it("should render dropdown menu button", () => {
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Abrir menu")).toBeInTheDocument();
  });

  it("should show menu items when dropdown is opened", async () => {
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Editar")).toBeInTheDocument();
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });
  });

  it("should navigate to edit page when edit is clicked", async () => {
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Editar")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Editar");
    await user.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/contracts/123");
  });

  it("should show confirmation dialog when delete is clicked", async () => {
    mockConfirm.mockReturnValue(false);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith(
      "Tem certeza que deseja deletar o contrato Contrato de Teste?"
    );
  });

  it("should not delete contract when confirmation is cancelled", async () => {
    mockConfirm.mockReturnValue(false);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should delete contract when confirmation is accepted", async () => {
    mockConfirm.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it("should show success toast when delete is successful", async () => {
    mockConfirm.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Capturar e executar o callback onSuccess
    const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
    onSuccessCallback({ success: true });

    expect(toast.success).toHaveBeenCalledWith("Contrato deletado com sucesso!");
  });

  it("should show error toast when delete fails with error message", async () => {
    mockConfirm.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Capturar e executar o callback onSuccess com erro
    const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
    onSuccessCallback({ success: false, message: "Erro customizado" });

    expect(toast.error).toHaveBeenCalledWith("Erro customizado");
  });

  it("should show default error toast when delete fails without message", async () => {
    mockConfirm.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Capturar e executar o callback onSuccess com erro sem mensagem
    const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
    onSuccessCallback({ success: false });

    expect(toast.error).toHaveBeenCalledWith("Erro ao deletar contrato");
  });

  it("should show error toast when mutation throws error", async () => {
    mockConfirm.mockReturnValue(true);
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    // Capturar e executar o callback onError
    const onErrorCallback = mockMutate.mock.calls[0][1].onError;
    onErrorCallback();

    expect(toast.error).toHaveBeenCalledWith("Erro ao deletar contrato");
  });

  it("should disable delete button when isPending is true", async () => {
    vi.mocked(useDeleteContract).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar").closest("div");
    expect(deleteButton).toHaveAttribute("data-disabled");
  });

  it("should render button with correct classes", () => {
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8", "w-8", "p-0");
  });

  it("should have red text color on delete menu item", async () => {
    const user = userEvent.setup();
    render(<ContractsActions contract={mockContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      const deleteButton = screen.getByText("Deletar").closest("div");
      expect(deleteButton).toHaveClass("text-red-600");
    });
  });

  it("should work with different contract id", async () => {
    const differentContract = {
      ...mockContract,
      id: "456",
    };

    const user = userEvent.setup();
    render(<ContractsActions contract={differentContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Editar")).toBeInTheDocument();
    });

    const editButton = screen.getByText("Editar");
    await user.click(editButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/contracts/456");
  });

  it("should work with different contract title in confirmation", async () => {
    const differentContract = {
      ...mockContract,
      title: "Outro Contrato",
    };

    mockConfirm.mockReturnValue(false);
    const user = userEvent.setup();
    render(<ContractsActions contract={differentContract} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Deletar")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Deletar");
    await user.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith(
      "Tem certeza que deseja deletar o contrato Outro Contrato?"
    );
  });
});
