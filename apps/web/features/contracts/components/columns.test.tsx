/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { contractsColumns } from "./columns";
import { ContractResponse } from "../schemas/contract";

// Mock do componente ContractsActions
vi.mock("./contracts-actions", () => ({
  ContractsActions: ({ contract }: { contract: ContractResponse }) => (
    <div data-testid="contracts-actions">{contract.id}</div>
  ),
}));

describe("contractsColumns", () => {
  const mockContract: ContractResponse = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Contrato de Prestação de Serviços",
    identifier: "CTR-2024-001",
    content: "Conteúdo do contrato...",
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
    createdAt: "2024-01-01T12:00:00.000Z",
    updatedAt: "2024-01-01T12:00:00.000Z",
  };

  const createMockRow = (contract: ContractResponse) => ({
    original: contract,
    getValue: (key: string) => {
      if (key === "clients.name") return contract.clients?.name;
      return (contract as any)[key];
    },
  });

  it("should have 7 columns", () => {
    expect(contractsColumns).toHaveLength(7);
  });

  it("should render title column with font-medium class", () => {
    const titleColumn = contractsColumns[0];
    const row = createMockRow(mockContract);

    expect("accessorKey" in titleColumn && titleColumn.accessorKey).toBe(
      "title"
    );
    expect(titleColumn.header).toBe("Título");

    const cell = titleColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("Contrato de Prestação de Serviços")).toBeInTheDocument();
    const titleDiv = container.querySelector(".font-medium");
    expect(titleDiv).toBeInTheDocument();
  });

  it("should render identifier column", () => {
    const identifierColumn = contractsColumns[1];
    const row = createMockRow(mockContract);

    expect(
      "accessorKey" in identifierColumn && identifierColumn.accessorKey
    ).toBe("identifier");
    expect(identifierColumn.header).toBe("Identificador");

    const cell = identifierColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("CTR-2024-001")).toBeInTheDocument();
  });

  it("should render client name column", () => {
    const clientColumn = contractsColumns[2];
    const row = createMockRow(mockContract);

    expect("accessorKey" in clientColumn && clientColumn.accessorKey).toBe(
      "clients.name"
    );
    expect(clientColumn.header).toBe("Cliente");

    const cell = clientColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("Cliente Teste")).toBeInTheDocument();
  });

  it("should render '-' when client name is null", () => {
    const clientColumn = contractsColumns[2];
    const contractWithoutClient = {
      ...mockContract,
      clients: null,
    };
    const row = createMockRow(contractWithoutClient);

    const cell = clientColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render '-' when clients object exists but name is undefined", () => {
    const clientColumn = contractsColumns[2];
    const contractWithoutClientName = {
      ...mockContract,
      clients: {
        ...mockContract.clients!,
        name: undefined as any,
      },
    };
    const row = createMockRow(contractWithoutClientName);

    const cell = clientColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should render initialEffectiveDate column with pt-BR format", () => {
    const dateColumn = contractsColumns[3];
    const row = createMockRow(mockContract);

    expect("accessorKey" in dateColumn && dateColumn.accessorKey).toBe(
      "initialEffectiveDate"
    );
    expect(dateColumn.header).toBe("Data Inicial");

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    // 2024-01-15 formatado em pt-BR
    expect(screen.getByText("15/01/2024")).toBeInTheDocument();
  });

  it("should render finalEffectiveDate column with pt-BR format", () => {
    const dateColumn = contractsColumns[4];
    const row = createMockRow(mockContract);

    expect("accessorKey" in dateColumn && dateColumn.accessorKey).toBe(
      "finalEffectiveDate"
    );
    expect(dateColumn.header).toBe("Data Final");

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    // 2024-12-31 formatado em pt-BR
    expect(screen.getByText("31/12/2024")).toBeInTheDocument();
  });

  it("should render createdAt column with pt-BR format", () => {
    const createdAtColumn = contractsColumns[5];
    const row = createMockRow(mockContract);

    expect("accessorKey" in createdAtColumn && createdAtColumn.accessorKey).toBe(
      "createdAt"
    );
    expect(createdAtColumn.header).toBe("Criado em");

    const cell = createdAtColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    // 2024-01-01 formatado em pt-BR
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  it("should render actions column", () => {
    const actionsColumn = contractsColumns[6];
    const row = createMockRow(mockContract);

    expect(actionsColumn.id).toBe("actions");
    expect(actionsColumn.header).toBe("Ações");

    const cell = actionsColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    const actionsElement = screen.getByTestId("contracts-actions");
    expect(actionsElement).toBeInTheDocument();
    expect(actionsElement).toHaveTextContent(mockContract.id);
  });

  it("should have correct headers for all columns", () => {
    expect(contractsColumns[0].header).toBe("Título");
    expect(contractsColumns[1].header).toBe("Identificador");
    expect(contractsColumns[2].header).toBe("Cliente");
    expect(contractsColumns[3].header).toBe("Data Inicial");
    expect(contractsColumns[4].header).toBe("Data Final");
    expect(contractsColumns[5].header).toBe("Criado em");
    expect(contractsColumns[6].header).toBe("Ações");
  });

  it("should have correct accessorKeys for data columns", () => {
    expect(
      "accessorKey" in contractsColumns[0] && contractsColumns[0].accessorKey
    ).toBe("title");
    expect(
      "accessorKey" in contractsColumns[1] && contractsColumns[1].accessorKey
    ).toBe("identifier");
    expect(
      "accessorKey" in contractsColumns[2] && contractsColumns[2].accessorKey
    ).toBe("clients.name");
    expect(
      "accessorKey" in contractsColumns[3] && contractsColumns[3].accessorKey
    ).toBe("initialEffectiveDate");
    expect(
      "accessorKey" in contractsColumns[4] && contractsColumns[4].accessorKey
    ).toBe("finalEffectiveDate");
    expect(
      "accessorKey" in contractsColumns[5] && contractsColumns[5].accessorKey
    ).toBe("createdAt");
  });

  it("should not have accessorKey for actions column", () => {
    const actionsColumn = contractsColumns[6];
    expect("accessorKey" in actionsColumn).toBe(false);
    expect(actionsColumn.id).toBe("actions");
  });

  it("should render title with different content", () => {
    const titleColumn = contractsColumns[0];
    const customContract = {
      ...mockContract,
      title: "Contrato de Consultoria",
    };
    const row = createMockRow(customContract);

    const cell = titleColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("Contrato de Consultoria")).toBeInTheDocument();
  });

  it("should render identifier with different format", () => {
    const identifierColumn = contractsColumns[1];
    const customContract = {
      ...mockContract,
      identifier: "CONS-2024-999",
    };
    const row = createMockRow(customContract);

    const cell = identifierColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("CONS-2024-999")).toBeInTheDocument();
  });

  it("should format different initialEffectiveDate correctly", () => {
    const dateColumn = contractsColumns[3];
    const customContract = {
      ...mockContract,
      initialEffectiveDate: "2024-06-30T12:00:00.000Z",
    };
    const row = createMockRow(customContract);

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("30/06/2024")).toBeInTheDocument();
  });

  it("should format different finalEffectiveDate correctly", () => {
    const dateColumn = contractsColumns[4];
    const customContract = {
      ...mockContract,
      finalEffectiveDate: "2025-03-15T12:00:00.000Z",
    };
    const row = createMockRow(customContract);

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("15/03/2025")).toBeInTheDocument();
  });

  it("should format different createdAt correctly", () => {
    const createdAtColumn = contractsColumns[5];
    const customContract = {
      ...mockContract,
      createdAt: "2024-11-20T12:00:00.000Z",
    };
    const row = createMockRow(customContract);

    const cell = createdAtColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("20/11/2024")).toBeInTheDocument();
  });

  it("should render different client names", () => {
    const clientColumn = contractsColumns[2];
    const customContract = {
      ...mockContract,
      clients: {
        ...mockContract.clients!,
        name: "Empresa XYZ Ltda",
      },
    };
    const row = createMockRow(customContract);

    const cell = clientColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("Empresa XYZ Ltda")).toBeInTheDocument();
  });

  it("should handle empty string client name", () => {
    const clientColumn = contractsColumns[2];
    const customContract = {
      ...mockContract,
      clients: {
        ...mockContract.clients!,
        name: "",
      },
    };
    const row = createMockRow(customContract);

    const cell = clientColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    // Empty string is falsy, should render "-"
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should pass correct contract to ContractsActions", () => {
    const actionsColumn = contractsColumns[6];
    const customContract = {
      ...mockContract,
      id: "custom-id-456",
    };
    const row = createMockRow(customContract);

    const cell = actionsColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    const actionsElement = screen.getByTestId("contracts-actions");
    expect(actionsElement).toHaveTextContent("custom-id-456");
  });

  it("should render all cells with correct structure", () => {
    contractsColumns.forEach((column) => {
      const row = createMockRow(mockContract);
      const cell = column.cell;

      if (typeof cell === "function") {
        const { container } = render(
          <div>{cell({ row } as any)}</div>
        );
        expect(container.querySelector("div")).toBeInTheDocument();
      }
    });
  });

  it("should handle date edge cases - start of year", () => {
    const dateColumn = contractsColumns[3];
    const customContract = {
      ...mockContract,
      initialEffectiveDate: "2024-01-01T12:00:00.000Z",
    };
    const row = createMockRow(customContract);

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  it("should handle date edge cases - end of year", () => {
    const dateColumn = contractsColumns[4];
    const customContract = {
      ...mockContract,
      finalEffectiveDate: "2024-12-31T12:00:00.000Z",
    };
    const row = createMockRow(customContract);

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("31/12/2024")).toBeInTheDocument();
  });

  it("should handle leap year dates", () => {
    const dateColumn = contractsColumns[3];
    const customContract = {
      ...mockContract,
      initialEffectiveDate: "2024-02-29T12:00:00.000Z", // 2024 é ano bissexto
    };
    const row = createMockRow(customContract);

    const cell = dateColumn.cell;
    render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(screen.getByText("29/02/2024")).toBeInTheDocument();
  });
});
