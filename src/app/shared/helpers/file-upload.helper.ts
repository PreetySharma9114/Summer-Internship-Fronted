export function generatePreview(file: File, callback: (result: string) => void): void {
  const reader = new FileReader();

  reader.onload = () => {
    callback(reader.result as string);
  };

  reader.readAsDataURL(file);
}
