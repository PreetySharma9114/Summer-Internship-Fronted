export class FileUploadHelper {
  static generatePreview(
    file: File,
    callback: (preview: string) => void,
  ): void {
    const reader = new FileReader();

    reader.onload = () => {
      callback(reader.result as string);
    };

    reader.readAsDataURL(file);
  }
}