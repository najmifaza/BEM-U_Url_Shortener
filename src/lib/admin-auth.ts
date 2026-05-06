import { createHash } from "crypto";

export const DATABASE_ACCESS_COOKIE_NAME = "njm_database_access";
export const DATABASE_ACCESS_MAX_AGE = 60 * 60 * 8;

export const getDatabaseAccessToken = () => {
  const password = process.env.ADMIN_EDIT_PASSWORD;

  if (!password) {
    return null;
  }

  return createHash("sha256")
    .update(`database-access:${password}`)
    .digest("base64url");
};

export const hasDatabaseAccess = (cookieValue?: string | null) => {
  const expectedToken = getDatabaseAccessToken();

  if (!expectedToken) {
    return false;
  }

  return cookieValue === expectedToken;
};
