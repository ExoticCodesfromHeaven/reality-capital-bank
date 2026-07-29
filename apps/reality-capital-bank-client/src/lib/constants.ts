export const APP_NAME = "Reality Capital Bank";

export const APP_SHORT = "RCB";

export const COMPANY = "Reality Capital Bank";

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export const USER_STATUS = {
  EMAIL_PENDING: "EMAIL_PENDING",
  KYC_PENDING: "KYC_PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  FROZEN: "FROZEN",
  REJECTED: "REJECTED",
} as const;
