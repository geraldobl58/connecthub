import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getContractsAction,
  getContractByIdAction,
  createContractAction,
  updateContractAction,
  deleteContractAction,
} from "./contract";
import * as contractHttp from "../http/contract";

// Mock do m�dulo HTTP
vi.mock("../http/contract", () => ({
  getContracts: vi.fn(),
  getContractById: vi.fn(),
  createContract: vi.fn(),
  updateContract: vi.fn(),
  deleteContract: vi.fn(),
}));

describe("Contract Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getContractsAction", () => {
    it("should return paginated contracts successfully", async () => {
      const mockResponse = {
        data: [
          {
            id: "1",
            title: "Contract 1",
            identifier: "CTR-001",
            content: "Content 1",
            initialEffectiveDate: new Date().toISOString(),
            finalEffectiveDate: new Date().toISOString(),
            signedAt: new Date().toISOString(),
            clientId: "client-1",
            clients: {
              id: "client-1",
              name: "Client 1",
              email: "client1@example.com",
              address: "Test",
              number: "123",
              neighborhood: "Test",
              zipCode: "12345-678",
              complement: "Test",
              phone: "(11) 1234-5678",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
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

      vi.mocked(contractHttp.getContracts).mockResolvedValue(mockResponse);

      const result = await getContractsAction({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.message).toBe("Contratos recuperados com sucesso");
    });

    it("should handle errors", async () => {
      vi.mocked(contractHttp.getContracts).mockRejectedValue(
        new Error("Network error")
      );

      const result = await getContractsAction();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao recuperar contratos");
    });
  });

  describe("getContractByIdAction", () => {
    it("should return contract by id successfully", async () => {
      const mockContract = {
        id: "1",
        title: "Test Contract",
        identifier: "CTR-001",
        content: "Test Content",
        initialEffectiveDate: new Date().toISOString(),
        finalEffectiveDate: new Date().toISOString(),
        signedAt: new Date().toISOString(),
        clientId: "client-1",
        clients: {
          id: "client-1",
          name: "Test Client",
          email: "test@example.com",
          address: "Test Address",
          number: "123",
          neighborhood: "Test",
          zipCode: "12345-678",
          complement: "Test",
          phone: "(11) 1234-5678",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(contractHttp.getContractById).mockResolvedValue(mockContract);

      const result = await getContractByIdAction("1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockContract);
      expect(result.message).toBe("Contrato recuperado com sucesso");
    });

    it("should handle errors", async () => {
      vi.mocked(contractHttp.getContractById).mockRejectedValue(
        new Error("Not found")
      );

      const result = await getContractByIdAction("999");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao recuperar contrato");
    });
  });

  describe("createContractAction", () => {
    it("should create contract successfully", async () => {
      const newContract = {
        title: "New Contract",
        identifier: "CTR-002",
        content: "New Content",
        initialEffectiveDate: new Date().toISOString(),
        finalEffectiveDate: new Date().toISOString(),
        signedAt: new Date().toISOString(),
        clientId: "client-1",
      };

      const createdContract = {
        id: "123",
        title: "New Contract",
        identifier: "CTR-002",
        content: "New Content",
        initialEffectiveDate: newContract.initialEffectiveDate,
        finalEffectiveDate: newContract.finalEffectiveDate,
        signedAt: newContract.signedAt,
        clientId: "client-1",
        clients: {
          id: "client-1",
          name: "Test Client",
          email: "test@example.com",
          address: "Test",
          number: "123",
          neighborhood: "Test",
          zipCode: "12345-678",
          complement: "Test",
          phone: "(11) 1234-5678",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(contractHttp.createContract).mockResolvedValue(
        createdContract
      );

      const result = await createContractAction(newContract);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdContract);
      expect(result.message).toBe("Contrato criado com sucesso");
    });

    it("should handle errors when creating contract", async () => {
      vi.mocked(contractHttp.createContract).mockRejectedValue(
        new Error("Validation error")
      );

      const result = await createContractAction({
        title: "Test",
        identifier: "CTR-001",
        content: "Test",
        initialEffectiveDate: new Date().toISOString(),
        finalEffectiveDate: new Date().toISOString(),
        signedAt: new Date().toISOString(),
        clientId: "client-1",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao criar contrato");
    });
  });

  describe("updateContractAction", () => {
    it("should update contract successfully", async () => {
      const updateData = {
        title: "Updated Title",
        content: "Updated Content",
      };

      const updatedContract = {
        id: "1",
        title: "Updated Title",
        identifier: "CTR-001",
        content: "Updated Content",
        initialEffectiveDate: new Date().toISOString(),
        finalEffectiveDate: new Date().toISOString(),
        signedAt: new Date().toISOString(),
        clientId: "client-1",
        clients: {
          id: "client-1",
          name: "Test Client",
          email: "test@example.com",
          address: "Test",
          number: "123",
          neighborhood: "Test",
          zipCode: "12345-678",
          complement: "Test",
          phone: "(11) 1234-5678",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(contractHttp.updateContract).mockResolvedValue(
        updatedContract
      );

      const result = await updateContractAction("1", updateData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedContract);
      expect(result.message).toBe("Contrato atualizado com sucesso");
    });

    it("should handle update errors", async () => {
      vi.mocked(contractHttp.updateContract).mockRejectedValue(
        new Error("Not found")
      );

      const result = await updateContractAction("999", { title: "Test" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao atualizar contrato");
    });
  });

  describe("deleteContractAction", () => {
    it("should delete contract successfully", async () => {
      vi.mocked(contractHttp.deleteContract).mockResolvedValue(undefined);

      const result = await deleteContractAction("1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Contrato deletado com sucesso");
      expect(contractHttp.deleteContract).toHaveBeenCalledWith("1");
    });

    it("should handle delete errors", async () => {
      vi.mocked(contractHttp.deleteContract).mockRejectedValue(
        new Error("Cannot delete")
      );

      const result = await deleteContractAction("1");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Erro inesperado ao deletar contrato");
    });
  });
});
