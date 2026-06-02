export function buildFormData<T extends object>(data: T, file?: File, fileKey?: string): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (file && fileKey) {
    formData.append(fileKey, file);
  }

  return formData;
}
