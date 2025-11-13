/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { clientsColumns } from "./columns";
import { ClientResponse } from "../schemas/client";

// Mock do ClientActions
vi.mock("./client-actions", () => ({
  ClientActions: ({ client }: { client: ClientResponse }) => (
    <div data-testid="client-actions">{client.id}</div>
  ),
}));

describe("clientsColumns", () => {
  const mockClient: ClientResponse = {
    id: "123",
    name: "Test Client",
    email: "test@example.com",
    address: "Rua Teste",
    number: "123",
    neighborhood: "Centro",
    zipCode: "12345-678",
    complement: "Apto 101",
    phone: "(11) 1234-5678",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  };

  const createMockRow = (client: ClientResponse) => ({
    original: client,
    getValue: (key: string) => (client as any)[key],
  });

  it("should have correct number of columns", () => {
    expect(clientsColumns).toHaveLength(6);
  });

  it("should have correct column accessorKeys", () => {
    const accessorKeys = clientsColumns
      .filter((col) => "accessorKey" in col)
      .map((col) => col.accessorKey);

    expect(accessorKeys).toEqual([
      "name",
      "email",
      "neighborhood",
      "phone",
      "createdAt",
    ]);
  });

  it("should have correct column headers", () => {
    const headers = clientsColumns
      .filter((col) => "header" in col)
      .map((col) => col.header);

    expect(headers).toEqual([
      "Nome",
      "Email",
      "Bairro",
      "Telefone",
      "Criado em",
    ]);
  });

  it("should render name column with font-medium class", () => {
    const nameColumn = clientsColumns[0];
    const row = createMockRow(mockClient);

    const cell = nameColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    const nameElement = container.querySelector(".font-medium");
    expect(nameElement).toBeInTheDocument();
    expect(nameElement?.textContent).toBe("Test Client");
  });

  it("should render email column correctly", () => {
    const emailColumn = clientsColumns[1];
    const row = createMockRow(mockClient);

    const cell = emailColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(container.textContent).toBe("test@example.com");
  });

  it("should render neighborhood column correctly", () => {
    const neighborhoodColumn = clientsColumns[2];
    const row = createMockRow(mockClient);

    const cell = neighborhoodColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(container.textContent).toBe("Centro");
  });

  it("should render phone column correctly", () => {
    const phoneColumn = clientsColumns[3];
    const row = createMockRow(mockClient);

    const cell = phoneColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(container.textContent).toBe("(11) 1234-5678");
  });

  it("should render dash when phone is empty", () => {
    const phoneColumn = clientsColumns[3];
    const clientWithoutPhone = { ...mockClient, phone: "" };
    const row = createMockRow(clientWithoutPhone);

    const cell = phoneColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(container.textContent).toBe("-");
  });

  it("should render dash when phone is null", () => {
    const phoneColumn = clientsColumns[3];
    const clientWithoutPhone = { ...mockClient, phone: null as any };
    const row = createMockRow(clientWithoutPhone);

    const cell = phoneColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    expect(container.textContent).toBe("-");
  });

  it("should render createdAt column in pt-BR format", () => {
    const createdAtColumn = clientsColumns[4];
    const row = createMockRow(mockClient);

    const cell = createdAtColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    // A data "2024-01-15" deve ser formatada como "15/01/2024" em pt-BR
    expect(container.textContent).toBe("15/01/2024");
  });

  it("should render actions column with ClientActions component", () => {
    const actionsColumn = clientsColumns[5];
    const row = createMockRow(mockClient);

    const cell = actionsColumn.cell;
    render(<div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>);

    const actionsElement = screen.getByTestId("client-actions");
    expect(actionsElement).toBeInTheDocument();
    expect(actionsElement.textContent).toBe("123");
  });

  it("should have id 'actions' for actions column", () => {
    const actionsColumn = clientsColumns[5];
    expect(actionsColumn.id).toBe("actions");
  });

  it("should have enableHiding false for actions column", () => {
    const actionsColumn = clientsColumns[5];
    expect(actionsColumn.enableHiding).toBe(false);
  });

  it("should have accessorKey 'name' for name column", () => {
    const nameColumn = clientsColumns[0];
    expect("accessorKey" in nameColumn && nameColumn.accessorKey).toBe("name");
  });

  it("should have header 'Nome' for name column", () => {
    const nameColumn = clientsColumns[0];
    expect(nameColumn.header).toBe("Nome");
  });

  it("should have accessorKey 'email' for email column", () => {
    const emailColumn = clientsColumns[1];
    expect("accessorKey" in emailColumn && emailColumn.accessorKey).toBe("email");
  });

  it("should have header 'Email' for email column", () => {
    const emailColumn = clientsColumns[1];
    expect(emailColumn.header).toBe("Email");
  });

  it("should have accessorKey 'neighborhood' for neighborhood column", () => {
    const neighborhoodColumn = clientsColumns[2];
    expect("accessorKey" in neighborhoodColumn && neighborhoodColumn.accessorKey).toBe("neighborhood");
  });

  it("should have header 'Bairro' for neighborhood column", () => {
    const neighborhoodColumn = clientsColumns[2];
    expect(neighborhoodColumn.header).toBe("Bairro");
  });

  it("should have accessorKey 'phone' for phone column", () => {
    const phoneColumn = clientsColumns[3];
    expect("accessorKey" in phoneColumn && phoneColumn.accessorKey).toBe("phone");
  });

  it("should have header 'Telefone' for phone column", () => {
    const phoneColumn = clientsColumns[3];
    expect(phoneColumn.header).toBe("Telefone");
  });

  it("should have accessorKey 'createdAt' for createdAt column", () => {
    const createdAtColumn = clientsColumns[4];
    expect("accessorKey" in createdAtColumn && createdAtColumn.accessorKey).toBe("createdAt");
  });

  it("should have header 'Criado em' for createdAt column", () => {
    const createdAtColumn = clientsColumns[4];
    expect(createdAtColumn.header).toBe("Criado em");
  });

  it("should render all columns with different client data", () => {
    const differentClient: ClientResponse = {
      id: "456",
      name: "Another Client",
      email: "another@example.com",
      address: "Rua Nova",
      number: "456",
      neighborhood: "Vila Nova",
      zipCode: "98765-432",
      complement: "Casa 2",
      phone: "(21) 9876-5432",
      createdAt: "2024-02-20T15:30:00.000Z",
      updatedAt: "2024-02-20T15:30:00.000Z",
    };

    const row = createMockRow(differentClient);

    // Testar coluna de nome
    const nameColumn = clientsColumns[0];
    const nameCell = nameColumn.cell;
    const { container: nameContainer } = render(
      <div>{typeof nameCell === "function" ? nameCell({ row } as any) : nameCell}</div>
    );
    expect(nameContainer.textContent).toBe("Another Client");

    // Testar coluna de email
    const emailColumn = clientsColumns[1];
    const emailCell = emailColumn.cell;
    const { container: emailContainer } = render(
      <div>{typeof emailCell === "function" ? emailCell({ row } as any) : emailCell}</div>
    );
    expect(emailContainer.textContent).toBe("another@example.com");

    // Testar coluna de bairro
    const neighborhoodColumn = clientsColumns[2];
    const neighborhoodCell = neighborhoodColumn.cell;
    const { container: neighborhoodContainer } = render(
      <div>{typeof neighborhoodCell === "function" ? neighborhoodCell({ row } as any) : neighborhoodCell}</div>
    );
    expect(neighborhoodContainer.textContent).toBe("Vila Nova");

    // Testar coluna de telefone
    const phoneColumn = clientsColumns[3];
    const phoneCell = phoneColumn.cell;
    const { container: phoneContainer } = render(
      <div>{typeof phoneCell === "function" ? phoneCell({ row } as any) : phoneCell}</div>
    );
    expect(phoneContainer.textContent).toBe("(21) 9876-5432");
  });

  it("should handle invalid date format gracefully", () => {
    const createdAtColumn = clientsColumns[4];
    const clientWithInvalidDate = {
      ...mockClient,
      createdAt: "invalid-date",
    };
    const row = createMockRow(clientWithInvalidDate);

    const cell = createdAtColumn.cell;
    const { container } = render(
      <div>{typeof cell === "function" ? cell({ row } as any) : cell}</div>
    );

    // Invalid date should render as "Invalid Date" ou similar
    expect(container.textContent).toBeTruthy();
  });

  it("should export clientsColumns as an array", () => {
    expect(Array.isArray(clientsColumns)).toBe(true);
  });
});
