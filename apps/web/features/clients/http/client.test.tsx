/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClients,
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "./client";
import { api } from "@/lib/api-client";

// Mock do api-client
vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Client HTTP Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClients", () => {
    it("should fetch clients without parameters", async () => {
      const mockResponse = {
        data: [
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
        ],
        total: 1,
        page: 1,
        limit: 10,
        pageSize: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      const result = await getClients();

      expect(api.get).toHaveBeenCalledWith("clients");
      expect(result).toEqual(mockResponse);
    });

    it("should fetch clients with page parameter", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 2,
        limit: 10,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: true,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      await getClients({ page: 2 });

      expect(api.get).toHaveBeenCalledWith("clients?page=2");
    });

    it("should fetch clients with limit parameter", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      await getClients({ limit: 20 });

      expect(api.get).toHaveBeenCalledWith("clients?limit=20");
    });

    it("should fetch clients with search parameter", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      await getClients({ search: "test" });

      expect(api.get).toHaveBeenCalledWith("clients?search=test");
    });

    it("should fetch clients with multiple parameters", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 3,
        limit: 25,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: true,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      await getClients({ page: 3, limit: 25, search: "john" });

      expect(api.get).toHaveBeenCalledWith(
        "clients?page=3&limit=25&search=john"
      );
    });

    it("should handle api errors", async () => {
      vi.mocked(api.get).mockRejectedValue(new Error("Network error"));

      await expect(getClients()).rejects.toThrow("Network error");
    });
  });

  describe("getAllClients", () => {
    it("should fetch all clients without pagination", async () => {
      const mockClients = [
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

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockClients),
      } as any);

      const result = await getAllClients();

      expect(api.get).toHaveBeenCalledWith("clients/list/all");
      expect(result).toEqual(mockClients);
      expect(result).toHaveLength(2);
    });

    it("should handle api errors", async () => {
      vi.mocked(api.get).mockRejectedValue(new Error("Server error"));

      await expect(getAllClients()).rejects.toThrow("Server error");
    });
  });

  describe("getClientById", () => {
    it("should fetch client by id", async () => {
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

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockClient),
      } as any);

      const result = await getClientById("123");

      expect(api.get).toHaveBeenCalledWith("clients/123");
      expect(result).toEqual(mockClient);
    });

    it("should handle not found error", async () => {
      vi.mocked(api.get).mockRejectedValue(new Error("Client not found"));

      await expect(getClientById("999")).rejects.toThrow("Client not found");
    });
  });

  describe("createClient", () => {
    it("should create a new client", async () => {
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
        id: "456",
        ...newClient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(api.post).mockResolvedValue({
        json: () => Promise.resolve(createdClient),
      } as any);

      const result = await createClient(newClient);

      expect(api.post).toHaveBeenCalledWith("clients", {
        json: newClient,
      });
      expect(result).toEqual(createdClient);
    });

    it("should handle validation errors", async () => {
      const invalidClient = {
        name: "",
        email: "invalid-email",
        address: "",
        number: "",
        neighborhood: "",
        zipCode: "",
        complement: "",
        phone: "",
      };

      vi.mocked(api.post).mockRejectedValue(new Error("Validation failed"));

      await expect(createClient(invalidClient)).rejects.toThrow(
        "Validation failed"
      );
    });
  });

  describe("updateClient", () => {
    it("should update an existing client", async () => {
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const updatedClient = {
        id: "123",
        name: "Updated Name",
        email: "updated@example.com",
        address: "Rua Teste",
        number: "123",
        neighborhood: "Centro",
        zipCode: "12345-678",
        complement: "Apto 101",
        phone: "(11) 1234-5678",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(api.patch).mockResolvedValue({
        json: () => Promise.resolve(updatedClient),
      } as any);

      const result = await updateClient("123", updateData);

      expect(api.patch).toHaveBeenCalledWith("clients/123", {
        json: updateData,
      });
      expect(result).toEqual(updatedClient);
    });

    it("should update client with partial data", async () => {
      const updateData = {
        phone: "(99) 9999-9999",
      };

      const updatedClient = {
        id: "123",
        name: "Test Client",
        email: "test@example.com",
        address: "Rua Teste",
        number: "123",
        neighborhood: "Centro",
        zipCode: "12345-678",
        complement: "Apto 101",
        phone: "(99) 9999-9999",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(api.patch).mockResolvedValue({
        json: () => Promise.resolve(updatedClient),
      } as any);

      const result = await updateClient("123", updateData);

      expect(api.patch).toHaveBeenCalledWith("clients/123", {
        json: updateData,
      });
      expect(result.phone).toBe("(99) 9999-9999");
    });

    it("should handle not found error when updating", async () => {
      vi.mocked(api.patch).mockRejectedValue(new Error("Client not found"));

      await expect(updateClient("999", { name: "Test" })).rejects.toThrow(
        "Client not found"
      );
    });
  });

  describe("deleteClient", () => {
    it("should delete a client", async () => {
      vi.mocked(api.delete).mockResolvedValue(undefined as any);

      await deleteClient("123");

      expect(api.delete).toHaveBeenCalledWith("clients/123");
    });

    it("should handle not found error when deleting", async () => {
      vi.mocked(api.delete).mockRejectedValue(new Error("Client not found"));

      await expect(deleteClient("999")).rejects.toThrow("Client not found");
    });

    it("should handle conflict error when deleting client with contracts", async () => {
      vi.mocked(api.delete).mockRejectedValue(
        new Error("Cliente possui contratos")
      );

      await expect(deleteClient("123")).rejects.toThrow(
        "Cliente possui contratos"
      );
    });
  });

  describe("URL parameter encoding", () => {
    it("should encode search parameter with special characters", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      await getClients({ search: "João & Maria" });

      // Verificar que foi chamado com um parâmetro search que contém caracteres codificados
      expect(api.get).toHaveBeenCalled();
      const callArg = vi.mocked(api.get).mock.calls[0][0];
      expect(callArg).toContain("clients?search=");
      expect(callArg).toContain("%26"); // & codificado
    });

    it("should handle empty string search parameter", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };

      vi.mocked(api.get).mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      } as any);

      await getClients({ search: "" });

      expect(api.get).toHaveBeenCalledWith("clients");
    });
  });

  describe("Response handling", () => {
    it("should correctly parse json response from getClients", async () => {
      const mockResponse = {
        data: [{ id: "1", name: "Test" }],
        total: 1,
        page: 1,
        limit: 10,
        pageSize: 1,
        hasNextPage: false,
        hasPrevPage: false,
      };

      const mockJson = vi.fn().mockResolvedValue(mockResponse);
      vi.mocked(api.get).mockResolvedValue({
        json: mockJson,
      } as any);

      const result = await getClients();

      expect(mockJson).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it("should correctly parse json response from createClient", async () => {
      const newClient = {
        name: "Test",
        email: "test@example.com",
        address: "Test",
        number: "1",
        neighborhood: "Test",
        zipCode: "12345-678",
        complement: "Test",
        phone: "(11) 1234-5678",
      };

      const createdClient = {
        id: "1",
        ...newClient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockJson = vi.fn().mockResolvedValue(createdClient);
      vi.mocked(api.post).mockResolvedValue({
        json: mockJson,
      } as any);

      const result = await createClient(newClient);

      expect(mockJson).toHaveBeenCalled();
      expect(result).toEqual(createdClient);
    });
  });
});
