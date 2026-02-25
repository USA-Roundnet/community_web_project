export const parseJsonSafely = async <T = unknown>(
  response: Response
): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};
