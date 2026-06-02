export function getErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as {
    error?: {
      message?: string;
    };
  };

  return apiError?.error?.message ?? fallback;
}
