export const convertImageToWebp = async (
  file: File,
  quality = 0.85
): Promise<File> => {
  if (file.type === "image/webp") return file;

  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image",
  });
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );
  if (!blob) return file;

  const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
  return new File([blob], name, { type: "image/webp" });
};
