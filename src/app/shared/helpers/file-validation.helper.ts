export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPG, PNG and WEBP files are allowed';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size cannot exceed 5MB';
  }

  return null;
}
