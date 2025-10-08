/**
 * Query keys centralizadas para consistentes entre hooks
 */
export const queryKeys = {
  // Auth
  user: ["user"],

  // Users
  users: ["users"],
  usersList: (params?: unknown) => ["users", params],
  userById: (id: string) => ["user", id],

  // Owners
  owners: ["owners"],
  ownersList: (params?: unknown) => ["owners", params],
  ownerById: (id: string) => ["owner", id],

  // Properties
  properties: ["properties"],
  propertiesList: (params?: unknown) => ["properties", params],
  propertyById: (id: string) => ["property", id],

  // Plans
  currentPlan: ["currentPlan"],
  planHistory: ["planHistory"],
};
