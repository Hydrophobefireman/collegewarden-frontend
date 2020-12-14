export function nextEvent(obj: EventTarget, evt: string) {
  return new Promise((resolve) =>
    obj.addEventListener(evt, resolve, { once: true })
  );
}
export async function getArrayBufferFromUser(fileData?: File[]) {
  let files: File[] = [];
  if (!fileData) {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    const next = nextEvent(input, "change");
    input.click();
    await next;
    files = Array.from(input.files);
  } else {
    files = fileData;
  }
  return Promise.all(
    files.map(async (file) => ({
      buf: await asArrayBuffer(file),
      name: file.name,
      type: file.type || "application/octet-stream",
    }))
  );
}

function asArrayBuffer(f: File): Promise<ArrayBuffer> {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(f);
  });
}
