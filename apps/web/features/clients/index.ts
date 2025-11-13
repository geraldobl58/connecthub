// Schemas
export * from "./schemas/client";

// Types
export * from "./types/client";

// HTTP
export * from "./http/client";

// Actions
export {
  getClientsAction,
  getAllClientsAction,
  getClientByIdAction,
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from "./actions/client";

// Hooks
export {
  useClients,
  useAllClients,
  useClient,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "./hooks/useClients";
