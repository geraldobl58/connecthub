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

  // Plans
  currentPlan: ["currentPlan"],
  planHistory: ["planHistory"],
};
