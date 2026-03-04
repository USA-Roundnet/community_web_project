import type { NavigateFunction } from "react-router-dom";

export const CREATE_DRAFT_KEYS = {
  basicInfo: "tournamentBasicInfo",
  format: "tournamentFormat",
  registration: "tournamentRegistration",
} as const;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const getAuthToken = () => localStorage.getItem("authToken");

export const requireAuthForCreateStep = (
  navigate: NavigateFunction,
  fromPath: string
) => {
  const token = getAuthToken();
  if (token) {
    return token;
  }

  navigate("/login", {
    replace: true,
    state: { from: fromPath },
  });
  return null;
};

export const hasDraft = (storageKey: string) =>
  Boolean(localStorage.getItem(storageKey));

export const readDraftObject = <T extends Record<string, unknown>>(
  storageKey: string,
  fallback: T
): T => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return fallback;
    }
    return {
      ...fallback,
      ...parsed,
    };
  } catch {
    return fallback;
  }
};

export const clearCreateDrafts = () => {
  Object.values(CREATE_DRAFT_KEYS).forEach((storageKey) => {
    localStorage.removeItem(storageKey);
  });
};
