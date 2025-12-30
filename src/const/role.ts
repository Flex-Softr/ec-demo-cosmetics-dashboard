export const ROLES = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
} as const;

export type TRole = (typeof ROLES)[keyof typeof ROLES];

export const roleList = Object.values(ROLES);
