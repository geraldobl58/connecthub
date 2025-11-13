import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClientsAction,
  getAllClientsAction,
  getClientByIdAction,
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from "./client";
import * as clientHttp from "../http/client";

// Mock do módulo HTTP
vi.mock("../http/client", () => ({
  getClients: vi.fn(),
  getAllClients: vi.fn(),
  getClientById: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
}));

describe("Client Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClientsAction", () => {
    it("should return paginated clients successfully", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            name: "Client 1",
            email: "client1@example.com",
            complement: "Apto 101",
            phone: "(11) 1234-5678",
            address: "Rua Teste",
            number: "123",
            neighborhood: "Centro",
            zipCode: "12345-678",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Client 2",
            email: "client2@example.com",
            complement: "Apto 101",
            phone: "(11) 1234-5678",
            address: "Rua Teste",
            number: "123",
            neighborhood: "Centro",
            zipCode: "12345-678",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Client 3",
            email: "client3@example.com",
            complement: "Apto 101",
            phone: "(11) 1234-5678",
            address: "Rua Teste",
            number: "123",
            neighborhood: "Centro",
            zipCode: "12345-678",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
        pageSize: 2,
        hasNextPage: false,
        hasPrevPage: false,
      };

      vi.mocked(clientHttp.getClients).mockResolvedValue(mockResponse);

      const result = await getClientsAction({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.message).toBe("Clientes recuperados com sucesso");
    });

    it("should handle errors", async () => {
      vi.mocked(clientHttp.getClients).mockRejectedValue(
        new Error("Network error")
      );

      const result = await getClientsAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao recuperar clientes");
    });
  });

  describe("getAllClientsAction", () => {
    it("should return all clients successfully", async () => {
      const mockClients = [
        {
          id: "1",
          name: "Client 1",
          email: "client1@example.com",
          complement: "Apto 101",
          phone: "(11) 1234-5678",
          address: "Rua Teste",
          number: "123",
          neighborhood: "Centro",
          zipCode: "12345-678",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Client 2",
          email: "client2@example.com",
          complement: "Apto 101",
          phone: "(11) 1234-5678",
          address: "Rua Teste",
          number: "123",
          neighborhood: "Centro",
          zipCode: "12345-678",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Client 3",
          email: "client3@example.com",
          complement: "Apto 101",
          phone: "(11) 1234-5678",
          address: "Rua Teste",
          number: "123",
          neighborhood: "Centro",
          zipCode: "12345-678",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(clientHttp.getAllClients).mockResolvedValue(mockClients);

      const result = await getAllClientsAction();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockClients);
      expect(result.message).toBe("Clientes recuperados com sucesso");
    });

    it("should handle errors when fetching all clients", async () => {
      vi.mocked(clientHttp.getAllClients).mockRejectedValue(new Error("Error"));

      const result = await getAllClientsAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao recuperar clientes");
    });
  });

  describe("getClientByIdAction", () => {
    it("should return client by id successfully", async () => {
      const mockClient = {
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
      };

      vi.mocked(clientHttp.getClientById).mockResolvedValue(mockClient);

      const result = await getClientByIdAction("1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockClient);
      expect(result.message).toBe("Cliente recuperado com sucesso");
    });

    it("should handle errors", async () => {
      vi.mocked(clientHttp.getClientById).mockRejectedValue(
        new Error("Not found")
      );

      const result = await getClientByIdAction("999");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao recuperar cliente");
    });
  });

  describe("createClientAction", () => {
    it("should create client successfully", async () => {
      const newClient = {
        name: "New Client",
        email: "new@example.com",
        address: "Rua Nova",
        number: "456",
        neighborhood: "Novo Bairro",
        zipCode: "98765-432",
        complement: "Sala 202",
        phone: "(11) 9876-5432",
      };

      const createdClient = {
        id: "123",
        ...newClient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(clientHttp.createClient).mockResolvedValue(createdClient);

      const result = await createClientAction(newClient);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdClient);
      expect(result.message).toBe("Cliente criado com sucesso");
    });

    it("should handle errors when creating client", async () => {
      vi.mocked(clientHttp.createClient).mockRejectedValue(
        new Error("Validation error")
      );

      const result = await createClientAction({
        name: "Test",
        email: "test@example.com",
        address: "Test",
        number: "1",
        neighborhood: "Test",
        complement: "Apto 101",
        phone: "(11) 1234-5678",
        zipCode: "12345-678",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao criar cliente");
    });
  });

  describe("updateClientAction", () => {
    it("should update client successfully", async () => {
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const updatedClient = {
        id: "1",
        ...updateData,
        address: "Rua Teste",
        number: "123",
        neighborhood: "Centro",
        zipCode: "12345-678",
        complement: "Apto 101",
        phone: "(11) 1234-5678",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(clientHttp.updateClient).mockResolvedValue(updatedClient);

      const result = await updateClientAction("1", updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedClient);
      expect(result.message).toBe("Cliente atualizado com sucesso");
    });

    it("should handle update errors", async () => {
      vi.mocked(clientHttp.updateClient).mockRejectedValue(
        new Error("Not found")
      );

      const result = await updateClientAction("999", { name: "Test" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao atualizar cliente");
    });
  });

  describe("deleteClientAction", () => {
    it("should delete client successfully", async () => {
      vi.mocked(clientHttp.deleteClient).mockResolvedValue(undefined);

      const result = await deleteClientAction("1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Cliente deletado com sucesso");
      expect(clientHttp.deleteClient).toHaveBeenCalledWith("1");
    });

    it("should handle delete errors", async () => {
      vi.mocked(clientHttp.deleteClient).mockRejectedValue(
        new Error("Has contracts")
      );

      const result = await deleteClientAction("1");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao deletar cliente");
    });
  });
});
